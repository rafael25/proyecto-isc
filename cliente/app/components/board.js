var fs = require('fs');

module.exports = {
    template: fs.readFileSync('components/board.html', 'utf8'),

    props: ['conn', 'user', 'changeComponent'],

    created: function () {
        for (var i = 0; i < 10; i++) {
            var boxList = [];
            for ( var j = 0; j < 10; j++) {
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
            boxes: [],

            ships: [
                {size: 4, x: 0, y: 0, dir: 'v', positioned: false},
                {size: 3, x: 0, y: 0, dir: 'v', positioned: false},
                {size: 2, x: 0, y: 0, dir: 'v', positioned: false},
                {size: 1, x: 0, y: 0, dir: 'v', positioned: false}
            ],

            ship: ''
        };
    },

    methods: {
        boxSelected: function(box) {
            if (this.ship <= 0 || this.ship > 4) {
                console.log('Barco fuera de proporciones');
                return;
            }
            var inicio = box.y;
            var fin = box.y + parseInt(this.ship, 10) - 1;
            if (fin > 9) {
                console.log('Barco fuera de tablero inicio:' + inicio + ' fin:' + fin);
                return;
            }
            this.locateShip(this.ship, box, 'v');
        },

        locateShip: function (shipSize, box, dir) {
            var ship = (function (arr, size) {
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i].size == size) {
                        return arr[i];
                    }
                }
            })(this.ships, shipSize);

            // TODO: Mover esto a un metodo removeShip
            // TODO: Quitar el barco de su antigua ubicacion solo si
            // la nueva es valida
            if (ship.positioned) {
                var inicio = ship.y;
                var fin = ship.y + ship.size - 1;
                for (var i = inicio; i <= fin; i++) {
                    if (ship.dir === 'v') {
                        this.boxes[i][ship.x].used = false;
                    } else if (ship.dir === 'h') {
                        this.boxes[ship.y][i].used = false;
                    }
                }
            }

            var inicio = box.y;
            var fin = box.y + parseInt(shipSize, 10) - 1;

            // TODO: Impedir que el barco a ubicar ocupe casillas de otro barco
            for (var i = inicio; i <= fin; i++) {
                if (dir === 'v') {
                    this.boxes[i][box.x].used = true;
                } else if (dir === 'h') {
                    this.boxes[box.y][i].used = true;
                }
            }
            ship.x = box.x;
            ship.y = box.y;
            ship.dir = dir;
            ship.positioned = true;
        }
    }
}
