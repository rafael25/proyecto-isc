var fs = require('fs');

module.exports = {
    template: fs.readFileSync('components/board.html', 'utf8'),

    props: ['conn', 'user', 'changeComponent'],

    created: function () {
        for (var i = 0; i < this.$data.boardSize; i++) {
            var boxList = [];
            for ( var j = 0; j < this.$data.boardSize; j++) {
                var box = {
                    x: j,
                    y: i,
                    used: false
                };
                boxList.push(box);
            }
            this.$data.boxes.push(boxList);
        }
    },

    data: function () {
        return {
            boardSize: 10,

            boxes: [],

            ships: [
                {size: 4, x: 0, y: 0, dir: 'v', positioned: false, name: 'grande'},
                {size: 3, x: 0, y: 0, dir: 'h', positioned: false, name: 'mediano'},
                {size: 2, x: 0, y: 0, dir: 'v', positioned: false, name: 'pequeño'},
                {size: 1, x: 0, y: 0, dir: 'v', positioned: false, name: 'minusculo'}
            ],

            shipSize: '',
        };
    },

    methods: {
        boxSelected: function(box) {
            if (this.shipSize <= 0 || this.shipSize > 4) {
                console.log('Barco fuera de proporciones');
                return;
            }
            var shipSize = parseInt(this.shipSize, 10);
            var ship = (function (arr, size) {
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i].size == size) {
                        return arr[i];
                    }
                }
            })(this.ships, shipSize);
            var sPoint = (ship.dir === 'v')? box.y : box.x;
            var inicio = sPoint;
            var fin = sPoint + shipSize - 1;
            if (fin > this.boardSize - 1) {
                console.log('Barco fuera de tablero inicio:' + inicio + ' fin:' + fin);
                return;
            }
            if (ship.positioned) {
                this.removeShip(ship);
            }
            this.locateShip(ship, box);
        },

        locateShip: function (ship, box) {
            var sPoint = (ship.dir === 'v')? box.y : box.x;
            var inicio = sPoint;
            var fin = sPoint + ship.size - 1;

            // TODO: Impedir que el barco a ubicar ocupe casillas de otro barco
            for (var i = inicio; i <= fin; i++) {
                if (ship.dir === 'v') {
                    this.boxes[i][box.x].used = true;
                } else if (ship.dir === 'h') {
                    this.boxes[box.y][i].used = true;
                }
            }
            ship.x = box.x;
            ship.y = box.y;
            ship.positioned = true;
        },

        removeShip: function (ship) {
            var sPoint = (ship.dir === 'v')? ship.y : ship.x;
            var inicio = sPoint;
            var fin = sPoint + ship.size - 1;
            for (var i = inicio; i <= fin; i++) {
                if (ship.dir === 'v') {
                    this.boxes[i][ship.x].used = false;
                } else if (ship.dir === 'h') {
                    this.boxes[ship.y][i].used = false;
                }
            }
        },

        rotateShip: function (ship, dir) {
            if (! ship.positioned) {
                return;
            }
            var sPoint = (dir === 'v')? ship.y : ship.x;
            var fin = sPoint + ship.size - 1;
            if (fin > this.boardSize - 1) {
                console.log('Barco fuera de tablero inicio:' + sPoint + ' fin:' + fin);
                return;
            }
            var box = {x: ship.x, y: ship.y};
            if (ship.positioned) {
                this.removeShip(ship);
            }
            ship.dir = dir;
            this.locateShip(ship, box);
        }
    }
}
