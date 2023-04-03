/*
    Este sistema está organizado en niveles (levels), los cuales se pueden plantear
    como un edificio donde tiene distintas plantas. Además, es importante destacar 
    que estos niveles están conectados, es decir, que el techo del primer nivel,
    es también el suelo del segundo nivel.
    El suelo y el techo tienen varias "neuronas" que están conectadas dentro del
    mismo nivel.
    

    En este caso:
    El primer nivel se encuentran los sensores, los cuales mandaran mensajes al resto 
    de la red en función de los obstáculos que se encuentren en el camino.

    El segundo nivel es la parte interna, que se encarga de calcular la mejor solución
    al evento detectado en el primer nivel por los sensores.

    El tercer nivel es el que se encarga de mover el coche en base a las elecciones 
    de los niveles anteriores.
*/

class NeuralNetwork{
    constructor(neuronCounts){
        this.levels = [];
        for(let i=0;i<neuronCounts.length-1;i++){
            this.levels.push(new Level(neuronCounts[i],neuronCounts[i+1]));
        }
        
    }

    /*
        El algoritmo de feedFordward funciona en linea recta, no en circulo,
        por lo que no existen bucles en su acción. Recibe inputs mediante los
        cuales gestiona la respuesta (output) mas óptimo para lograr su objetivo.
    */
    static feedForward(givenInputs, network){
        let outputs = Level.feedForward(givenInputs, network.levels[0]);
        for(let i=1;i<network.levels.length;i++){
            outputs = Level.feedForward(outputs,network.levels[i]);
        }
        return outputs;
    }

    //Modifica la red original para optimizarla
    static mutate(network,amount=1){
        network.levels.forEach(level => {
            for(let i=0;i<level.biases.length;i++){
                level.biases[i] = lerp(
                    level.biases[i],
                    Math.random()*2-1,
                    amount
                )
            }
            for(let i=0;i<level.weights.length;i++){
                for(let j=0;j<level.weights[i].length;j++){
                    level.weights[i][j] = lerp(
                        level.weights[i][j],
                        Math.random()*2-1,
                        amount
                    )
                }
            }
        });
    }


}

//Clase donde se crea la "planta" del edificio
class Level{
    constructor(inputCount, outputCount){
        //Las neuronas se guardan dentro de un array
        //Los inputs son la información recibida
        this.inputs = new Array (inputCount);
        //Los outputs son la información resultante
        this.outputs = new Array (outputCount);
        //Los bias son el valor que toma la información que recibe
        this.biases = new Array (outputCount);

        //Los weights son el grosor del camino
        this.weights = [];

        //Se crea un camino desde una neurona input a cada neurona output
        for (let i=0;i<inputCount;i++){
            this.weights[i] = new Array (outputCount);
        }

        Level.#randomize(this);
    }
    //Metodo para obtener un valor random ajustado a los niveles de la red
    static #randomize(level){
        for(let i=0;i<level.inputs.length;i++){
            for (let j=0;j<level.outputs.length;j++){
                level.weights[i][j] = Math.random()* 2 - 1;
            }
        }

        for(let i=0;i<level.biases.length;i++){
            level.biases[i] = Math.random()* 2 - 1;
        }
    }

    static feedForward(givenInputs, level){
        for(let i=0;i<level.inputs.length;i++){
            level.inputs[i]=givenInputs[i];
        }

        for(let i=0; i<level.outputs.length;i++){
            let sum = 0;
            for(let j=0;j<level.inputs.length;j++){
                sum+=level.inputs[j]*level.weights[j][i];
            }

            if(sum>level.biases[i]){
                level.outputs[i] = 1;
            }else{
                level.outputs[i] = 0;
            }
        }
        return level.outputs;
    }
}