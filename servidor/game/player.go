package game

import (
	"github.com/gorilla/websocket"
)

type Battle struct {
	PlayerOne Player
	PlayerTwo Player
}

type Player struct {
	UID      int32           `json:"uid"`
	UserName string          `json:"userName"`
	Conn     *websocket.Conn `json:"-"`
	Board    Board           `json:"-"`
}
