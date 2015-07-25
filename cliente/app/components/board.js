var fs = require('fs');

module.exports = {
    template: fs.readFileSync('components/board.html', 'utf8'),

    props: ['conn', 'user'],

    data: function () {
        return {
            x: [0,1,2,3,4,5,6,7,8,9],
            y: [0,1,2,3,4,5,6,7,8,9],
            lastBox: {
                x: 0,
                y: 0
            }
        };
    },

    methods: {
        cordClicked: function(x, y) {
            this.lastBox.x = x;
            this.lastBox.y = y;
            console.log(x, y);
        }
    }
}
