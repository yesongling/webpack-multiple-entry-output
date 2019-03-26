define(['jquery','vue','global'],function($,Vue){
    new Vue({
        data: {
            icoStatus: null,
            preSaleInfo: {
                bonus: 0,
                ethPrice: 0.00
            }
        },
        el: '#dashboard',
        methods: {

        },
        beforeUpdate: function(a,b){
        },
        updated: function(){
        }
    });
});

