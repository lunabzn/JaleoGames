
var socket = new WebSocket("ws://127.0.0.1:8080/grafficjam");

socket.onopen = function (msg) {
	console.log("Conexion establecida con connection.js");
}

window.onbeforeunload = function () {
	cerrarVentana();
};

socket.onmessage = function (event) {
	var aux = JSON.parse(event.data)
	ID_Funcion = aux.idFuncion

	switch (ID_Funcion) {

		//LO QUE RECIBO DEL SERVIDOR
		case (0): 
			ID_Partida = aux.idPartida;
			Soy_J1 = aux.soyJ1;
			console.log("aux " + aux.soyJ1);
			console.log("Soy Jugador 1?: " + Soy_J1);
			console.log(aux.stringPrueba);
			console.log(ID_Partida);
			break;

		case (1): //borrarPartida()
			console.log(aux.mensajeBorrado + aux.idPartida);
			break;

		case (2): //Ataque Jugador
			activate_WEB_playerAttack();
			break;

		case (3)://crearJugador() 
			J1_id = aux.idJugador;
			console.log(aux.mensaje); // "Se ha creado el jugador X"
			console.log(aux.idJugador); // X
			barrera = true;
			break;

		case (4): // Mover jugador a la izquierda
			activate_WEB_goLeft();
			break;

		case (5): // Mover jugador a la derecha
			activate_WEB_goRight();
			break;
 
		case (6): // Cuando se completa una partida
			StartGame = aux.estadoPartida;
			console.log(aux.estadoPartida);
			console.log("El ID jugador del server es:" + aux.idJugador);
			console.log("[Partida completada] StartGame = " + aux.estadoPartida);
			break;

		case (7): // Mover jugador arriba
			activate_WEB_goUp();
			break;

		case (8): // Mover jugador abajo
			activate_WEB_goDown();
			break;

		case (9): // Parar movimiento hacia la izquierda
			deactivate_WEB_goLeft();
			break;

		case (10): // Desconexión ???
			cambiarDesconexion();
			break;

		case (11): // Parar movimiento hacia la izquierda
			deactivate_WEB_goRight();
			break;

		case (12): // Parar movimiento hacia arriba
			deactivate_WEB_goUp();
			break;

		case (13): // Parar movimiento hacia abajo
			deactivate_WEB_goDown();
			break;

		case (14): // Pausar la partida
			makePauseGame();
			break;

		case (15): // Resumir la partida
			makeResumeGame();
			break;

		case(16): // Jugador se sale de la partida online desde el menú de Pausa
			makePlayerLogOut();
			break;

		case (17): // Parar ataque jugador
			deactivate_WEB_dontPlayerAttack();
			break;

		case (18): // Funcion random
			Random_Num = aux.randomNum;
			break;

		case (20):
			activate_WEB_playerStop();
			break;

		case (21):
			activate_WEB_playerHasDied();
			break;

		default:
			break;
	}
}


//LO QUE LE ENVIO AL SERVIDOR
function createGame(){ //Mi función que envía los datos que necesito al server
	let message = {
		idFuncion: 0, //Cuando el server mire el mensaje, sabra que función llamar gracias a este nombre
		idJugador: J1_id,
	}	
	socket.send(JSON.stringify(message)); 
}

function deleteGame() { 
	let message = {
			idFuncion: 1,
			idPartida: ID_Partida,
			idJugador1: J1_id,
			idJugador2: J2_id
	}
	socket.send(JSON.stringify(message));
}

function borrarJugador() { 
	let message = {
			idFuncion: 9,
			idJugador: J1_id
	}
	socket.send(JSON.stringify(message));
}

function playerAttack(){
	let message = {
		idFuncion: 2,
		idPartida: ID_Partida,
		idJugador: J1_id
	}
	socket.send(JSON.stringify(message));
}

function playerStopAttack(){
	let message = {
		idFuncion: 17,
		idPartida: ID_Partida,
		idJugador: J1_id
	}
	socket.send(JSON.stringify(message));
}

function randomNumber(){
	let message = {
		idFuncion: 18,
		idPartida: ID_Partida,
		idJugador: J1_id,
		randomNum: probability
	}
	socket.send(JSON.stringify(message));
}

function createPlayer(){ 
	let message ={
		idFuncion: 3,
		mensaje: hola
	}
	socket.send(JSON.stringify(message)); //No se si tendré que recibir o actualizar en cliente

}

function playerMoveLeft() {
	let message = {
		idFuncion: 4,
		idPartida: ID_Partida,
		idJugador: J1_id
	}
	socket.send(JSON.stringify(message));
}

function playerMoveRight() {
	let message = {
		idFuncion: 5,
		idPartida: ID_Partida,
		idJugador: J1_id
	}
	socket.send(JSON.stringify(message));
}

function playerMoveUp() {
	let message = {
		idFuncion: 7,
		idPartida: ID_Partida,
		idJugador: J1_id
	}
	socket.send(JSON.stringify(message));
}

function playerMoveDown(){
	let message = {
		idFuncion: 8,
		idPartida: ID_Partida,
		idJugador: J1_id
	}
	socket.send(JSON.stringify(message));
}

function playerStopMoveLeft(){
	let message = {
		idFuncion: 9,
		idPartida: ID_Partida,
		idJugador: J1_id
	}
	socket.send(JSON.stringify(message));
}

function playerStopMoveRight(){
	let message = {
		idFuncion: 11,
		idPartida: ID_Partida,
		idJugador: J1_id
	}
	socket.send(JSON.stringify(message));
}

function playerStopMoveUp(){
	let message = {
		idFuncion: 12,
		idPartida: ID_Partida,
		idJugador: J1_id
	}
	socket.send(JSON.stringify(message));
}

function playerStopMoveDown(){
	let message = {
		idFuncion: 13,
		idPartida: ID_Partida,
		idJugador: J1_id
	}
	socket.send(JSON.stringify(message));
}

function playerStop(){
	let message = {
		idFuncion: 20,
		idPartida: ID_Partida,
		idJugador: J1_id
	}
	socket.send(JSON.stringify(message));
}

function pauseGame(){
	let message = {
		idFuncion: 14,
		idPartida: ID_Partida,
		idJugador: J1_id
	}
	socket.send(JSON.stringify(message));
}

function resumeGame(){
	let message = {
		idFuncion: 15,
		idPartida: ID_Partida,
		idJugador: J1_id
	}
	socket.send(JSON.stringify(message));
}

function playerPauseLogOut(){
	let message = {
		idFuncion: 16,
		idPartida: ID_Partida,
		idJugador: J1_id
	}
	socket.send(JSON.stringify(message));
}

function killPlayer(){
	let message = {
		idFuncion: 21,
		idPartida: ID_Partida,
		idJugador: J1_id
	}
	socket.send(JSON.stringify(message));
}

function cerrarVentana(){ //Mi función que recibe los datos que necesito del jugador 2
	let message ={
			idFuncion: 10,
			idPartida: ID_Partida,
			idJugador: J1_id
	}
	socket.send(JSON.stringify(message)); //No se si tendré que recibir o actualizar en cliente
}