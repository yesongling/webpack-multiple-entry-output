/*page*/

var Page = {
    /*total:数据总条数 number：一行显示多少页 lines：每页显示行数 action：换页时执行的方法*/
    props: ['total','numbersm', 'numberlg','action', 'lines'],
    data: function () {
        return {
            curpage: 1,
            language: BITCOLA.language().toLowerCase(),
            number:0
        }
    },
    beforeMount: function () {
        this.getNumber();
        this.$root.lines = this.lines;
        this.action(this.curpage, this.lines);

    },
    methods: {
        getNumber:function(){
            if(window.screen.width>767){
                this.number=this.numberlg;
            }else{
                this.number=this.numbersm;
            }
        },
        firstpage: function () {
            this.curpage = 1;
            this.action(this.curpage, this.lines);
        },
        prepage: function () {
            if(this.curpage>1){
                this.curpage--;
                this.action(this.curpage, this.lines);
            }
        },
        nextpage: function () {
            if(this.curpage<this.totalpages){
                this.curpage++;
                this.action(this.curpage, this.lines);
            }
        },
        lastpage: function () {
            this.curpage = this.totalpages;
            this.action(this.curpage, this.lines);
        },
        changepage: function (p) {
            this.curpage = p;
            this.action(this.curpage, this.lines);
        }
    },
    computed: {
        rows: {
            get: function () {
                if (this.curpage < this.number) {
                    return 0
                } else {
                    return Math.floor((this.curpage - 1) / this.number)
                }
            }
        },
        totalpages: {
            get: function () {
                if (this.total > 0) {
                    return Math.ceil(this.total / this.lines)
                } else {
                    return 0
                }
            }
        },
        pages: {
            get: function () {
                var arr = [];
                var totalRows=Math.floor(this.totalpages / this.number);
                if(this.totalpages % this.number === 0){
                    for (var i = 0; i < this.number; i++) {
                        arr[i] = this.number * this.rows + i + 1
                    }
                }else{
                    if (this.rows ===totalRows) {
                        for (var i = 0; i < this.totalpages % this.number; i++) {
                            arr[i] = this.number * this.rows + i + 1
                        }
                    }else {
                        for (var i = 0; i < this.number; i++) {
                            arr[i] = this.number * this.rows + i + 1
                        }
                    }
                }
                return arr;
            }
        },
    },
    template: '<div><div class="pages" v-if="totalpages>1">\n' +
        '                    <ul>\n' +
        '                        <li>\n' +
        '                            <a class="trangle" v-bind:class="{disable:curpage===1}" @click="firstpage"><i\n' +
        '                                    class="glyphicon glyphicon-triangle-left"></i></a>\n' +
        '                        </li>\n' +
        '                        <li>\n' +
        '                            <a class="trangle" v-bind:class="{disable:curpage===1}" @click="prepage"><i\n' +
        '                                    class="glyphicon glyphicon-chevron-left"></i></a>\n' +
        '                        </li>\n' +
        '                        <li v-for="item in pages"\n' +
        '                            ><a @click="changepage(item)"\n' +
        '                                                                   v-text="item"\n' +
        '                                                                   v-bind:class="{active:(curpage===item)}"></a>\n' +
        '                        </li>\n' +
        '                        <li>\n' +
        '                            <a class="trangle" v-bind:class="{disable:curpage===totalpages}" @click="nextpage"><i\n' +
        '                                    class="glyphicon glyphicon-chevron-right"></i></a>\n' +
        '                        </li>\n' +
        '                        <li>\n' +
        '                            <a class="trangle" v-bind:class="{disable:curpage===totalpages}" @click="lastpage"><i\n' +
        '                                    class="glyphicon glyphicon-triangle-right"></i></a>\n' +
        '                            \n' +
        '                        </li>\n' +
        '                    </ul>\n' +
        '                            <p v-if="language===\'cn\'" class="total">共<span v-text="totalpages"></span>页</p>\n' +
        '                            <p v-if="language===\'en\'" class="total">Total<span v-text="totalpages"></span>pages</p>\n' +

        '                </div>' +
        '<div v-if="total<1" class="no-record"><span v-if="language===\'cn\'">暂无记录!</span><span v-if="language===\'en\'">No record!</span></div></div>'
}

