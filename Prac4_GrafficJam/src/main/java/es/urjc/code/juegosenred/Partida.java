package es.urjc.code.juegosenred;

import org.springframework.web.socket.WebSocketSession;

public class Partida {
    private int ID;
	private Player J1;
	private Player J2;
	private Boolean vacio;
	private Boolean hayJ1;
	
	 Partida() {
		this.ID = 0;
		this.J1 = null;
		this.J2 = null;
		this.vacio = true;
		this.hayJ1 = false;//Partida esta vacia o llena
	}
	 
	 Partida(int id) {
		 this.ID = id;
		 this.J1 = null;
		 this.J2 = null;
		 this.vacio = true;
		 this.hayJ1 = false;
	 }
	 
	 Partida(int id, Player j1) {
			this.ID = id;
			this.J1 = j1;
			this.vacio = true;
			this.hayJ1 = true;
		}
	 
	 
	 //Getters y setters de cada parámetro
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
	 
	 
	 public void setJugador1(Player j) {
		 this.J1 = j;
	 }
	 
	 public void setJugador2(Player j) {
		 this.J2 = j;
	 }
	 
	 public Boolean getVacio() {
		 return this.vacio;
	 }
	 
	 public void setVacio(Boolean b) {
		 this.vacio = b;
	 }
	 
	 public boolean getHayJugador() {
		 return this.hayJ1;
	 }
	 
	 public void setHayJugador(Boolean b) {
		 this.vacio = b;
	 }
}
