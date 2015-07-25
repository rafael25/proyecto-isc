var Vue = require('vue');
Vue.$http = require('vue-resource')(Vue);

Vue.component('login', require('../components/login.js'));
Vue.component('board', require('../components/board.js'));

new Vue({
    el: "#main",

    data: {
        user: {
            userName: '',
            uid: 0
        },

        conn: {
            server: 'ws://localhost:3000/ws',
            ws: null
        },

        component: 'board',

        messages: []
    },

    methods: {
        onLogin: function () {
            this.component = 'board';
        }
    }
});
