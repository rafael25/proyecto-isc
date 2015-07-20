var Vue = require('vue');
Vue.$http = require('vue-resource')(Vue);

Vue.component('login', require('../components/login.js'));

new Vue({
    el: "#main",

    data: {
        user: {
            userName: '',
            uid: 0
        },

        conn: {
            ws: null
        },

        component: 'login',

        messages: []
    },

    methods: {
        onLogin: function () {
            this.component = 'board';
        }
    }
});
