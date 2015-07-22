package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"time"

	"github.com/gorilla/websocket"
	"github.com/rafael25/proyecto-isc/servidor/game"
)

// players almacena las conexiones de los usuarios identificadas por un uuid
var players map[int32]game.Player

// battles relaciona los jugadores involucrados en una batalla
var battles map[int32]game.Battle

func init() {
	rand.Seed(time.Now().Unix())
	players = make(map[int32]game.Player)
	battles = make(map[int32]game.Battle)
}

func main() {
	port := flag.Int("port", 3000, "port to serve on")
	flag.Parse()

	http.HandleFunc("/login", loginHandler)
	http.HandleFunc("/ws", wsHandler)

	log.Printf("Running on port %d\n", *port)

	addr := fmt.Sprintf("127.0.0.1:%d", *port)

	err := http.ListenAndServe(addr, nil)
	fmt.Println(err.Error())
}

// wsHandler eleva la conexio http con el cliente a websockets
func wsHandler(w http.ResponseWriter, r *http.Request) {
	conn, err := websocket.Upgrade(w, r, nil, 1024, 1024)
	if _, ok := err.(websocket.HandshakeError); ok {
		http.Error(w, "Not a websocket handshake", 400)
		return
	} else if err != nil {
		log.Println(err)
		return
	}
	defer conn.Close()

	var data struct {
		UserName string `json:"userName"`
		UID      int32  `json:"uid"`
	}
	if err := conn.ReadJSON(&data); err != nil {
		log.Fatal(err)
		return
	}
	if p, ok := players[data.UID]; ok {
		p.Conn = conn
		log.Println("El jugador con uid", data.UID, "inició conexión websocket")
	} else {
		log.Println("EL jugador con uid", data.UID, "no tiene sesión iniciada")
		return
	}
}

func loginHandler(w http.ResponseWriter, r *http.Request) {
	var newPlayer game.Player
	var data struct {
		UserName string `json:"userName"`
	}
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&data); err != nil {
		log.Fatal(err)
		return
	}
	uid := rand.Int31()
	newPlayer.UID = uid
	newPlayer.UserName = data.UserName
	players[uid] = newPlayer
	w.Header().Set("Content-Type", "application/json")
	encoder := json.NewEncoder(w)
	if err := encoder.Encode(newPlayer); err != nil {
		log.Fatal(err)
		return
	}
	log.Printf("Jugador %+v ha iniciado sesión", newPlayer)
}
