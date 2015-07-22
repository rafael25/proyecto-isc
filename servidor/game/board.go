package game

type Coordinate struct {
	X uint8
	Y uint8
}

type Board struct {
	battleShips []Coordinate
}

func (b *Board) AddBattleShip(ship Coordinate) {
	b.battleShips = append(b.battleShips, ship)
}
