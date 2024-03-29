var fs = require('fs');

module.exports = {
    template: fs.readFileSync('components/login.html', 'utf8'),

    props: ['conn', 'user', 'changeComponent'],

    methods: {
        login: function () {
            if (! this.user.userName) {
                return
            }
            this.$http.post('http://localhost:3000/login', JSON.stringify(this.user))
                .success(function (data, status, request) {
                    this.user.uid = data.uid;

                    var ws = new WebSocket(this.conn.server);
                    this.conn.ws = ws;
                    ws.addEventListener('open', this.wsOnOpen);
                });
        },

        wsOnOpen: function () {
            this.conn.ws.send(JSON.stringify(this.user));
            this.changeComponent('board');
        },
    }
}
