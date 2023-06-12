# Graffic Jam
## **Jaleo games - Grupo A** </br>

**Temática:** 
Graffic-Jam es un *beat ‘em up* en 2D para 2 jugadores, inspirado en la cultura del graffiti. El juego cuenta con varios niveles. Cada uno de ellos es un escenario distinto relacionado con el mundo del graffiti, como por ejemplo las vías de un tren o las calles de una ciudad. Los jugadores tienen como objetivo llegar al final de dicho nivel para poder pintar una pieza de graffiti, y en el camino se encontrarán con diferentes oleadas de enemigos a los que tendrán que derrotar, como policías, cuerpos de seguridad u otras bandas. </br>

**Integrantes:** 

| Nombre        | Mail          | Perfil GitHub  |
| ------------- |:-------------:| --------------:|
| LUNA BOUZÓN RODRÍGUEZ    | l.bouzon.2020@alumnos.urjc.es | lunsbzn |
| YERAY DA SILVA DE LAS HERAS     | y.da.2020@alumnos.urjc.es      |   yerayds |
| RAFAEL GONZÁLEZ DE CANALES LORA | r.gonzalezl.2020@alumnos.urjc.es      |    rafagcl01 |
| MARTA RABOSO GÓMEZ | m.raboso.2019@alumnos.urjc.es      |    iamboredasf |
| FABIO ELÍAS RENGIFO GARCÍA | fe.rengifo.2020@alumnos.urjc.e      |    faviolado |
| LUCAS RUBIO LEZANA | l.rubiol.2020@alumnos.urjc.es      |    LucasWiggie |

**TRELLO:** https://trello.com/invite/b/K4BjzJWR/ATTI24e95a6ef74904da1f7067f482233aa1EF865F47/jaleo-games

**Vídeo WebSockets y explicación del juego**
https://youtu.be/QGXroDiclX4
<br>
<br>

## **ENTREGA FASE 2:<br>**

Interfaz de inicio del juego Graffic-Jam con un botón que al ser pulsado llevará al jugador a la selección del modo de juego.

![image](https://user-images.githubusercontent.com/82967594/204652679-f5da9bcb-70c2-4528-8d15-ab6aade0b1ed.png)

Interfaz de selección del modo de juego donde se muestra la opción de modo de juego off-line, on-line y la posibilidad de volver hacia la interfaz de inicio de juego (Solo está habilitado jugar el modo de juego off-line).

![Captura de pantalla 2022-12-20 225053 fondo imagen](https://user-images.githubusercontent.com/84155484/208774049-25cc2e05-626f-4e23-a065-caa712bd2856.jpg)

Interfaz del Lobby, donde se muestra el chat funcional y los jugadores que estan conectados:


Interfaz del selector de niveles dando la posibilidad de seleccionar entre el nivel 1, nivel 2 y nivel 3 (Aunque a fecha de la entrega tan solo está habilitado jugar el nivel 1). Además, al igual que en la interfaz anterior, te da la opción de volver al selector de modo de juego.

![image](https://user-images.githubusercontent.com/82967594/204653505-4f476333-4ddf-4ec9-8f8c-402f384ea661.png)

En esta pantalla se muestra el nivel 1 indicando en las esquinas superior la vida de los dos personajes reflejadas en corazones y en la esquina inferior derecha el botón de pausar el juego. Además se encuentran los respectivos personajes y policias sobre un escenario.

![image](https://user-images.githubusercontent.com/82967594/204653993-7c2e30b8-4a01-400c-86d5-9ad40ae64c40.png)

En el momento en el que uno de los dos jugadores muere este queda sin poder hacer nada en el nivel mostrandose a este mismo aturdido con estrellas en la cabeza.

![image](https://user-images.githubusercontent.com/82967594/204655605-fd7a0f31-16e6-4ddd-a76b-32692b721c53.png)

Al pulsar el botón de la esquina inferior derecha del nivel 1 se conduce a los jugadores a la interfaz de pausa con la opción de reanudar el juego o de volver a empezarlo de nuevo.

![image](https://user-images.githubusercontent.com/82967594/204654379-fc09ac55-084e-4bc3-94fe-3e4545ccf273.png)

Al superar el nivel a los jugadores se les lanzará esta pantalla donde indica que han superado con éxito el nivel. Además, aparece un botón "menu" que llevará de nuevo al selector de niveles.

![image](https://user-images.githubusercontent.com/82967594/204654978-7685ab69-b3ed-43b4-a2f2-9f3d54a9af9a.png)

En el momento en el que los jugadores mueran el nivel acaba y salta esta pantalla con la opción de volver al menu, es decir, al selector de niveles.

![image](https://user-images.githubusercontent.com/82967594/204658351-8f91597e-cb0d-4900-9a87-410504454256.png)

A continuación se mostrarán los diversos diagramas de navegación del juego:

Diagrama de la interfaz del menú del juego con la opcion de jugar que desenboca en el selector de modo del juego y en la selección del nivel.

![Diagrama de interfaces_2022-12-20_21-08-29](https://user-images.githubusercontent.com/84155484/208774146-526ffcba-78bd-4dba-b5a3-90bfe2b5ce39.png)

Diagrama de interfaz de pausa con la opción de reanudar o volver a empezar.

![image](https://user-images.githubusercontent.com/82967594/204658452-15eb4473-0122-45b2-89be-442515ba9aa7.png)

Diagrama de interfaz del final de partida en caso de Victoria con la opción de ir al menú.

![image](https://user-images.githubusercontent.com/82967594/204658536-419fe77d-9ea4-4fe5-b8ac-8ba11135ab60.png)

Diagrama de interfaz del final de partida en caso de Derrota con la opción de ir al menú.

![image](https://user-images.githubusercontent.com/82967594/204658640-d4a37212-468a-459c-a053-1bd8115c9f65.png)

A continuación se mostrará el diseño del juego enseñando los diferentes sprites:

![spritesapolis](https://user-images.githubusercontent.com/82967594/204659016-bad415a9-0bf2-4aec-b0ff-414f8d16a7d3.png)
![spritesTuerto8](https://user-images.githubusercontent.com/82967594/204659061-f2b7af86-3bb1-4643-9556-e1a4edf03363.png)
![spritesVivo](https://user-images.githubusercontent.com/82967594/204659098-3dd3981a-d13e-4f98-9bb3-8f455d842c4c.png)
![tuertoLife](https://user-images.githubusercontent.com/82967594/204659131-ab85146b-af85-4441-897d-fe7a1e322e80.png)
![vivoLife](https://user-images.githubusercontent.com/82967594/204659151-f69eb419-8649-491a-a970-10bfe0a472ef.png)

![bg-image-menu1](https://user-images.githubusercontent.com/82967594/204659344-277ca8d0-5e9e-4ad1-93aa-984bafdfb8e6.jpg)

## **ENTREGA FASE 3: API REST** 

![Diagrama de clases](https://user-images.githubusercontent.com/84155484/208774497-47ce8022-431c-4cda-8874-79595c80f759.png)

Se han creado 6 clases para controlar el servidor. Las clases *Message*, *Player* y *Lobby* son clases  *@Service* que permiten añadir elementos al propio servidor. La clase Lobby está compuesta de listas de Mensajes enviados y listas de Jugadores que se han conectado. Por otro lado, *File* es una clase de tipo *@Repository* que será la encargada de gestionar la persistencia de datos una vez se finalice la ejecución del proyecto en el servidor. *LobbyController* es una clase de tipo *@Controller*. En está clase se sitúan los métodos GET, POST y DELETE para crear, introducir y eliminar datos en el servidor. Es la clase contenedora de todo lo que tiene que ver con el REST. Finalmente la clase *SBApplication* es de tipo *@SpringBootApplication* y será la encargada de configurar automáticamente la aplicación en función de las dependencias agregadas en el proyecto.

### **Instrucciones para la ejecución de la aplicación**
1. Descomprimir JeR_22-23_F3_GRUPO-A.zip
2. Abrir la consola de comandos
3. El jar se encuentra dentr de la carpeta Prac3_GrafficJam\target. Escribir en la consola de comandos: java -jar Direccion del Jar (incluyendo al final de la dirección el nombre del archivo .jar)*
4. Abrir en un navegador localhost:8080

*(Se puede producir un error si java no está actualizado)


## **ENTREGA FASE 4: WEBSOCKETS** 

![Diagrama de Clases_2023-01-09_21-54-40](https://user-images.githubusercontent.com/115088130/211434133-943360b4-91df-4714-acbc-580e7bc71035.png)

Para el nivel online se han creado los archivos onlineLevel.js junto a pauseOnlineScene.js y gameWinOnline.js.

Para la inclusión de Websockets se ha creado la clase App.java, que se encarga de configurar el apartado de Websockets, además de Handler.java y connection.js. Cuando se quiere notificar al servidor de un cambio (para que este avise a su vez al otro jugador o para que actualice algún valor), connection.js se encargada de enviar un mensaje al servidor a través de la sesión del jugador. Este mensaje contiene un atributo llamado "idFunción" que al llegar al servidor, handler utiliza para seleccionar un case del switch que tiene. Cada case determina el tipo de acciones que se deberán llevar a cabo en consecuencia al aviso. Una vez se ha procesado el mensaje, se reenvía otro al cliente opuesto. Este lo recibe en connection.js, que utiliza la ID_Funcion del mensaje enviado desde el servidor para llevar a cabo las acciones necesarias y modificar lo que sea conveniente para que se transmita de forma correcta la información entre jugadores.

EJ: Movimiento a la derecha del Jugador 1

1. Cuando el Jugador 1 pulsa la tecla D, se ejecuta la función playerMoveRight() de connection.js, enviando así un mensaje al servidor
2. El servidor lo recibe y en Handler.java utiliza el atributo idFuncion = 5 para ejecutar el case(5), que envía otro mensaje pero esta vez al Jugador 2,         notificándole del movimiento de Vivo (Jugador 1)
3. El Jugador 2 recibe el mensaje en su clase connection.js, que gracias a ID_Funcion = 5 ejecuta la función activate_WEB_goRight() en el case 5
4. activate_WEB_goRight() está en onlineLevel.js y activa un booleano de forma que en el siguiente update, hará que se entre en un if() y se mueva a Vivo

De esta forma, las acciones de cada uno de los Jugadores se transmiten de forma correcta entre cada uno de ellos y se puede jugar online sin problemas.

![websockets explicacion](https://user-images.githubusercontent.com/81293638/211439455-b2dbc21b-f204-43ec-a803-4c3f7633bf70.png)


___
## **ENTREGA FASE 5: MEJORAS FINALES**

### **Fallos observados para mejorar en la Fase 5: <br>**

- El fondo de las pantallas de pausa, gameOver y gameWin dan fallo cuando se carga una de las pantallas. El fondo del primer menu en aparecer es el que sale en los tres menus restantes.

- Las animaciones del ataque de los enemigos son muy rápidas y los enemigos se superponen.

- Las detección de ataque tanto de enemigo a jugador como de jugador a enemigo está implementado de forma problematica en cuanto a las colisiones.
Se detecta la colisión por el bounding box de cada uno por lo que solo se detectan los ataques si se están moviendo y chocando en direccion al enemigo.

- Están implementados los world colliders pero si el personaje es empujado por el enemigo estos no funcionan.

- El movimiento en diagonal del personaje permanece cuando se suelta uno de los botones de movimiento.

- Cuando pausas en los niveles 2 y 3 no te deja volver a la partida.

- Los enemigos atacan muy rápido, por lo que, derrepente el jugador podría perder muchas vidas si tiene varios enemigos cerca.


___
### **Resolución de errores: <br>**

Los siguientes errores han sido solucionados:

- Daño de los enemigos. (Actualmente los enemigos quitan los corazones indicados cuando te atacan, es decir, en el nivel 1 tan solo 1 corazón, en el nivel 2 dos corazones y en el nivel 3 tres corazones).

- Superposición (Añadimos la capacidad de cambiar de la profundidad, creando la sensación de que los enemigos estan unos detrás de otros).

- Enemy collider (El jugador ya no necesita estar corriendo hacia los enemigos para hacerles daño al atacar).

- World collider (Los enemigos ya no te empujan fuera del mapa).

- Misma resolución de los personajes (Los personajes tienen ahora la misma resolución de imagen).

- Correcta gestión de escenas de pausa, gameover y gamewin.

- La animación de ataque de los enemigos ha sido ralentizada de modo que ahora sí puede verse correctamente.

- El movimiento en diagonal del personaje ya funciona correctamente, por lo que, si se deja de pulsar uno de los botones de movimiento, tan solo va a la dirección que estes pulsando.

- Ya deja volver a la partida aunque pauses en los niveles 2 y 3.

- Se ha arreglado el hecho de que los enemigos atacasen muy rápido.
<br>

### **Nuevas Implementaciones: <br>**

- **Cuenta atrás antes de comenzar el nivel: <br>**
  Ahora, al comienzo de cada nivel se dará una cuenta atrás para que los jugadores se preparen para superar el nivel.

![Countdown](https://user-images.githubusercontent.com/115088130/211434448-cb918ceb-89ae-4aab-9b27-6ec448eb4374.jpg)

- **Nuevos niveles: <br>**
  Se han implementado dos nuevos niveles con diferente temática, en el segundo de ellos nuestros personajes se encontrarán en una carretera, mientras que en el tercer nivel los personajes estarán en una estación de trenes. <br>
  Además, para poder acceder al nivel 2, los jugadores necesitarán superar el nivel 1 y, en caso de querer acceder al nivel 3, los jugadores tendrán que completar el nivel 2.

*Nivel 2* <br>
![Nivel 2](https://user-images.githubusercontent.com/115088130/211435235-aefc1550-0238-4bb5-a6aa-bc94476b6d87.png)

*Nivel 3* <br>
![fondollvl3(1)](https://user-images.githubusercontent.com/115088130/211435315-4bc50234-a48e-4d5c-9afb-6a84bf6bd365.jpg)

- **Nuevos fondos de victoria: <br>**
  Tanto el nivel 2 como el nivel 3 tendrán su propio fondo de victoria.
  
*Nivel 2* <br>
![image](https://github.com/lunsbzn/JaleoGames/assets/82967594/e519764b-e023-4fd8-8227-e9360f479bd1)

*Nivel 3* <br>
![image](https://github.com/lunsbzn/JaleoGames/assets/82967594/f2380c53-cf31-4d9d-89fa-45c1a3119d2b)

- **Nuevos enemigos: <br>**
  Además de implementar nuevos niveles se han desarrollado nuevos policias para los nuevos niveles. Asimismo, en el juego, los policias del nivel 2 quitarán un total de 2 corazones por golpe, y, los policias del nivel 3 quitarán 3 corazones por ataque realizado.

![imagen](https://user-images.githubusercontent.com/115088130/211435521-b3746afe-bae2-4ed1-8a5f-5a03aae95cc3.png)
![imagen](https://user-images.githubusercontent.com/115088130/211435529-703f1c51-6f86-4a8e-a9fc-98c20b0d4a40.png)

- **Nuevo fondo de Pausa: <br>**
  Se ha actualizado el aspecto visual del antiguo fondo de pausa. Ahora, además contiene los controles de los personajes para que los jugadores puedan consultarlos en cualquier momento.
  
![image](https://github.com/lunsbzn/JaleoGames/assets/82967594/24f0d8a5-0346-4208-96a8-175e848e3ab9)

- **Nuevo fondo de Derrota: <br>**
  Se ha actualizado el aspecto visual del fondo de derrota ya que el anterior nos parecía muy simple.
  
![image](https://github.com/lunsbzn/JaleoGames/assets/82967594/e36bee63-7fe0-4b2b-b8a1-cd50fb5d83e7)



- Juego Online.k




    
    

