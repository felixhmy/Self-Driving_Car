//Archivo con funciones "utiles" que somn llamadas en otros

//Calculo de la interpolación lineal, es decir, el calculo de una linea desde el punto de inicio hasta el punto final.
function lerp(A,B,t){
    return A + (B - A) * t;
}

//Calcula matematicamente la instersección entre 2 lineas para obtener un punto de "colisión"
function getIntersection(A,B,C,D){ 
    const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
    const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
    const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);
    
    if(bottom != 0){
        const t = tTop / bottom;
        const u = uTop / bottom;
        if(t>=0 && t<=1 && u>=0 && u<=1){
            return {
                x:lerp(A.x,B.x,t),
                y:lerp(A.y,B.y,t),
                offset:t
            }
        }
    }

    return null;
}

//Detecta la colisión entre 2 poligonos
function polysIntersect(poly1, poly2){
    for (let i=0;i<poly1.length;i++){
        for (let j=0;j<poly2.length;j++){
            const touch = getIntersection(
                poly1[i],
                poly1[(i+1)%poly1.length],
                poly2[j],
                poly2[(j+1)%poly2.length]
            );
            if(touch){
                return true;
            }
        }
    }
    return false;
}

//Obtine un color en base a la escala de RGBA
function getRGBA(value){
    const alpha = Math.abs(value);
    const R = value<0?0:255;
    const G = R;
    const B = value>0?0:255;
    return "rgba(" + R + "," + G + "," + B + "," + alpha + ")";
}