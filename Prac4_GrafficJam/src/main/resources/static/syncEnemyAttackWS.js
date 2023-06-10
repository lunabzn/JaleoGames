var syncEAttack = new WebSocket("ws://127.0.0.1:8080/enemyAttack");

syncEAttack.onopen = function (msg){
    console.log("Conexion establecida con WS Sync");
}

syncEAttack.onerror = function(e){
    console.log("WS error: " + e);
}

syncEAttack.onclose = function (event) {
    console.log("Conexion cerrada. Codigo: " + event.code + ", Razon: " + event.reason);
}

// Cuando recibe un mensaje del servidor
syncEAttack.onmessage = function(msg){
    var data = JSON.parse(msg.data);
    console.log("[syncEAttack.onmessage()] ME HA LLEGADO UN MENSAJE");
    console.log("El n es: "+ data.random + " lo recibe " + data.i);
    if(Soy_J1 == false){ 
        Random_Num[data.i] = data.random;
        
    }
}


// Cuando envía un mensaje al servidor
syncEAttack.sendWS = function(_random, i_){
    // console.log("Voy a enviar pos VIVO: (" + _posVivo.x + ", " + _posVivo.y + ")");
    // console.log("Voy a enviar pos TUERTO: (" + _posTuerto.x + ", " + _posTuerto.y + ")");
    console.log("El n es: "+ _random + " y lo envía i_");
    let message = {
        random: _random,
        i : i_
    }

    syncEAttack.send(JSON.stringify(message));
    console.log("Info enviada");
    // if (syncWS.readyState === WebSocket.OPEN) {
    //     console.log("Envio de info");
    //     syncWS.send(JSON.stringify(message));
    // }
}