function cargarEventos(){
    hacerTablero();
}

function hacerTablero(){
    var tablero = $("#tablero"); //Obtener el tablero como objeto JQuery
    var tabla;
    tabla = "<table> <tr> ";
    for (var i = 20; i<=30; i++){
        if(i==22){
            tabla += " <td class='casilla' id='casilla" + i + "'> <img src='recursos/images/casillas/es/prueba.jpg'> </td>";
        }else{
            tabla += " <td class='casilla' id='casilla" + i + "'> <img src='recursos/images/casillas/es/casilla"+i+".jpg'> </td>";
        }
    }
    tabla += " </tr>"; 
    
    
    var j = 31;
    for(var i =19; i>= 11; i--){
        tabla += "<tr>";
        if(i==17) {
            tabla += " <td class='casilla lateral' id='casilla" + i + "'> <img class='izquierda' src='recursos/images/casillas/es/eventoi.jpg'> </td>";            
        } else {
            tabla += " <td class='casilla lateral' id='casilla" + i + "'> <img class='izquierda' src='recursos/images/casillas/es/casilla"+i+".jpg'> </td>";            
        }
        
        if(i==19){
            tabla += " <td id='casilla_central' colspan='9' rowspan='9' > <img class='central' src='recursos/images/casillas/es/central.jpg'> </td>";
        }
        
        if(j==33) {
            tabla += " <td class='casilla lateral' id='casilla" + j + "'> <img class='derecha' src='recursos/images/casillas/es/eventod.jpg'> </td>";
        } else if(j==36) {
            tabla += " <td class='casilla lateral' id='casilla" + j + "'> <img class='derecha' src='recursos/images/casillas/es/pruebad.jpg'> </td>";            
        } else {
            tabla += " <td class='casilla lateral' id='casilla" + j + "'> <img class='derecha' src='recursos/images/casillas/es/casilla"+j+".jpg'> </td>";
        }
        j++;
        tabla += "</tr>";
    }
    
    tabla += " <tr>";
    
    for (var i = 10; i>=0; i--){
        if(i==2){
            tabla += " <td class='casilla' id='casilla" + i + "'> <img src='recursos/images/casillas/es/evento.jpg'> </td>";
        }else if(i==7){
            tabla += " <td class='casilla' id='casilla" + i + "'> <img src='recursos/images/casillas/es/prueba.jpg'> </td>";
        } else {
            tabla += " <td class='casilla' id='casilla" + i + "'> <img src='recursos/images/casillas/es/casilla"+i+".jpg'> </td>";            
        }
    }
    
    tabla += "</tr> </table>";
    
    tablero.html(tabla);
}
