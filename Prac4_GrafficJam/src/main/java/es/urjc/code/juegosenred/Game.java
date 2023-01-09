package es.urjc.code.juegosenred;

import org.springframework.web.socket.WebSocketSession;

public class Game {
	private int ID;
	private Player J1;
	private Player J2;
	private Boolean needsMorePlayers; // true = todavia no se ha llenado la partida, false = la partida esta llena
	private Boolean hayJ1;

	Game() {
		this.ID = 0;
		this.J1 = null;
		this.J2 = null;
		this.needsMorePlayers = true;
		this.hayJ1 = false;// Partida esta vacia o llena
	}

	Game(int id) {
		this.ID = id;
		this.J1 = null;
		this.J2 = null;
		this.needsMorePlayers = true;
		this.hayJ1 = false;
	}

	Game(int id, Player j1) {
		this.ID = id;
		this.J1 = j1;
		this.needsMorePlayers = true;
		this.hayJ1 = true;
	}

	// Getters y setters de cada parámetro
	public int getId() {
		return this.ID;
	}

	public void setId(int id) {
		ID = id;
	}

	public Player getJ1() {
		return this.J1;
	}

	public Player getJ2() {
		return this.J2;
	}

	public void setPlayer1(Player j) {
		this.J1 = j;
	}

	public void setPlayer2(Player j) {
		this.J2 = j;
	}

	public Boolean getNeedsMorePlayers() {
		return this.needsMorePlayers;
	}

	public void setNeedsMorePlayers(Boolean b) {
		this.needsMorePlayers = b;
	}

	public boolean getHayJugador() {
		return this.hayJ1;
	}

	public void setHayJugador(Boolean b) {
		this.needsMorePlayers = b;
	}
}
