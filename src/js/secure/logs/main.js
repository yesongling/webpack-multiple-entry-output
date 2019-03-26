define(['jquery', 'vue', 'global', 'dictionary','bootstrap','page'], function ($, Vue) {

    new Vue({
        el: '#securityLogs',
        components: {
            Page:Page
        },
        data: {
            logsList: [],
            totalLines: 0,
            curpage:1
        },
        methods: {

        },
        computed: {

        },
        beforeMount: function () {
        },
        beforeUpdate: function () {
        },
        updated: function () {
        }
    });
});
