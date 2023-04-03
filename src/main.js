//Llamada a los Canvas
const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;

const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 400;

//Obtiene los paramentos en 2D de los Canvas
const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

//Llama a la carretera
const road = new Road(carCanvas.width / 2,carCanvas.width * 0.9);

//Llama al coche
const N = 1000; //Numero de coches
const cars = generateCars(N);
let bestCar = cars[0];

var BOTcars = 100;

//Número de veces que se muta 
var nMutaciones = 0;
nMutaciones = JSON.parse(localStorage.getItem("nMutaciones"));

//Coje la mejor IA para el coche del archivo que se guarda
if(localStorage.getItem("bestBrain")){
    //Se implementa la parte de mutación (aprendizaje)
    for(let i=0;i<cars.length;i++){
        cars[i].brain = JSON.parse(localStorage.getItem("bestBrain"));
        if(i!=0){
            NeuralNetwork.mutate(cars[i].brain,0.2);
            // El nº es el porcentaje de mutación de la red
        }
    }
    
}

//Array de todos los coches del tráfico
const traffic = [
    new Car(road.getLaneCenter(Math.floor(Math.random()*3)),-100,30,50,"BOT", 2),
    new Car(road.getLaneCenter(Math.floor(Math.random()*3)),-100,30,50,"BOT", 2),
    new Car(road.getLaneCenter(Math.floor(Math.random()*3)),-300,30,50,"BOT", 2),
    new Car(road.getLaneCenter(Math.floor(Math.random()*3)),-300,30,50,"BOT", 2),
    new Car(road.getLaneCenter(Math.floor(Math.random()*3)),-500,30,50,"BOT", 2),
    new Car(road.getLaneCenter(Math.floor(Math.random()*3)),-500,30,50,"BOT", 2),
    new Car(road.getLaneCenter(Math.floor(Math.random()*3)),-700,30,50,"BOT", 2),
    new Car(road.getLaneCenter(Math.floor(Math.random()*3)),-700,30,50,"BOT", 2),
    new Car(road.getLaneCenter(Math.floor(Math.random()*3)),-900,30,50,"BOT", 2),
    new Car(road.getLaneCenter(Math.floor(Math.random()*3)),-900,30,50,"BOT", 2),
    new Car(road.getLaneCenter(Math.floor(Math.random()*3)),-1100,30,50,"BOT", 2),
    new Car(road.getLaneCenter(Math.floor(Math.random()*3)),-1100,30,50,"BOT", 2),
    new Car(road.getLaneCenter(Math.floor(Math.random()*3)),-1300,30,50,"BOT", 2),
    new Car(road.getLaneCenter(Math.floor(Math.random()*3)),-1300,30,50,"BOT", 2),
    new Car(road.getLaneCenter(Math.floor(Math.random()*3)),-1500,30,50,"BOT", 2),

];


//Genera coches de forma aleatoria
for (let i=0;i<BOTcars;i++){
    for (let j= 200;i<BOTcars;j+200){
        traffic.push(new Car(road.getLaneCenter(Math.floor(Math.random()*3)),(-100-j),30,50,"BOT", 2));
    }
    
}

animate();


//Guarda la información del coche que mejor actua en un JSON
function save(){
    localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
    nMutaciones++;
    localStorage.setItem("nMutaciones", JSON.stringify(nMutaciones));
    
}

function discard(){
    localStorage.removeItem("bestBrain");
    localStorage.removeItem("nMutaciones");
    nMutaciones = 0;
}

//Crea el coche
function generateCars(N){
    const cars = [];
    for(let i=1;i<=N;i++){
        //Se le asigna el control por IA "AI" o por los controles "KEYS"
        cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"));
    }
    return cars;
}


function animate(time){
    //Recoje todos los coches del array del trafico
    for(let i=0;i<traffic.length;i++){
        traffic[i].update(road.borders,[]);
    }

    //Actualización del coche y sus colisiones
    for(let i=0;i<cars.length;i++){
        cars[i].update(road.borders, traffic);
    }

   // Busca al coche que lleve la mejor trayectoría
    bestCar = cars.find(c=>c.y == Math.min(...cars.map(c=>c.y)));
    //Los ... sirven para que se lean TODOS los elementos de una lista arrays 
    //generalmente, y los imprime todos seguidos quitando el hecho de que sea una lista.
    
    
    //Se ajusta el borde al limite de la pantalla
    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;

    carCtx.save();
    carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7);



    //Se dibuja la carretera
    road.draw(carCtx);
    //Se dibuja el tráfico
    for(let i=0;i<traffic.length;i++){
        traffic[i].draw(carCtx, "blue");
    }

    //Se dibuja el coche
    carCtx.globalAlpha = 0.2;
    
    for(let i=0;i<cars.length;i++){
        cars[i].draw(carCtx,"red");
    }
    carCtx.globalAlpha = 1;
    bestCar.draw(carCtx,"red", true);



    //Se dibuja el texto de las mutaciones
    networkCtx.textAlign = "start";
    networkCtx.font = "20px arial";
    networkCtx.fillStyle = "green";
    networkCtx.fillText("Nº de mutaciones: " + nMutaciones, 100, 25);


    //Se "limpia a cada FPS para que no quede nada impreso de antes"
    carCtx.restore();

    //Producen la animación del movimiento de las lineas de la network
    networkCtx.lineDashOffset = -time / 50;

    Visualizer.drawNetwork(networkCtx, bestCar.brain);

    requestAnimationFrame(animate);
}