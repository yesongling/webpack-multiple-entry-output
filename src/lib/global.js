define(["jquery", "vue", "dictionary", 'animation'], function ($, Vue) {
    var Project = {
        default: {
            loadingIMG: '',
            avatarStr: '',
            helpCenter: '',
            capathaId:''
        },
        regexpStr: {
            phone: '^1[0-9]{10}$',
            email: '^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$',
            password: '^.*(?=.{6,16})(?=.*\\d)(?=.*([A-Za-z]){1}).*$',
            eth: '^(0x|0X)?[0-9A-Fa-f]{40}$',
            execURL: '^(?:([A-Za-z]+):)?(\\/{0,3})([0-9.\\-A-Za-z]+)(?::(\\d+))?(?:\\/([^?#]*))?(?:\\?([^#]*))?(?:#(.*))?$',
            objType: /\[|]|object\s/g
        },
        ASSETS: location.protocol + '//' + location.host,
        OSS: '',
        SOCKS: 'ws'+location.protocol.replace(/http/,'') +'//' + location.host,
        language: function () {
            if (/language=[a-z]+/g.exec(document.cookie) && (/language=[a-z]+/g.exec(document.cookie))[0].replace(/language=/, '')) {
                return (/language=[a-z]+/g.exec(document.cookie))[0].replace(/language=/, '')
            } else {
                var lang = navigator.language || navigator.userLanguage;
                if (lang.indexOf('CN') >= 0) {
                    return 'cn'
                } else {
                    return 'en'
                }
            }
        },
        device: function(){
            var userAgent = navigator.userAgent;
            return (userAgent.indexOf('Android').length>0&&userAgent.indexOf('Mobile').length>0)||userAgent.indexOf('iPhone').length>0||userAgent.indexOf('Mobile').length>0?'mobile':'largeScreen'
        },
        socketProtocol: function(){
            return 'ws'+location.protocol.replace(/http/,'')
        },
        randomString: function(len){
            var randomSource = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.split('');
            var index=0,string='';
            for (var i=0;i<len;i++){
                index = parseInt(Math.random()*100);
                index = index >=62?parseInt(Math.random()*10):index;
                string += randomSource[index];
                if(randomSource[index]===undefined){
                    console.log(index);
                }
            }
            return string
        },
        initialAnimation: function(){

        },
        detectObjType: function(val, expect, fn){
            /**
             * val    : String , object to be detected
             * expect : String , a basic type that <val> expected to be [Object, Array, Function...]
             * fn     : Function , callback
             * */
            var type = Object.prototype.toString.call(val).replace(Project.regexpStr.objType,'');
            Object.prototype.toString.call(fn).replace(Project.regexpStr.objType,'')==='Function' && fn(type);

            if (!expect) {
                return type
            }
            else if (!!expect && type.toLowerCase() === expect.toLowerCase()) {
                return true;
            }
            else {
                return false;
            }
        },
        detectJSONproperty: function(json, properties){
            /**
             * json       : {} , json object to be detect
             * properties : [] , object properties
             * */
            var result = {
                isPass   : true,
                original : {}
            };
            Project.detectObjType(json, undefined, function(dataType){
                try {
                    dataType === 'Object' && properties.forEach(function (item) {
                        result.original.item = json.hasOwnProperty(item);
                        if (!json.hasOwnProperty(item)) {
                            result.isPass = json.hasOwnProperty(item);
                        }
                    });
                } catch (e) {
                    console.error(e)
                }
            });
            return result;
        }
    };

    var docCookies = {
        getItem: function (sKey) {
            return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[-.+*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
        },
        setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
            if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) {
                return false;
            }
            var sExpires = "";
            if (vEnd) {
                switch (vEnd.constructor) {
                    case Number:
                        sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
                        break;
                    case String:
                        sExpires = "; expires=" + vEnd;
                        break;
                    case Date:
                        sExpires = "; expires=" + vEnd.toUTCString();
                        break;
                }
            }
            document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
            return true;
        },
        removeItem: function (sKey, sPath, sDomain) {
            if (!sKey || !this.hasItem(sKey)) {
                return false;
            }
            document.cookie = encodeURIComponent(sKey) + "=; expires=1" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
            return true;
        },
        hasItem: function (sKey) {
            return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[-.+*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
        },
        keys: /* optional method: you can safely remove it! */ function () {
            var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
            for (var nIdx = 0; nIdx < aKeys.length; nIdx++) {
                aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]);
            }
            return aKeys;
        }
    };

    /* global loading animation */
    (function (global, factory) {
        return global.LoadingAnimation = factory();
    })(window, function () {
        function LoadingAnimation(param) {
            this.img = param.img || "";
            this.actionType = param.actionType || "show";
            this.shouldCreateDOM = this.checkExists();
            this.init()
        }

        LoadingAnimation.prototype.init = function () {
            this.shouldCreateDOM ? this.createDOM() : this.switchLoding();
        };

        LoadingAnimation.prototype.checkExists = function () {
            return !document.body.querySelectorAll('.loading').length > 0
        };

        LoadingAnimation.prototype.createDOM = function (img) {
            var loadingIMG = document.createElement("img");
            this.loadingDOM = document.createElement("div");
            this.loadingDOM.className = "loading";
            loadingIMG.src = this.img;
            loadingIMG.setAttribute('alt', 'loading icon');
            this.loadingDOM.appendChild(loadingIMG);
            document.body.appendChild(this.loadingDOM);
        };

        LoadingAnimation.prototype.switchLoding = function (param) {
            this.actionType = param || this.actionType;
            switch (this.actionType) {
                case "show":
                    document.querySelectorAll('.loading')[0].style.display = "block";
                    break;
                case "hide":
                    document.querySelectorAll('.loading')[0].style.display = "none";
                    break;
                default:
                    console.warn("\nUnknown action type: " + Object.prototype.toString.call(actionType));
                    break;
            }
        };

        return LoadingAnimation
    });

    /* socket */
    (function (context, factory) {
        return context.Project_Socket = factory()
    })(window, function () {
        function Project_Socket(params) {
            this.baseURL          = null;
            this.initSubscribes   = null;
            this.readyStatus      = null;
            this.params           = params;
            this.reconnectCounter = 0;
            this.init(params)
        }

        Project_Socket.prototype.init = function (params) {
            for (var i in params) {
                this[i] = params[i]
            }

            if ('WebSocket' in window) {
                this.webSocket = new WebSocket(this.baseURL);
            }
            else if ('MozWebSocket' in window) {
                this.webSocket = new MozWebSocket(this.baseURL);
            }
            else {
                this.webSocket = new SockJS(this.baseURL);
            }

            this.webSocket.addEventListener('open', $.proxy(this.onOpen, this));
            this.webSocket.addEventListener('message', $.proxy(this.onMessage, this));
            this.webSocket.addEventListener('close', $.proxy(this.onClose, this));
            this.webSocket.addEventListener('error', $.proxy(this.onError, this));
            window.addEventListener('beforeunload', $.proxy(this.close, this))
        };

        Project_Socket.prototype.onOpen = function (evt) {
            this.readyStatus = 1;
            this.send(evt);
            try {
                if (this.connected && Object.prototype.toString.call(this.connected).replace(/\[object\s+|]/g, '') === 'Function') {
                    this.connected(evt)
                } else if (this.connected && Object.prototype.toString.call(this.connected).replace(/\[object\s+|]/g, '') !== 'Function') {
                    throw 'Param connected must be a Function'
                }
            } catch (e) {
                console.error(e)
            }
        };

        Project_Socket.prototype.onMessage = function (evt) {
            try {
                if (this.message && Object.prototype.toString.call(this.message).replace(/\[object\s+|]/g, '') === 'Function') {
                    this.message(evt)
                } else if (this.message && Object.prototype.toString.call(this.message).replace(/\[object\s+|]/g, '') !== 'Function') {
                    throw 'Param message must be a Function'
                }
            } catch (e) {
                console.error(e)
            }
        };

        Project_Socket.prototype.onClose = function (evt) {
            var that = this;
            this.readyStatus = evt.currentTarget.readyState;
            clearInterval(this.heartbeat);

            setTimeout(function(){
                that.init(that.params);
                console.log(new Project_DateTimeString(new Date().getTime()).monthDateTimeString+' Socket' +
                  ' reconnecting...')
            },Math.pow(this.reconnectCounter++,2) * 300);
            try {
                if (this.closed && Object.prototype.toString.call(this.closed).replace(/\[object\s+|]/g, '') === 'Function') {
                    this.closed(evt)
                } else if (this.closed && Object.prototype.toString.call(this.closed).replace(/\[object\s+|]/g, '') !== 'Function') {
                    throw 'Param closed must be a Function'
                }
            } catch (e) {
                console.error(e)
            }

        };

        Project_Socket.prototype.onError = function (evt) {
            this.readyStatus = evt.currentTarget.readyState;
            try {
                if (this.error && Object.prototype.toString.call(this.error).replace(/\[object\s+|]/g, '') === 'Function') {
                    this.error(evt)
                } else if (this.error && Object.prototype.toString.call(this.error).replace(/\[object\s+|]/g, '') !== 'Function') {
                    throw 'Param error must be a Function'
                }
            } catch (e) {
                console.error(e)
            }
        };

        Project_Socket.prototype.send = function (evt) {
            var that = this;
            this.webSocket.send(JSON.stringify({
                'subscribe': this.initSubscribes
            }));

            /* heart beat */
            clearInterval(this.heartbeat);
            this.heartbeat = setInterval(function () {
                that.webSocket.send(JSON.stringify({
                    "type": "ping"
                }))
            }, 30000)
        };

        Project_Socket.prototype.close = function () {
            this.webSocket.close();
        };

        return Project_Socket
    });

    /* validation error message */
    (function (global, factory) {
        return global.ValidFailed = factory();
    })(window, function () {
        function ValidErr(params) {
            this.el      = params.el || new Error('Null Exception: Element can`t be null');
            this.errMsg  = params.msg || 'error.';
            this.animate = null;
            this.animateRoot = null;
            this.init();
        }

        ValidErr.prototype.init = function () {
            var that = this;
            try {
                if(!!this.el.getAttribute('data-animate')&&!!this.el.getAttribute('data-animate-root')){
                    this.animate      = 'animation-'+this.el.getAttribute('data-animate');
                    this.$animateRoot = this.el.getAttribute('data-animate-root')==="self"?$(this.el):$(this.el).parents('.animation-root');
                }
            } catch (e) {

            } finally {
                this.el.nextSibling && $(this.el.nextSibling).hasClass('error') ? Array.prototype.forEach.call(this.el.nextSibling, function (item, index) {
                    if (item.className.indexOf('error') >= 0) {
                        return
                    }
                }) : this.el.parentElement.appendChild(this.createDOM());
                if(!!this.animate){
                    this.$animateRoot.removeClass(this.animate).addClass(this.animate);
                    clearTimeout(window.validAnimateTimer);
                    window.validAnimateTimer = setTimeout(function(){
                        $(that.$animateRoot).removeClass(that.animate)
                    },1000)
                }
            }
        };

        ValidErr.prototype.createDOM = function () {
            var dom = document.createElement('span');
            dom.className = 'error';
            dom.innerText = this.errMsg;

            this.el.className += ' err';

            return dom;
        };

        return ValidErr
    });

    /* Simply change dropdown menu display text */
    (function (global, $, factory) {
        return global.JqDropDown = factory();
    })(window, jQuery, function () {

        function DropDown(el) {
            this.el = el;
            this.init()
        }

        DropDown.prototype.init = function () {
            $(this.el).on('click', '.dropdown-menu a', {that: this}, this.onSelect);
        };

        DropDown.prototype.onSelect = function (e) {
            $(e.data.that.el).find('a.btn').text($(e.target.parentElement).attr('data-value'));
        };

        return DropDown
    });


    (function (global, factory) {
        return global.Modal = factory()
    })(window, function () {
        function Modal(params) {
            this.title = params.title || '';
            this.id = params.id || '';
            this.content = params.content || '';
            this.footer = params.footer || '';
            this.emoticon = params.emoticon || '';
            this.cssClass = params.cssClass || '';
            this.modalDOM = null;
            this.$modal = null;
            this.autoHide = params.autoHide === undefined ? true : params.autoHide;

            this.init();
        }

        Modal.prototype.tmpl = function () {
            return '<div class="modal fade ' + this.cssClass + '" id="' + this.id + '" tabindex="-1" role="dialog">\n' +
                '  <div class="modal-dialog modal-sm" role="document">\n' +
                '    <div class="modal-content">\n' +
                '      <div class="modal-header">\n' +
                '        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\n' +
                '        <h4 class="modal-title">' + this.title + '</h4>\n' +
                '      </div>\n' +
                '      <div class="modal-body">\n' +
                '        <h3>' + this.emoticon + '</h3>\n' +
                '        <p>' + this.content + '</p>\n' +
                '      </div>\n' +
                '      <div class="modal-footer">\n' +
                '        <div>' + this.footer + '</div>\n' +
                '      </div>\n' +
                '    </div>\n' +
                '  </div>\n' +
                '</div>'
        };

        Modal.prototype.createDOM = function () {
            this.$modal = $(this.tmpl());
            this.modalDOM = $('body').append(this.$modal)
        };

        Modal.prototype.destroy = function () {
            this.modalDOM ? this.modalDOM.remove() : null;
        };

        Modal.prototype.show = function () {
            // this.scrollTop = $(window).scrollTop();
            // $('body').css({'top': -this.scrollTop});
            this.$modal.modal('show');
            window.isModalOpen = true;
        };

        Modal.prototype.hide = function () {
            this.$modal.modal('hide');
        };

        Modal.prototype.onShown = function () {
            var that = this;
            this.$modal.on('shown.bs.modal', function () {
                if (that.autoHide) {
                    that.timer = setTimeout(function () {
                        that.$modal.modal('hide')
                    }, 1000)
                }
            });
        };

        Modal.prototype.onHidden = function () {
            var that = this;
            this.$modal.on('hidden.bs.modal', function () {
                that.destroy();
                // $(window).scrollTop(that.scrollTop);
                window.isModalOpen = false;
                setTimeout(function(){
                    $('body').css('padding-right',0)
                },0)
            });
        };

        Modal.prototype.onHide = function () {
            var that = this;
            this.$modal.on('hide.bs.modal', function () {
                // $('body').css({'top': 'auto'});
            });
        };

        Modal.prototype.destroy = function () {
            this.$modal.off('hidden.bs.modal').off('shown.bs.modal').remove();
            this.timer ? clearTimeout(this.timer) : null;
        };

        Modal.prototype.init = function () {
            if (!window.isModalOpen) {
                this.createDOM();
                this.onShown();
                this.onHide();
                this.onHidden();
                this.show();
            }
        };

        return Modal
    });

    (function (global, factory) {
        return global.MobileSelect = factory()
    })(window, function () {
        function Select(el) {
            this.el = el;
            this.init();
        }

        Select.prototype.init = function () {
            this.touchStart = {};
            this.currentTouch = {};
            this.touchEnd = {};
            this.rows = null;
            this.translateY = null;
            if (this.checkDOM()) {
                this.$title = this.title();
                this.$mask = this.mask();
                this.$indicator = this.indicator();
                this.initializeDOM();
            } else {
                this.$title = $(this.el).find('.select-title');
                this.$mask = $(this.el).find('.select-content-mask');
                this.$indicator = $(this.el).find('.select-content-indicator');
            }
            // this.pick();
            this.$list = $(this.el).find('.select-content-list');
            $('body').on('shown.bs.dropdown', '.dropdown', function (e) {
                $('body').addClass('modal-open').css({'top': -$(window).scrollTop()});
                $(this).addClass('dropdown-open');
            })
                .on('hide.bs.dropdown', '.dropdown', function (e) {
                    $('body').addClass('dropdown-open').css({'top': 'auto'});
                    $(this).removeClass('dropdown-open')
                });

            document.addEventListener('touchstart', $.proxy(this.onTouchSlide, this), false);
            document.addEventListener('touchmove', $.proxy(this.onTouchMove, this), false);
            document.addEventListener('touchend', $.proxy(this.onTouchEnd, this), false);
        };

        Select.prototype.checkDOM = function () {
            return !$(this.el).hasClass('custom-select');
        };

        Select.prototype.initializeDOM = function () {
            this.$selectDOM = $('<div class="select-wrapper"><div class="select-content"><div class="select-content-list"></div></div></div>');
            this.$selectDOM.find('.select-content-list').append($(this.el).children().detach());
            $(this.el).addClass('custom-select');
            $(this.el).append(this.$selectDOM);
            $(this.el).find('.select-wrapper').before(this.$title);
            $(this.el).find('.select-content-list').before(this.$mask);
            $(this.el).find('.select-content-list').before(this.$indicator);
        };

        Select.prototype.title = function () {
            return $('<div class="select-title"><div class="select-title-left"></div><div class="select-title-center"></div><div class="select-title-right"></div></div>')
        };

        Select.prototype.mask = function () {
            return $('<div class="select-content-mask"></div>')
        };

        Select.prototype.indicator = function () {
            return $('<div class="select-content-indicator"></div>')
        };

        Select.prototype.pick = function () {

        };

        Select.prototype.onTouchSlide = function (e) {
            e.stopPropagation();
            this.lastSelectOption = this.$list.css('transform').replace(/matrix|\(|\)|\s/g, '').split(',');
            this.touchStart.x = e.changedTouches[0].clientX;
            this.touchStart.y = e.changedTouches[0].clientY;
            this.translateY = parseFloat(this.lastSelectOption[5]);
        };

        Select.prototype.onTouchMove = function (e) {
            var target = e.target || window.srcElement;
            e.stopPropagation();
            if (!$(target).parents().filter('.dropdown').length) {
                e.preventDefault()
            }
            this._translateY = null;
            this.currentTouch.x = e.changedTouches[0].clientX;
            this.currentTouch.y = e.changedTouches[0].clientY;
            this._translateY = this.translateY + parseFloat(this.currentTouch.y) - parseFloat(this.touchStart.y);
            this.$list.css('transform', 'translate3d(0,' + this._translateY + 'px,0)');
        };

        Select.prototype.onTouchEnd = function (e) {
            e.stopPropagation();
            this.rows = Math.ceil((this.currentTouch.y - this.touchStart.y) / 34);
            this.rows = this.translateY > 0 ? 0 : this.rows;
            this.translateY += this.rows * 34;
            this.translateY = this.translateY > 0 ? 0 : this.translateY;  // is ceiling
            this.translateY = Math.abs(this.translateY) > Math.abs(this.$list.height()) ? -this.$list.height() + 34 : this.translateY;  // is floor
            this.$list.css('transform', 'translate3d(0,' + this.translateY + 'px,0)');
        };

        return Select
    });

    (function (global, factory) {
        return global.Project_DateTimeString = factory()
    })(window, function () {
        function Project_DateTimeString(timestamp) {
            this.timestamp = null;
            this.dateTimeString = null;
            this.dateString = null;
            this.timeString = null;
            this.init(timestamp)
        }

        Project_DateTimeString.prototype.init = function (time) {
            this.timestamp = new Date(time);
            this.dateTimeString = this.getYear() + '-' + this.getMonth() + '-' + this.getDate() + ' ' + this.getHour() + ':' + this.getMinute() + ':' + this.getSecond();
            this.dateString = this.getYear() + '-' + this.getMonth() + '-' + this.getDate();
            this.timeString = this.getHour() + ':' + this.getMinute() + ':' + this.getSecond();
            this.monthDateString     = this.getMonth() + '-' + this.getDate();
            this.monthDateTimeString = this.getMonth() + '-' + this.getDate() + ' ' + this.getHour() + ':' + this.getMinute() + ':' + this.getSecond();
        };

        Project_DateTimeString.prototype.getYear = function () {
            return this.timestamp.getFullYear();
        };

        Project_DateTimeString.prototype.getMonth = function () {
            return this.timestamp.getMonth() >= 9 ? this.timestamp.getMonth() + 1 : '0' + (this.timestamp.getMonth() + 1);
        };

        Project_DateTimeString.prototype.getDate = function () {
            return this.timestamp.getDate() >= 10 ? this.timestamp.getDate() : '0' + this.timestamp.getDate();
        };

        Project_DateTimeString.prototype.getHour = function () {
            return this.timestamp.getHours() >= 10 ? this.timestamp.getHours() : '0' + this.timestamp.getHours();
        };

        Project_DateTimeString.prototype.getMinute = function () {
            return this.timestamp.getMinutes() >= 10 ? this.timestamp.getMinutes() : '0' + this.timestamp.getMinutes();
        };

        Project_DateTimeString.prototype.getSecond = function () {
            return this.timestamp.getSeconds() >= 10 ? this.timestamp.getSeconds() : '0' + this.timestamp.getSeconds();
        };

        return Project_DateTimeString
    });

    /* precious */
    (function (factory) {
        return factory()
    })(function () {
        function accAdd(arg1, arg2) {
            var r1, r2, m, c;
            try {
                r1 = arg1.toString().split(".")[1].length;
            }
            catch (e) {
                r1 = 0;
            }
            try {
                r2 = arg2.toString().split(".")[1].length;
            }
            catch (e) {
                r2 = 0;
            }
            c = Math.abs(r1 - r2);
            m = Math.pow(10, Math.max(r1, r2));
            if (c > 0) {
                var cm = Math.pow(10, c);
                if (r1 > r2) {
                    arg1 = Number(arg1.toString().replace(".", ""));
                    arg2 = Number(arg2.toString().replace(".", "")) * cm;
                } else {
                    arg1 = Number(arg1.toString().replace(".", "")) * cm;
                    arg2 = Number(arg2.toString().replace(".", ""));
                }
            } else {
                arg1 = Number(arg1.toString().replace(".", ""));
                arg2 = Number(arg2.toString().replace(".", ""));
            }
            return (arg1 + arg2) / m;
        }

        function accSub(arg1, arg2) {
            var r1, r2, m, n;
            try {
                r1 = arg1.toString().split(".")[1].length;
            }
            catch (e) {
                r1 = 0;
            }
            try {
                r2 = arg2.toString().split(".")[1].length;
            }
            catch (e) {
                r2 = 0;
            }
            m = Math.pow(10, Math.max(r1, r2)); //dynamic precious length
            n = (r1 >= r2) ? r1 : r2;
            return Number(((arg2 * m - arg1 * m) / m).toFixed(n));
        }

        function accMul(arg1, arg2) {
            var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
            try {
                m += s1.split(".")[1].length;
            }
            catch (e) {
            }
            try {
                m += s2.split(".")[1].length;
            }
            catch (e) {
            }
            return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
        }

        function accDiv(arg1, arg2) {
            var t1 = 0, t2 = 0, r1, r2;
            try {
                t1 = arg1.toString().split(".")[1].length;
            }
            catch (e) {
            }
            try {
                t2 = arg2.toString().split(".")[1].length;
            }
            catch (e) {
            }

            r1 = Number(arg1.toString().replace(".", ""));
            r2 = Number(arg2.toString().replace(".", ""));
            return (r1 / r2) * Math.pow(10, t2 - t1);
        }

        function argDetect(arg){
            return arg===undefined?NaN:arg;
        }

        // extends Number - division
        Number.prototype.div = function (arg) {
            arg = argDetect(arg);
            return accDiv(this, arg);
        };

        // extends Number - multiplication
        Number.prototype.mul = function (arg) {
            arg = argDetect(arg);
            return accMul(arg, this);
        };

        // extends Number - subtraction
        Number.prototype.sub = function (arg) {
            arg = argDetect(arg);
            return accSub(arg, this);
        };

        // extends Number - addition
        Number.prototype.add = function (arg) {
            arg = argDetect(arg);
            return accAdd(arg, this);
        };
    });

    new Vue({
        el: '#logInStatus',
        data: {
            isLogin: false,
            nickName: null,
            avatar: null,
        },
        methods: {

        },
        computed: {

        },
        beforeMount: function () {

        }
    });

    window.alert = function (msg) {
        new Modal({
            content: msg,
            cssClass: 'ajax-error'
        })
    };

    window.loginStatus = loginStatus;
    window.Project     = Project;
    window.docCookies  = docCookies;

    return window;
});
