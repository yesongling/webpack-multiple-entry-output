define(['jquery','vue','mCustomScrollbar','global','bootstrap-datetimepicker','fileUploader','dictionary','bootstrap-datetimepicker.zh-CN'],function($,Vue,mCustomScrollbar){
    window.whitelistDictionary = new Dictionary({
        language: BITCOLA.language(),
        page: 'whitelist'
    });

    var formVm = new Vue({
        el: '#whitelistForm',
        data: {
            firstName: null,
            lastName: null,
            birthday: null,
            gender: "man",
            email: null,
            telPhone: null
        },
        methods: {

        },
        computed:{

        },
        beforeMount: function(){

        },
        updated: function(){

        }
    });
    $(function(){

    })
});
