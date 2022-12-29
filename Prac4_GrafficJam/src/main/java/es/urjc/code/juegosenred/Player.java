package es.urjc.code.juegosenred;

import org.springframework.web.socket.WebSocketSession;
import java.time.LocalDateTime;

public class Player {
    private int id;
	private String name;
	private int SKIN;
	private WebSocketSession SESSION;
	private LocalDateTime Tiempo;
	private boolean inGame;

	Player(int id,  WebSocketSession session) { 
		this.id = id;
		this.SKIN = 0;
		this.SESSION = session;
		this.Tiempo = LocalDateTime.now();
		this.inGame = false;
	}
	
	Player() { 
			this.SKIN = 0;
			this.Tiempo = LocalDateTime.now();
			this.inGame = false;
    }

	public String getName() {
		return name;
	}

	public void setName(String _name) {
		this.name = _name;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}
	
	public boolean getInGame() {
		 return inGame;
	 }
	 
	 public void setinGame(boolean b) {
		 this.inGame = b;
	 }
	 public int getSkin() {
		 return SKIN;
	 }
	 
	 public void setSkin(int skin) {
		 this.SKIN = skin;
	 }
	 
	 
	 public LocalDateTime getTiempo() {
		 return Tiempo;
	 }
	 
	 public void setTiempo(LocalDateTime t) {
		 this.Tiempo = t;
	 }
	 
	 public WebSocketSession getSession() {
		 return SESSION;
	 }
	 
	 public void setSession(WebSocketSession session) {
		 this.SESSION = session;
	 }
	 
	 public void sendMessage(String message) {
		 
	 }
	
	@Override
	public String toString() {
		return "Jugador [id=" + id + ", nombre=" + name + "]";
	}
}
