
var enemySyncWS = new WebSocket("ws://127.0.0.1:8080/enemysync");

enemySyncWS.onopen = function (msg){
    console.log("Conexion establecida con Enemy Sync WS");
}

enemySyncWS.onerror = function(e){
    console.log("Enemy Sync WS error: " + e);
}

enemySyncWS.onclose = function (event) {
    console.log("Conexion cerrada. Codigo: " + event.code + ", Razon: " + event.reason);
}

// Cuando recibe un mensaje del servidor
enemySyncWS.onmessage = function(msg){
    var data = JSON.parse(msg.data);
    console.log("[EnemySyncWS.onmessage()] ME HA LLEGADO UN MENSAJE");
    if(Soy_J1 == false){ // sólo actualiza la información el J2. Es decir, siempre se usa la info del J1 como fuente fiable
        activeEnemies_global[data.i].setPosition(data.posEnemigo.x, data.posEnemigo.y);
    }
}


// Cuando envía un mensaje al servidor
enemySyncWS.sendWS = function(_i, _posEnemigo){ // i es el número de enemigo
    console.log("Voy a enviar pos Enemigo: (" + _posEnemigo.x + ", " + _posEnemigo.y + ")");
    let message = {
        i: _i,
        posEnemigo: _posEnemigo,
    }

    enemySyncWS.send(JSON.stringify(message));
    console.log("Info enemigo enviada");
    // if (syncWS.readyState === WebSocket.OPEN) {
    //     console.log("Envio de info");
    //     syncWS.send(JSON.stringify(message));
    // }
}