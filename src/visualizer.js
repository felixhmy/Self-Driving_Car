class Visualizer{
    //Muestra la red neuronal en funcionamiento
    static drawNetwork(ctx, network){
        //Tamaño del visualizador en función del tamaño del canvas
        const margin=50;
        const left=margin;
        const top=margin;
        const width=ctx.canvas.width-margin*2;
        const height=ctx.canvas.height-margin*2;

        const levelHeight = height / network.levels.length;

        for(let i=network.levels.length-1;i>=0;i--){
            const levelTop = top + 
                lerp(
                    height - levelHeight,
                    0,
                    network.levels.length == 1
                        ?0.5
                        :i/(network.levels.length-1)
                );
            ctx.setLineDash([7,3]);
            //Se llama al visualizador de niveles
            Visualizer.drawLevel(ctx, network.levels[i],
                left,levelTop,
                width,levelHeight,
                i == network.levels.length-1
                    ?['⇡','⇠','⇢','⇣']
                    :[]
                );
        }
    }
    //Se crea la red en base a los distintos liveles de la neuronal network
    static drawLevel(ctx, level, left, top, width, height,outputLabels){
        const right = left + width;
        const bottom = top + height;

        const {inputs, outputs, weights,biases} = level;

        //Se repasan todas las conexiones entre inputs y outputs y se dibujan
        for(let i=0;i<inputs.length;i++){
            for(let j=0;j<outputs.length;j++){
                ctx.beginPath();

                ctx.moveTo(Visualizer.#getNodeX(inputs,i,left,right), bottom);
                ctx.lineTo(Visualizer.#getNodeX(outputs,j,left,right), top);

                ctx.lineWidth = 2;
                ctx.strokeStyle = getRGBA(weights[i][j]);
                ctx.stroke();
            }
        }

        const nodeRadius = 18;

        //Impresión de los inputs
        for (let i=0;i<inputs.length;i++){
            const x = Visualizer.#getNodeX(inputs,i,left,right);

            ctx.beginPath();
            ctx.arc(x, bottom, nodeRadius, 0, Math.PI*2);
            ctx.fillStyle = "black";
            ctx.fill();

            ctx.beginPath();
            ctx.arc(x, bottom, nodeRadius*0.6, 0, Math.PI*2);
            ctx.fillStyle = getRGBA(inputs[i]);
            ctx.fill();
        }

        //Impresión de los outputs y los biases
        for (let i=0;i<outputs.length;i++){
            const x = Visualizer.#getNodeX(outputs,i,left,right);

            //Outputs
            ctx.beginPath();
            ctx.arc(x, top, nodeRadius, 0, Math.PI*2);
            ctx.fillStyle = "black";
            ctx.fill();

            ctx.beginPath();
            ctx.arc(x, top, nodeRadius*0.6, 0, Math.PI*2);
            ctx.fillStyle = getRGBA(outputs[i]);
            ctx.fill();


            //Biases
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.arc(x, top, nodeRadius*0.8, 0, Math.PI*2);
            ctx.strokeStyle = getRGBA(biases[i]);
            ctx.setLineDash([3,3]);
            ctx.stroke();
            ctx.setLineDash([]);

            //Se dibujan las flechas en los outputs
            if(outputLabels[i]){
                ctx.beginPath();
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillStyle = "black";
                ctx.strokeStyle = "white";
                ctx.font = (nodeRadius*1.5) + "px Arial";
                ctx.fillText(outputLabels[i], x, top + nodeRadius*0.1);
                ctx.lineWidth = 0.5;
                ctx.strokeText(outputLabels[i], x, top + nodeRadius*0.1);
            }
        }

        //Añadido EXTRA para dejarlo mas visible
        for (let i=0;i<level.outputs.length;i++){
            let sum = 0;
            for (let j=0;j<level.inputs.length;j++){
                sum += level.inputs[j] * level.weights[j][i];
            }

            if(sum > level.biases[i]){
                level.outputs[i] = 1;
            }else{
                level.outputs[i] = 0;
            }

        }


        
    }

    //Función privada interna que simplifica el código
    //dejando la formula que calcula las lineas aparte
    static #getNodeX(nodes, index, left, right){
        return lerp(
            left,
            right,
            nodes.length==1
                ?0.5
                :index/(nodes.length-1)
        );
    }
}