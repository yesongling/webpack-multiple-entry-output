;(function(global,factory){
    return global.ColaProgressBar = factory()
})(window,function(){
    function ProgressBar(params){
        /*
        * nodeList = [
        *   { location : percentage|string , text : string }
        * ]
        * */
        this.el = document.querySelector(params.el);  // initialize element
        this.nodeList = params.nodes || {};  // time line node obj
        this.progress = params.progress || 0.2;  // percentage float

        this.init();
    }

    ProgressBar.prototype.init = function(){
        this.el.appendChild(this.createProgressBar());
        this.el.appendChild(this.createTimeLine());
    };

    ProgressBar.prototype.createTimeLine = function(){
        var timeLine = document.createElement('div');
        timeLine.className = 'progress-time-line';

        for(var _node in this.nodeList) {
            timeLine.appendChild(this.createTimeLineNode(this.nodeList[_node]));
        }

        return timeLine;
    };

    ProgressBar.prototype.createTimeLineNode = function(_node){
        var node = document.createElement('div'),
            nodeSeparator = document.createElement('div'),
            nodeName = document.createElement('div');
        node.className = "progress-time-line-node";
        node.style.width = _node.location;
        node.style.float = 'left';
        nodeSeparator.className = "separator-line";
        nodeName.className = "node-name";
        nodeName.innerText = _node.text;

        node.appendChild(nodeSeparator);
        node.appendChild(nodeName);
        return node;
    };

    ProgressBar.prototype.createProgressInner = function(){
        var innerShape = document.createElement('div');
        innerShape.className = 'progress-bar-inner';

        return innerShape;
    };

    ProgressBar.prototype.createProgressOuter = function(){
        var outerShape = document.createElement('div');
        outerShape.className = 'progress-bar-outer';

        return outerShape;
    };

    ProgressBar.prototype.createProgressBar = function(){
        var progressBar = document.createElement('div');
        progressBar.className = 'progress-bar-shape';

        progressBar.appendChild(this.createProgressOuter());
        progressBar.appendChild(this.createProgressInner());
        return progressBar;
    };

    return ProgressBar;
});
