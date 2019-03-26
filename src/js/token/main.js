define(['jquery', 'vue', 'progressBar','global','dictionary'],function($,Vue){
    window.tokenDictionary = new Dictionary({
        language: 'cn',
        page: 'token'
    });

    new Vue({
        el: '#token',
        data: {
            days: null,
            hours: null,
            minutes: null,
            seconds: null,
            timestamp: null,
            themeIMG: null
        },
        methods: {

        },
        computed: {

        },
        beforeMount: function(){
        },
        mounted: function(){
        },
        destroyed: function(){
        }
    });

});
