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
    public static Map<Integer, Player> playerMap = new ConcurrentHashMap<Integer, Player>();
    public static Map<Integer, Game> gameMap = new ConcurrentHashMap<Integer, Game>();

    public static List<Game> gameList = new CopyOnWriteArrayList<Game>();
    public static List<Player> playerList = new CopyOnWriteArrayList<Player>();

    int idGame, idPlayer, randomNum;
    final int MAX_PLAYERS = 200;
    final int MAX_GAMES = 100;
    int JUGADORESACTUALES = 0;
    int PARTIDASACTUALES = 0;
    boolean firstEntry = true; // variable que indica si es la primera vez en solicitar crear una partida en el servidor 
    int currentGames = 0;
    int currentPlayers = 0;

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        JsonNode node = mapper.readTree(message.getPayload()); // Nodo
        ObjectNode msg = mapper.createObjectNode(); // Mensaje que se enviara a un cliente
        ObjectNode msgaux = mapper.createObjectNode(); // Para circumstancias en las que haya que enviar mensajes a ambos clientes

        switch (node.get("idFuncion").asInt()) { 

            case (0): // Crear una partida
                int idLocal = 0;
                Game gameAux_c0 = new Game();
                String debug = "Me he unido a la partida ";
                
                if (currentGames < MAX_GAMES) { // si no se ha superado el máximo de partida
                    int idJug = node.get("idJugador").asInt();
                    for (Game game : gameList) {// Recorro mi lista por cada elemento partida
                        if (!game.getHayJugador()) { // SI NO HAY J1 (es decir, no hay jugadores)
                            createGame(idLocal, playerList.get(idJug));// Creo una partida
                            msg.put("soyJ1", true); // al ser el primer jugador en entrar, será el J1
                            gameAux_c0 = game;
                            break;
                        } else if (game.getNeedsMorePlayers()) { // SI HAY UN J1, compruebo si hay un J2
                            fillGame(game, playerList.get(idJug), msg); // Si no lo hay, lleno ese J2
                            currentGames++; // Aumento el número de partidas que existen, para que la próxima partida se cree en la siguiente posición del array de partidas
                            gameAux_c0 = game;
                            msg.put("soyJ1", false);
                            break;
                        }
                        idLocal++;
                    }
                } else {
                    debug = "No se ha podido crear la partida (se ha alcanzado el NUM MAX de partidas)";
                }

                debug += idLocal; // indico a qué partida me he unido
                msg.put("idPartida", idLocal);
                msgaux.put("idPartida", idLocal);

                msg.put("idFuncion", 0);
                msg.put("stringPrueba", debug);
                session.sendMessage(new TextMessage(msg.toString()));

                if (!gameAux_c0.getNeedsMorePlayers()) { // cuando ya están los dos jugadores metidos en la partida
                    WebSocketSession localSesJ1 = gameAux_c0.getJ1().getSession();
                    WebSocketSession localSesJ2 = gameAux_c0.getJ2().getSession();
                    
                    System.out.println("Se va a iniciar la partida");

                    msg.put("idFuncion", 6);
                    msgaux.put("idFuncion", 6);

                    msg.put("estadoPartida", true);
                    msgaux.put("estadoPartida", true);

                    localSesJ1.sendMessage(new TextMessage(msg.toString())); // se le envía al J1
                    localSesJ2.sendMessage(new TextMessage(msgaux.toString())); // se le envía al J2
                }
                break;

            case (1): // Borrar partida
                int idJugador1 = node.get("idJugador1").asInt();
                int idJugador2 = node.get("idJugador2").asInt();
                int gameId_aux = node.get("idPartida").asInt();
                Boolean sesionEsJ1 = node.get("soyJ1").asBoolean();


                Game gameToDelete = gameList.get(gameId_aux);
                Player player1ToDelete = playerList.get(idJugador1);
                Player player2ToDelete = playerList.get(idJugador2);

                int idGameToDelete = gameToDelete.getId();
                int idP1ToDelete = player1ToDelete.getId();
                int idP2ToDelete = player2ToDelete.getId();

                // Accedemos a la sesión del otro cliente para avisarle también del borrado de partida

                WebSocketSession otherSession;
                if(sesionEsJ1){ // si la sesion que ha mandado borrar la partida es la sesión del J1
                    otherSession = gameToDelete.getJ2().getSession(); // guardamos al sesión del otro jugador
                } else { // si la sesión que ha mandado borrar la partida es la sesión del J2
                    otherSession = gameToDelete.getJ1().getSession(); // guardamos la sesión del otro jugador
                }
                
                String texto = "NO se ha borrado la partida ";

                if (!gameToDelete.getNeedsMorePlayers()) {
                    System.err.println("Voy a borrar la partida: " + gameId_aux + " que esta guardada con id " + idGameToDelete);
                    System.out.println("He entrado a borrar");
                    System.out.println("Número de partidas ANTES de borrar: " + currentGames);
                    Game newAux = new Game();
                    gameList.set(idGameToDelete, newAux); // añado una partida vacía en la posicion de la que vamos a borrar
                    currentGames--;
                    System.out.println("Número de partidas DESPUÉS de borrar: " + currentGames);
                    texto = "Se ha borrado la partida ";
                }

                // Mando la orden de borrar la partida a la sesión que ejecutó la llamada
                msg.put("mensajeBorrado", texto);
                msg.put("idFuncion", 1);
                msg.put("idPartida", idGameToDelete);
                session.sendMessage(new TextMessage(msg.toString()));

                // Mando la orden de borrar la partida a la otra sesión
                msgaux.put("mensajeBorrado", texto);
                msgaux.put("idFuncion", 1);
                msgaux.put("idPartida", idGameToDelete);
                otherSession.sendMessage(new TextMessage(msgaux.toString()));

                break;

            case (2): // Ataque jugador
                int gameId_c2 = node.get("idPartida").asInt();
                int playerId_c2 = node.get("idJugador").asInt();
                Game gameAux_c2 = gameList.get(gameId_c2);

                msg.put("idFuncion", 2);

                if (playerId_c2 == gameAux_c2.getJ1().getId()) {
                    // Si el jugador que ha enviado el mensaje al servidores el J1, 
                    // enviamos de vuelta un mensaje al J2 de su misma partida
                    WebSocketSession auxSession_c2 = gameAux_c2.getJ2().getSession();
                    auxSession_c2.sendMessage(new TextMessage(msg.toString()));
                } else { 
                    // Si el jugador que ha enviado el mensaje al servidor es el J2, 
                    // enviamos de vuelta un mensaje al J1 de su misma partida
                    WebSocketSession auxSession2_c2 = gameAux_c2.getJ1().getSession();
                    auxSession2_c2.sendMessage(new TextMessage(msg.toString()));
                }
                break;

            case (3): // Crear jugador
                if(firstEntry) { // si es la primera vez, se tienen que inicializar los arrays de partidas y jugadores
                    initGamesPlayers();
                    System.out.println("First Entry");
                    firstEntry=false;
                }
                int localId_auxc3 = 0;
                
                if (currentPlayers < MAX_PLAYERS) { 
                    for (Player player : playerList) {
                        if (!player.getInGame()) { // si el jugador no está en una partida
                            Player newPlayer = new Player (localId_auxc3,session); // Creo al jugador con la sesion del WebSocket
                            //newPlayer.setSession(session);  

                            currentPlayers++; //Actualizo el numero de jugadores que hay en el server
                            playerList.set(localId_auxc3, newPlayer);//Añado mi jugador a la lista en la posición correspondiente
                            msg.put("idJugador", currentPlayers-1); //Le envio el id al jugador para que lo guarde
                            String debug_c3 = "Se ha creado el jugador con ID "+ (currentPlayers-1); //MENSAJE DEBUG
                            msg.put("mensaje", debug_c3); //Debug
                            break;
                        }
                        localId_auxc3++;
                    }
                }else {
                    String debug_c3 = "Se ha alcanzado el maximos de jugadores"; //Debug
                }
                msg.put("idFuncion", 3); // La función en cliente que quiero que haga al recibir el mensaje del servidor
                session.sendMessage(new TextMessage(msg.toString())); // Envio el mensaje
                System.out.println("Se ha creado el jugador " + (currentPlayers-1));

                break;

            case (4): // Movimiento hacia la izquierda 
                int gameId_c4 = node.get("idPartida").asInt();
                int playerId_c4 = node.get("idJugador").asInt();
                Game gameAux_c4 = gameList.get(gameId_c4);

                msg.put("idFuncion", 4);

                if (playerId_c4 == gameAux_c4.getJ1().getId()) { 
                    // Si el jugador que ha enviado el mensaje al servidor
                    // es el J1, enviamos de vuelta un mensaje al J2 de su
                    // misma partida
                    WebSocketSession auxSession_c4 = gameAux_c4.getJ2().getSession();
                    auxSession_c4.sendMessage(new TextMessage(msg.toString()));
                } else { // Si el jugador que ha enviado el mensaje al servidor es el J2, enviamos de
                         // vuelta un mensaje al J1 de su misma partida
                    WebSocketSession auxSession2_c4 = gameAux_c4.getJ1().getSession();
                    auxSession2_c4.sendMessage(new TextMessage(msg.toString()));
                }

                break;

            case (5): // Movimiento hacia la derecha
                int gameId_c5 = node.get("idPartida").asInt();
                int playerId_c5 = node.get("idJugador").asInt();
                Game gameAux_c5 = gameList.get(gameId_c5); // accedemos a la partida correspondiente

                msg.put("idFuncion", 5);

                if (playerId_c5 == gameAux_c5.getJ1().getId()) { 
                    // Si el jugador que ha enviado el mensaje al servidor
                    // es el J1, enviamos de vuelta un mensaje al J2 de su misma partida
                    WebSocketSession auxSession_c5 = gameAux_c5.getJ2().getSession();
                    auxSession_c5.sendMessage(new TextMessage(msg.toString()));
                } else { 
                    // Si el jugador que ha enviado el mensaje al servidor es el J2, enviamos de
                    // vuelta un mensaje al J1 de su misma partida
                    WebSocketSession auxSession2_c5 = gameAux_c5.getJ1().getSession();
                    auxSession2_c5.sendMessage(new TextMessage(msg.toString()));
                }
                break;

            case (7): // Movimiento hacia arriba
                int gameId_c7 = node.get("idPartida").asInt();
                int playerId_c7 = node.get("idJugador").asInt();
                Game gameAux_c7 = gameList.get(gameId_c7);

                msg.put("idFuncion", 7);

                if (playerId_c7 == gameAux_c7.getJ1().getId()) { 
                    // Si el jugador que ha enviado el mensaje al servidor
                    // es el J1, enviamos de vuelta un mensaje al J2 de su misma partida
                    WebSocketSession auxSession_c7 = gameAux_c7.getJ2().getSession();
                    auxSession_c7.sendMessage(new TextMessage(msg.toString()));
                } else { 
                    // Si el jugador que ha enviado el mensaje al servidor es el J2, enviamos de
                    // vuelta un mensaje al J1 de su misma partida
                    WebSocketSession auxSession2_c7 = gameAux_c7.getJ1().getSession();
                    auxSession2_c7.sendMessage(new TextMessage(msg.toString()));
                }
                break;

            case (8): // Movimiento hacia abajo
                int gameId_c8 = node.get("idPartida").asInt();
                int playerId_c8 = node.get("idJugador").asInt();
                Game gameAux_c8 = gameList.get(gameId_c8);

                msg.put("idFuncion", 8);

                if (playerId_c8 == gameAux_c8.getJ1().getId()) { 
                    // Si el jugador que ha enviado el mensaje al servidor
                    // es el J1, enviamos de vuelta un mensaje al J2 de su misma partida
                    WebSocketSession auxSession_c8 = gameAux_c8.getJ2().getSession();
                    auxSession_c8.sendMessage(new TextMessage(msg.toString()));
                } else { 
                    // Si el jugador que ha enviado el mensaje al servidor es el J2, enviamos de
                    // vuelta un mensaje al J1 de su misma partida
                    WebSocketSession auxSession2_c8 = gameAux_c8.getJ1().getSession();
                    auxSession2_c8.sendMessage(new TextMessage(msg.toString()));
                }
                break;

            case (9): // Parar movimiento hacia la izquierda
                int gameId_c9 = node.get("idPartida").asInt();
                int playerId_c9 = node.get("idJugador").asInt();
                Game gameAux_c9 = gameList.get(gameId_c9);

                msg.put("idFuncion", 9);

                if (playerId_c9 == gameAux_c9.getJ1().getId()) {
                    // Si el jugador que ha enviado el mensaje al servidor
                    // es el J1, enviamos de vuelta un mensaje al J2 de su misma partida
                    WebSocketSession auxSession_c9 = gameAux_c9.getJ2().getSession();
                    auxSession_c9.sendMessage(new TextMessage(msg.toString()));
                } else {
                    // Si el jugador que ha enviado el mensaje al servidor es el J2, enviamos de
                    // vuelta un mensaje al J1 de su misma partida
                    WebSocketSession auxSession2_c9 = gameAux_c9.getJ1().getSession();
                    auxSession2_c9.sendMessage(new TextMessage(msg.toString()));
                }
                break;

            case (11): // Parar movimiento hacia la derecha
                int gameId_c11 = node.get("idPartida").asInt();
                int playerId_c11 = node.get("idJugador").asInt();
                Game gameAux_c11 = gameList.get(gameId_c11);

                msg.put("idFuncion", 11);

                if (playerId_c11 == gameAux_c11.getJ1().getId()) {
                    // Si el jugador que ha enviado el mensaje al servidor
                    // es el J1, enviamos de vuelta un mensaje al J2 de su misma partida
                    WebSocketSession auxSession_c11 = gameAux_c11.getJ2().getSession();
                    auxSession_c11.sendMessage(new TextMessage(msg.toString()));
                } else {
                    // Si el jugador que ha enviado el mensaje al servidor es el J2, enviamos de
                    // vuelta un mensaje al J1 de su misma partida
                    WebSocketSession auxSession2_c11 = gameAux_c11.getJ1().getSession();
                    auxSession2_c11.sendMessage(new TextMessage(msg.toString()));
                }
                break;

            case (12): // Parar movimiento hacia arriba
                int gameId_c12 = node.get("idPartida").asInt();
                int playerId_c12 = node.get("idJugador").asInt();
                Game gameAux_c12 = gameList.get(gameId_c12);

                msg.put("idFuncion", 12);

                if (playerId_c12 == gameAux_c12.getJ1().getId()) {
                    // Si el jugador que ha enviado el mensaje al servidor
                    // es el J1, enviamos de vuelta un mensaje al J2 de su misma partida
                    WebSocketSession auxSession_c12 = gameAux_c12.getJ2().getSession();
                    auxSession_c12.sendMessage(new TextMessage(msg.toString()));
                } else {
                    // Si el jugador que ha enviado el mensaje al servidor es el J2, enviamos de
                    // vuelta un mensaje al J1 de su misma partida
                    WebSocketSession auxSession2_c12 = gameAux_c12.getJ1().getSession();
                    auxSession2_c12.sendMessage(new TextMessage(msg.toString()));
                }
                break;

            case (13): // Parar movimiento hacia abajo
                int gameId_c13 = node.get("idPartida").asInt();
                int playerId_c13 = node.get("idJugador").asInt();
                Game gameAux_c13 = gameList.get(gameId_c13);

                msg.put("idFuncion", 13);

                if (playerId_c13 == gameAux_c13.getJ1().getId()) {
                    // Si el jugador que ha enviado el mensaje al servidor
                    // es el J1, enviamos de vuelta un mensaje al J2 de su misma partida
                    WebSocketSession auxSession_c13 = gameAux_c13.getJ2().getSession();
                    auxSession_c13.sendMessage(new TextMessage(msg.toString()));
                } else {
                    // Si el jugador que ha enviado el mensaje al servidor es el J2, enviamos de
                    // vuelta un mensaje al J1 de su misma partida
                    WebSocketSession auxSession2_c13 = gameAux_c13.getJ1().getSession();
                    auxSession2_c13.sendMessage(new TextMessage(msg.toString()));
                }
                break;

            case (14): // Pausar la partida
                int gameId_c14 = node.get("idPartida").asInt();
                int playerId_c14 = node.get("idJugador").asInt();
                Game gameAux_c14 = gameList.get(gameId_c14);

                msg.put("idFuncion", 14);

                if (playerId_c14 == gameAux_c14.getJ1().getId()) {
                    // Si el jugador que ha enviado el mensaje al servidor
                    // es el J1, enviamos de vuelta un mensaje al J2 de su misma partida
                    WebSocketSession auxSession_c14 = gameAux_c14.getJ2().getSession();
                    auxSession_c14.sendMessage(new TextMessage(msg.toString()));
                } else {
                    // Si el jugador que ha enviado el mensaje al servidor es el J2, enviamos de
                    // vuelta un mensaje al J1 de su misma partida
                    WebSocketSession auxSession2_c14 = gameAux_c14.getJ1().getSession();
                    auxSession2_c14.sendMessage(new TextMessage(msg.toString()));
                }
                break;

            case (15): // Resumir la partida
                int gameId_c15 = node.get("idPartida").asInt();
                int playerId_c15 = node.get("idJugador").asInt();
                Game gameAux_c15 = gameList.get(gameId_c15);

                msg.put("idFuncion", 15);

                if (playerId_c15 == gameAux_c15.getJ1().getId()) {
                    // Si el jugador que ha enviado el mensaje al servidor
                    // es el J1, enviamos de vuelta un mensaje al J2 de su misma partida
                    WebSocketSession auxSession_c15 = gameAux_c15.getJ2().getSession();
                    auxSession_c15.sendMessage(new TextMessage(msg.toString()));
                } else {
                    // Si el jugador que ha enviado el mensaje al servidor es el J2, enviamos de
                    // vuelta un mensaje al J1 de su misma partida
                    WebSocketSession auxSession2_c15 = gameAux_c15.getJ1().getSession();
                    auxSession2_c15.sendMessage(new TextMessage(msg.toString()));
                }
                break;

            case (16): // Jugador se sale de la partida online desde el menú de Pausa
                int gameId_c16 = node.get("idPartida").asInt();
                int playerId_c16 = node.get("idJugador").asInt();
                Game gameAux_c16 = gameList.get(gameId_c16);

                msg.put("idFuncion", 16);

                if (playerId_c16 == gameAux_c16.getJ1().getId()) {
                    // Si el jugador que ha enviado el mensaje al servidor
                    // es el J1, enviamos de vuelta un mensaje al J2 de su misma partida
                    WebSocketSession auxSession_c16 = gameAux_c16.getJ2().getSession();
                    auxSession_c16.sendMessage(new TextMessage(msg.toString()));
                } else {
                    // Si el jugador que ha enviado el mensaje al servidor es el J2, enviamos de
                    // vuelta un mensaje al J1 de su misma partida
                    WebSocketSession auxSession2_c16 = gameAux_c16.getJ1().getSession();
                    auxSession2_c16.sendMessage(new TextMessage(msg.toString()));
                }
                break;

            case (17): // Parar ataque jugador
                int gameId_c17 = node.get("idPartida").asInt();
                int playerId_c17 = node.get("idJugador").asInt();
                Game gameAux_c17 = gameList.get(gameId_c17);

                msg.put("idFuncion", 17);

                if (playerId_c17 == gameAux_c17.getJ1().getId()) {
                    // Si el jugador que ha enviado el mensaje al servidor
                    // es el J1, enviamos de vuelta un mensaje al J2 de su
                    // misma partida
                    WebSocketSession auxSession_c17 = gameAux_c17.getJ2().getSession();
                    auxSession_c17.sendMessage(new TextMessage(msg.toString()));
                } else { // Si el jugador que ha enviado el mensaje al servidor es el J2, enviamos de
                         // vuelta un mensaje al J1 de su misma partida
                    WebSocketSession auxSession2_c17 = gameAux_c17.getJ1().getSession();
                    auxSession2_c17.sendMessage(new TextMessage(msg.toString()));
                }
                break;

            case (18): // Funcion random
                int gameId_c18 = node.get("idPartida").asInt();
                int playerId_c18 = node.get("idJugador").asInt();
                int randomNum_c18 = node.get("randomNum").asInt();
                Game gameAux_c18 = gameList.get(gameId_c18);

                msg.put("idFuncion", 18);
                msg.put("randomNum", randomNum_c18);

                if (playerId_c18 == gameAux_c18.getJ1().getId()) {
                    // Si el jugador que ha enviado el mensaje al servidor
                    // es el J1, enviamos de vuelta un mensaje al J2 de su
                    // misma partida
                    WebSocketSession auxSession_c18 = gameAux_c18.getJ2().getSession();
                    auxSession_c18.sendMessage(new TextMessage(msg.toString()));
                } else { // Si el jugador que ha enviado el mensaje al servidor es el J2, enviamos de
                         // vuelta un mensaje al J1 de su misma partida
                    WebSocketSession auxSession2_c18 = gameAux_c18.getJ1().getSession();
                    auxSession2_c18.sendMessage(new TextMessage(msg.toString()));
                }
                break;

            case (20): // Parar ataque jugador
                int gameId_c20 = node.get("idPartida").asInt();
                int playerId_c20 = node.get("idJugador").asInt();
                Game gameAux_c20 = gameList.get(gameId_c20);

                msg.put("idFuncion", 20);

                if (playerId_c20 == gameAux_c20.getJ1().getId()) {
                    // Si el jugador que ha enviado el mensaje al servidor
                    // es el J1, enviamos de vuelta un mensaje al J2 de su
                    // misma partida
                    WebSocketSession auxSession_c20 = gameAux_c20.getJ2().getSession();
                    auxSession_c20.sendMessage(new TextMessage(msg.toString()));
                } else { // Si el jugador que ha enviado el mensaje al servidor es el J2, enviamos de
                         // vuelta un mensaje al J1 de su misma partida
                    WebSocketSession auxSession2_c20 = gameAux_c20.getJ1().getSession();
                    auxSession2_c20.sendMessage(new TextMessage(msg.toString()));
                }
                break;

            case (21): // Matar a jugador
                int gameId_c21 = node.get("idPartida").asInt();
                int playerId_c21 = node.get("idJugador").asInt();
                Game gameAux_c21 = gameList.get(gameId_c21);

                msg.put("idFuncion", 21);

                if (playerId_c21 == gameAux_c21.getJ1().getId()) {
                    // Si el jugador que ha enviado el mensaje al servidor
                    // es el J1, enviamos de vuelta un mensaje al J2 de su
                    // misma partida
                    WebSocketSession auxSession_c21 = gameAux_c21.getJ2().getSession();
                    auxSession_c21.sendMessage(new TextMessage(msg.toString()));
                } else { // Si el jugador que ha enviado el mensaje al servidor es el J2, enviamos de
                         // vuelta un mensaje al J1 de su misma partida
                    WebSocketSession auxSession2_c21 = gameAux_c21.getJ1().getSession();
                    auxSession2_c21.sendMessage(new TextMessage(msg.toString()));
                }
                break;
            case (22): // Game Over
                int gameId_c22 = node.get("idPartida").asInt();
                int playerId_c22 = node.get("idJugador").asInt();
                Game gameAux_c22 = gameList.get(gameId_c22);

                if (playerId_c22 == gameAux_c22.getJ1().getId()) {
                    // Si el jugador que ha enviado el mensaje al servidor
                    // es el J1, enviamos de vuelta un mensaje al J2 de su
                    // misma partida
                    WebSocketSession auxSession_c21 = gameAux_c22.getJ2().getSession();
                    auxSession_c21.sendMessage(new TextMessage(msg.toString()));
                } else { 
                    // Si el jugador que ha enviado el mensaje al servidor es el J2, enviamos de
                    // vuelta un mensaje al J1 de su misma partida
                    WebSocketSession auxSession2_c21 = gameAux_c22.getJ1().getSession();
                    auxSession2_c21.sendMessage(new TextMessage(msg.toString()));
                }

                break;
        }
    }

    // Creación de partidas
    public void createGame(int posInGameList, Player player) { 
        player.setinGame(true); // indicamos en la info del jugador que este se encuentra en una partida
        Game newGame = new Game(posInGameList, player); // creamos la partida
        newGame.setHayJugador(true); // indicamos que esa partida tiene un jugador
        gameList.set(posInGameList, newGame); // añado la partida a la lista de partidas en su posicion correspondiente

        System.out.println("Se ha creado la partida " + posInGameList);
    }

    public void fillGame(Game p, Player J, ObjectNode msg) {
        J.setinGame(true);
        p.setPlayer2(J); // Añado a la partida el jugador 2
        p.setNeedsMorePlayers(false); // cuando añado el segundo jugador, se completa la partida
        gameList.set(p.getId(), p);
    }

    // Cuando se inicie el server, lleno mi lista de partidas de elementos partida
    // con valores por defecto para poder recorrer el for each de creación de partidas.
    public void initGamesPlayers() { 
        for (int i = 0; i < MAX_GAMES; i++) {
            Game g = new Game();
            g.setId(i);
            gameList.add(g);
        }
        for (int i = 0; i < MAX_PLAYERS; i++) {
            Player p = new Player();
            playerList.add(p);
        }
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

    // GENERAR NUMERO ALEATORIO DENTRO DEL SERVER
    // Esto se iba a usar, ya que si no hay un retardo entre el número aleatorio del cliente 1 y del cliente 2, 
    // pero salían errores de que se cerraba el servidor no sabemos por qué. Ibamos justos de tiempo y no hemos podido solucionarlo
    private int randomNumberOnline(int min, int max) {
        return (int)Math.floor(Math.random() * (max - min + 1) + min);
    }
}
