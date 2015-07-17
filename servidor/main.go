package main

import (
	"flag"
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"time"

	"github.com/gorilla/websocket"
)

// clients almacena las conexiones de los usuarios identificadas por un uuid
var clients map[int32]*websocket.Conn

// battles relaciona los jugadores involucrados en una batalla
var battles map[int32]battle
var unaBatalla battle

type battle struct {
	PlayerOne int32
	PlayerTwo int32
}

type player struct {
	ID   int32
	Conn *websocket.Conn
}

type jsonMessage struct {
	Message string `json:"message"`
}

func init() {
	rand.Seed(time.Now().Unix())
	clients = make(map[int32]*websocket.Conn)
	battles = make(map[int32]battle)
}

func main() {
	port := flag.Int("port", 3000, "port to serve on")
	flag.Parse()

	http.HandleFunc("/ws", wsHandler)

	log.Printf("Running on port %d\n", *port)

	addr := fmt.Sprintf("127.0.0.1:%d", *port)

	err := http.ListenAndServe(addr, nil)
	fmt.Println(err.Error())
}

// wsHandler realiza la comunicacion entre cliente y servidor usando websockets
func wsHandler(w http.ResponseWriter, r *http.Request) {
	conn, err := websocket.Upgrade(w, r, nil, 1024, 1024)
	if _, ok := err.(websocket.HandshakeError); ok {
		http.Error(w, "Not a websocket handshake", 400)
		return
	} else if err != nil {
		log.Println(err)
		return
	}
	uid := rand.Int31()
	clients[uid] = conn
	log.Println("Succesfully upgraded connection whit id:", uid)

	if err = conn.WriteJSON(uid); err != nil {
		log.Println(err)
		conn.Close()
		return
	}

	unaBatalla.crearConexion(uid)
	log.Printf("%+v", unaBatalla)

	var message jsonMessage
	for {
		err := conn.ReadJSON(&message)
		if err != nil {
			log.Println(err)
			conn.Close()
			return
		}
		log.Printf("%+v", message)

		enviarAJugadores(message)
	}
}

func enviarAJugadores(m jsonMessage) {
	connOne := clients[unaBatalla.PlayerOne]
	connTwo := clients[unaBatalla.PlayerTwo]

	if err := connOne.WriteJSON(m); err != nil {
		log.Println(err)
		connOne.Close()
		return
	}

	if err := connTwo.WriteJSON(m); err != nil {
		log.Println(err)
		connTwo.Close()
		return
	}
}

func (b *battle) crearConexion(player int32) {
	if b.PlayerOne == 0 {
		b.PlayerOne = player
	} else if b.PlayerTwo == 0 {
		b.PlayerTwo = player
	}
}
