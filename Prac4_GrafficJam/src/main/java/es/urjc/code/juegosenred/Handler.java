package es.urjc.code.juegosenred;

import java.util.*;
import java.util.concurrent.atomic.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.Random;

import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

import java.time.*;
import java.time.temporal.ChronoUnit;

public class Handler extends TextWebSocketHandler {
    public static ObjectMapper mapper = new ObjectMapper();
    public static Map<Integer, Player> jugadores = new ConcurrentHashMap<Integer, Player>();
    public static Map<Integer, Partida> partidas = new ConcurrentHashMap<Integer, Partida>();

    public static List<Partida> partidillas = new CopyOnWriteArrayList<Partida>();
    public static List<Player> jugadoriños = new CopyOnWriteArrayList<Player>();

    int idPartida, idJugador;
    int numPartidaActual = 0;
    int numJugadoresActual = 0;
    final int N_JUGADORES = 8;
    final int N_PARTIDAS = 40;
    int JUGADORESACTUALES = 0;
    int PARTIDASACTUALES = 0;
    boolean primeravez = true;
    int[] EstadoJugadores = new int[N_JUGADORES];

    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        JsonNode node = mapper.readTree(message.getPayload()); // Mi nodo que explora
        ObjectNode msg = mapper.createObjectNode(); // Mi explorador de mensajes
        ObjectNode msgaux = mapper.createObjectNode(); // Para situaciones donde tenga que enviar a dos clientes a la
                                                       // vez información distinta

        switch (node.get("idFuncion").asInt()) {

            case (0): // Creamos la partida 
                int idLocal = 0;
                Partida f = new Partida();
                String prueba = "Me he unido a una partida";
                if (numPartidaActual < N_PARTIDAS) {
                    int idJug = node.get("idJugador").asInt();
                    for (Partida p : partidillas) {// Recorro mi lista por cada elemento partida
                        if (!p.getHayJugador()) { // SI NO HAY J1 (es decir, no hay jugadores)
                            crearPartida(numPartidaActual, jugadoriños.get(idJug));// Llamo a mi función crearPartida
                                                                                   // con los datos necesarios
                            msg.put("soyJ1", true);
                            break;
                        } else if (p.getVacio()) { // SI HAY UN J1, compruebo si hay un J2
                            llenarPartida(p, jugadoriños.get(idJug), msg); // Si no lo hay, lleno ese J2
                            numPartidaActual++; // Aumento el número de partidas que existen
                            f = p;
                            msg.put("soyJ1", false);
                            break;
                        }
                        idLocal++;
                    }
                } else {
                    prueba = "No puedo crear partida (Reached Max Games)";
                }

                msg.put("idPartida", idLocal);
                msgaux.put("idPartida", idLocal);

                msg.put("idFuncion", 0);
                msg.put("stringPrueba", prueba);
                session.sendMessage(new TextMessage(msg.toString()));

                if (!f.getVacio()) { // cuando están los dos jugadores metidos en la partida
                    WebSocketSession sesionLocalJ1 = f.getJ1().getSession();
                    WebSocketSession sesionLocalJ2 = f.getJ2().getSession();

                    msg.put("idFuncion", 4);
                    msgaux.put("idFuncion", 4);

                    msg.put("estadoPartida", true);
                    msgaux.put("estadoPartida", true);

                    msg.put("idSkin", f.getJ2().getSkin()); // Le envio a J1 la skin de J2
                    msgaux.put("idSkin", f.getJ1().getSkin()); // Le envio a J2 la skin de J1

                    sesionLocalJ1.sendMessage(new TextMessage(msg.toString()));
                    sesionLocalJ2.sendMessage(new TextMessage(msgaux.toString()));
                    System.err.println("He llegado");
                }
                break;

            case (1): // Cerrar partida
                int idJugador = node.get("idJugador").asInt();
                int idPartidita = node.get("idPartida").asInt();
                Partida borrada = partidillas.get(idPartidita);
                int idAnt = borrada.getId();

                System.err.println("Voy a borrar la partida: " + idPartidita + "que esta guardada con id " + idAnt);
                if (!borrada.getVacio()) {
                    System.err.println("He entrado a borrar");
                    Partida nueva = new Partida();
                    partidillas.set(idAnt, nueva);
                    numPartidaActual--;
                    for (Partida p : partidillas) {
                        System.err.println("En esta partida tengo el hayjugador en " + p.getHayJugador()
                                + "y el vacio en " + p.getVacio());
                    }
                }

                String texto = "Se ha borrado la partida";
                msg.put("mensajeBorrado", texto);
                msg.put("idFuncion", 1);
                session.sendMessage(new TextMessage(msg.toString()));
                break;

            case (2): //Ataque jugador
                break;
            
            case(3): //Crear jugador
                if(primeravez) {
                    inicializar();
                    primeravez=false;
                }
                int idLocalisimo = 0;
                
                if (numJugadoresActual < N_JUGADORES) { //Si hay menos de 8 jugadores (indices de 0 a 7)
                    for (Player x : jugadoriños) {
                        if (!x.getInGame()) {
                            Player j = new Player (idLocalisimo,session); // Creo al jugador con la sesion del WebSocket
                            j.setSession(session); //Guardo en la instancia del jugador la sesion (por si me hiciera falta) 
                            numJugadoresActual++; //Actualizo el numero de jugadores que hay en el server
                            jugadoriños.set(idLocalisimo, j);//Añado mi jugador a la lista en la posición correspondiente
                            msg.put("idJugador", numJugadoresActual-1); //Le envio el id al jugador para que lo guarde, esto sera util cuando necesite saber en otros métodos que id tiene ese jugador
                            String textito = "Se ha creado el jugador "+ (numJugadoresActual-1); //MENSAJE DEBUG(SOBRA)
                            msg.put("mensaje", textito); //Debug
                            break;
                        }
                        idLocalisimo++;
                    }
                }else {
                    String textito = "Jugadores llenos :("; //Debug
                }
                msg.put("idFuncion", 3); // La función en cliente que quiero que haga al recibir el mensaje del servidor
                session.sendMessage(new TextMessage(msg.toString())); // Envio el mensaje

                break;

            case (5):
                int gameId = node.get("idPartida").asInt();
                int playerId = node.get("idJugador").asInt();
                String debug = "MENSAJE DE MOV.IZQ HA PASADO POR EL SERVER";
                Partida gameAux = partidillas.get(gameId);
                msg.put("idFuncion", 5);
                msg.put("stringPrueba", debug);
               
                if (playerId == gameAux.getJ1().getId()) { //Si el jugador que ha enviado el mensaje al servidor es el J1, enviamos de vuelta un mensaje al J2 de su misma partida
                    System.err.println("se va a enviar el mensaje al J2");
                    WebSocketSession sesionaux5 = gameAux.getJ2().getSession();
                    sesionaux5.sendMessage(new TextMessage(msg.toString()));
                } else {  //Si el jugador que ha enviado el mensaje al servidor es el J2, enviamos de vuelta un mensaje al J1 de su misma partida
                    WebSocketSession sesionaux25 = gameAux.getJ1().getSession();
                    System.err.println("se va a enviar el mensaje al J1");
                    sesionaux25.sendMessage(new TextMessage(msg.toString()));
                }

                break;

        }
    }

    public void crearPartida(int ID, Player player) { // Creación de partidas
        player.setinGame(true);
        Partida p = new Partida(ID, player); // Creo una partida por el constructor
        p.setHayJugador(true);
        partidillas.set(ID, p);// añado esa partida a la posición correspondiente (QUE COINCIDE CON SU ID)
        // System.err.println("He creado una nueva partida con id: "+ ID);
    }

    public void llenarPartida(Partida p, Player J, ObjectNode msg) {
        J.setinGame(true);
        p.setJugador2(J); // Añado a la partida el jugador 2
        p.setVacio(false);
        partidillas.set(p.getId(), p);
        // Actualizo en la posición correspondiente esa partida
        // System.err.println("He llenado la partida con id: "+ p.getId());
    }

    // Cuando se inicie el server, lleno mi lista de partidas de elementos partida
    // con valores por defecto para poder recorrer el for each de creación de partidas.
    public void inicializar() { 
        Partida p = new Partida();
        for (int i = 0; i < N_PARTIDAS; i++) {
            p.setId(i);
            partidillas.add(p);
        }
        Player s = new Player();
        for (int i = 0; i < N_JUGADORES; i++) {
            jugadoriños.add(s);
        }
    }

    private boolean Probabilidad() {
        int numero = (int) (Math.random() * 100) + 1;
        if (numero < 30) {
            return true;
        } else
            return false;
    }

    public boolean JugadorDesconectado(LocalDateTime TiempoJugador) { 
        LocalDateTime TiempoActual = LocalDateTime.now();
        long diferencia = ChronoUnit.SECONDS.between(TiempoActual, TiempoJugador);

        if (diferencia > 15) {
            return true;
        } else {
            return false;
        }  
    }
}
