
var syncWS = new WebSocket("ws://127.0.0.1:8080/sync");

syncWS.onopen = function (msg){
    console.log("Conexion establecida con WS Sync");
}

syncWS.onerror = function(e){
    console.log("WS error: " + e);
}

// Cuando recibe un mensaje del servidor
syncWS.onmessage = function(msg){
    var data = JSON.parse(msg.data);
    console.log("[syncWS.onmessage()] ME HA LLEGADO UN MENSAJE");
    if(SoyJ1 == false){ // sólo actualiza la información el J2. Es decir, siempre se usa la info del J1 como fuente fiable
        console.log("Antigua posición Vivo: [" + onlineLevel.player2.x + ", " + onlineLevel.player2.y + "]");
        console.log("Antigua posición Tuerto: [" + onlineLevel.player.x + ", " + onlineLevel.player.y + "]");

        player1_global.setPosition(data.posTuerto.x, data.posTuerto.y); // en el cliente 2 (J2), player es Tuerto
        player2_global.setPosition(data.posVivo.x, data.posVivo.y); // en el cliente 2 (J2), player2 es Vivo

        console.log("Nueva posición Vivo: [" + onlineLevel.player2.x + ", " + onlineLevel.player2.y + "]");
        console.log("Nueva posición Tuerto: [" + onlineLevel.player.x + ", " + onlineLevel.player.y + "]");
    }
}


// Cuando envía un mensaje al servidor
syncWS.sendWS = function(_posVivo, _posTuerto){
    console.log("Envio pos VIVO: (" + _posVivo.x + ", " + _posVivo.y + ")");
    console.log("Envio pos TUERTO: (" + _posTuerto.x + ", " + _posTuerto.y + ")");
    let message = {
        posVivo: _posVivo,
        posTuerto: _posTuerto
    }
    syncWS.send(JSON.stringify(message));
}