var Vue = require('vue');
Vue.$http = require('vue-resource')(Vue);

new Vue({
    el: "#loginForm",

    ws: null,

    data: {
        conn: {
            userName: '',
            uid: 0
        },

        messages: []
    },

    methods: {
        login: function () {
            if (! this.conn.userName) {
                return
            }
            this.$http.post('http://localhost:3000/login', JSON.stringify(this.conn))
                .success(function (data, status, request) {
                    this.conn.uid = data.uid;

                    var ws = new WebSocket('ws://localhost:3000/ws');
                    this.$options.ws = ws;
                    ws.addEventListener('open', this.wsOnOpen);
                    ws.addEventListener('close', this.wsOnClose);
                    ws.addEventListener('message', this.wsOnMessage);
                });
        },
        
        wsOnOpen: function () {
            this.$options.ws.send(JSON.stringify(this.conn));
        },

        wsOnMessage: function (event) {
            // TODO: wsOnMessage debe almacenar los mensajes recibidos
            console.log('WebSocket onMessage');
        },

        wsOnClose: function (event) {
            // TODO: wsOnClose debe enviar un mensaje al usuario informando que ha sido desconectado
            console.log('WebSocket onClose');
        }
    }
});
