class Car{
    constructor(x,y,width,height, controlType, maxSpeed = 3){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        //Valores "internos" del coche
        this.speed = 0;
        this.acceleration = 0.2;
        this.maxSpeed = maxSpeed;
        this.friction = 0.05;
        this.angle = 0;
        this.damaged = false;

        //La neuronal Network tiene acceso a los controles
        this.useBrain = controlType == "AI";

        //En el main se asigna un valor a controlType donde "AI" es el coche controlado y "BOT" son los bots
        if(controlType!= "BOT"){
            //Llamadas a la clase de los sensores y de los controles
            this.sensor = new Sensor(this);
            //Llamada a la neuronal Network y su definición del numero de neuronas
            this.brain = new NeuralNetwork([this.sensor.rayCount,6,4]);
        }

        this.controls = new Controls(controlType);
    }

    //Update con los datos de los bordes de la carretera
    update(roadBorders, traffic){
        if(!this.damaged){
            this.#move();
            this.polygon = this.#createPolygon();
            this.damaged = this.#assessDamage(roadBorders, traffic);
        }
        
        if(this.sensor){
            //Actualiza la detección de los bordes y del tráfico
            this.sensor.update(roadBorders, traffic);
            //Actualizacia el uso de la neuronal Network
            const offsets = this.sensor.readings.map(s=>s==null?0:1-s.offset);
            const outputs = NeuralNetwork.feedForward(offsets,this.brain);
            //console.log(outputs);

            //Se asigna los controles a la neuronal Network
            if(this.useBrain){
                this.controls.forward = outputs[0];
                this.controls.left = outputs[1];
                this.controls.right = outputs[2];
                this.controls.reverse = outputs[3];
            }
        }
        
    }

    //
    #assessDamage(roadBorders, traffic){
        for(let i=0;i<roadBorders.length;i++){
            if(polysIntersect(this.polygon, roadBorders[i])){
                return true;
            }
        }
        for(let i=0;i<traffic.length;i++){
            if(polysIntersect(this.polygon, traffic[i].polygon)){
                return true;
            }
        }

        return false;
    }

    //Función privada que posiciona las esquinas del coche
    #createPolygon(){
        const points = [];
        const rad = Math.hypot(this.width, this.height)/2;
        const alpha = Math.atan2(this.width, this.height);

        points.push({
            x: this.x - Math.sin(this.angle - alpha) * rad,
            y: this.y - Math.cos(this.angle - alpha) * rad
        });
        points.push({
            x: this.x - Math.sin(this.angle + alpha) * rad,
            y: this.y - Math.cos(this.angle + alpha) * rad
        });
        points.push({
            x: this.x - Math.sin(Math.PI + this.angle - alpha) * rad,
            y: this.y - Math.cos(Math.PI + this.angle - alpha) * rad
        });
        points.push({
            x: this.x - Math.sin(Math.PI + this.angle + alpha) * rad,
            y: this.y - Math.cos(Math.PI + this.angle + alpha) * rad
        });
        return points;
    }


    //Función privada que controla el movimiento del coche
    #move(){
        if(this.controls.forward){
            this.speed += this.acceleration;
        }
        if(this.controls.reverse){
            this.speed -= this.acceleration;
        }
        //Velocidad maxima
        if(this.speed > this.maxSpeed){
            this.speed = this.maxSpeed;
        }
        if(this.speed <- this.maxSpeed / 2){
            this.speed =- this.maxSpeed / 2;
        }

        //Añade fricción al coche para que sea mas realista (y no avance eternamente)
        if(this.speed > 0){
            this.speed -= this.friction;
        }
        if(this.speed < 0){
            this.speed += this.friction;
        }
        if(Math.abs(this.speed) < this.friction){
            this.speed = 0;
        }

        //Invierte los controles para la marcha atras
        if(this.speed != 0){
            const flip = this.speed > 0?1: -1;
            if(this.controls.left){
                this.angle += 0.03 * flip;
            }
            if(this.controls.right){
                this.angle -= 0.03 * flip;
            }
        }
        //Para que se el coche avance a donde mira, en vez de avanzar en diagonal
        this.x -= Math.sin(this.angle) * this.speed;
        this.y -= Math.cos(this.angle) * this.speed;
    }


    //Draw que imprime el coche en pantalla en base a los puntos del polygon
    draw(ctx, color, drawSensor=false){
        if(this.damaged){
            ctx.fillStyle = "darkred"
        }else{
            ctx.fillStyle = color;
        }
        
        ctx.beginPath();

        ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
        for(let i=1;i<this.polygon.length;i++){
            ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
        }
        ctx.fill();

        
        if(this.sensor && drawSensor){
            this.sensor.draw(ctx);
        }
        
    }
}