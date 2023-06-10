
var syncWS = new WebSocket("ws://127.0.0.1:8080/sync");

syncWS.onopen = function (msg){
    console.log("Conexion establecida con WS Sync");
}

syncWS.onerror = function(e){
    console.log("WS error: " + e);
}

syncWS.onclose = function (event) {
    console.log("Conexion cerrada. Codigo: " + event.code + ", Razon: " + event.reason);
}

// Cuando recibe un mensaje del servidor
syncWS.onmessage = function(msg){
    var data = JSON.parse(msg.data);

    // Actualizo siempre el player2, en este caso, con la posición del personaje del Cliente 1 (VIVO)
    if(Soy_J1 == false){ // Sólo recibe el Cliente 2, para actualizar la posición del jugador del Cliente 1
        // player1_global.setPosition(data.posTuerto.x, data.posTuerto.y); // en el cliente 2 (J2), player es Tuerto
        // player1_turnedLeft = data.tuertoTurnedLeft;
        player2_global.setPosition(data.posVivo.x, data.posVivo.y); // en el cliente 2 (J2), player2 es Vivo
        player2_turnedLeft = data.vivoTurnedLeft;
    }
}


// Cuando envía un mensaje al servidor
syncWS.sendWS = function(_posVivo, _posTuerto, _vivoTurnedLeft, _tuertoTurnedLeft){
    // console.log("Voy a enviar pos VIVO: (" + _posVivo.x + ", " + _posVivo.y + ")");
    // console.log("Voy a enviar pos TUERTO: (" + _posTuerto.x + ", " + _posTuerto.y + ")");
    let message = {
        posVivo: _posVivo,
        posTuerto: _posTuerto,
        vivoTurnedLeft: _vivoTurnedLeft,
        tuertoTurnedLeft: _tuertoTurnedLeft
    }

    syncWS.send(JSON.stringify(message));
    //console.log("Info enviada");
    // if (syncWS.readyState === WebSocket.OPEN) {
    //     console.log("Envio de info");
    //     syncWS.send(JSON.stringify(message));
    // }
}