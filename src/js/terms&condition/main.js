define(['jquery','vue','global'],function($,Vue){

    new Vue({
      data: {},
      el: '#root',
      methods: {},
      computed: {
      },
      mounted: function () {
      }
    });

    $(function(){
        /* handle footer link */
        var params;
        if(location.search){
            params = location.search.replace(/\?/,'#');
        }
        $(params).click();


    })
});
