;(function(global,factory){
    return global.FileUploader = factory();
})(window,function(){
    function UploadFile(params){
        this.result = document.getElementById(params.fileShowBack);
        this.file = document.getElementById(params.fileForm);
        this.type = params.type||'';
        this.callback = params.callback;
        this.init();
    }

    UploadFile.prototype.init = function(){
        this.checkBrowserCompatibility();

        switch(this.type){
            case 'url':
                this.readAsDataURL();
                break;
            case 'binary':
                var data = this.readAsBinaryString();
                break;
            case 'text':
                this.readAsText();
                break;
            default:
                alert("Unknown 'type' passed. Can't run FileUploader correctly");
                break;
        }
    };

    UploadFile.prototype.checkBrowserCompatibility = function(){
        if(typeof FileReader === 'undefined'){
            this.result.InnerHTML = "<p>You browser is not support FileReader API!</p>";
            this.file.setAttribute("disabled","disabled");
        }
    };

    UploadFile.prototype.readAsDataURL = function(){
        var files = this.file.files[0];
        var reader = new FileReader();
        var that = this;

        if(!/image\/\w+/.test(files.type)){
            return false;
        }

        reader.readAsDataURL(files);
        reader.onload = function(e){
            that.result.innerHTML = '<img src="' + this.result +'" alt="" />'; // show upload file
        }
    };

    UploadFile.prototype.readAsBinaryString = function(){
        var files = this.file.files[0];
        var reader = new FileReader();
        var that = this;
        var dataString;

        reader.onloadend = function(){
            debugger
        };
        reader.readAsBinaryString(files);
        reader.onload = function(e){
            this.callback();
        };
    };

    UploadFile.prototype.readAsText = function(){
        var files = this.file.files[0];
        var reader = new FileReader();
        var that = this;

        reader.readAsText(files);
        reader.onload = function(f){
            that.result.innerHTML = this.result; // show upload file
        }
    };

    return UploadFile;
});
