define(["jquery","vue"],function($){
  function Animation(params){
    this.el      = null;
    this.offsetX = null;
    this.offsetY = null;
    this.defaultRevolution = null;
  }

  Animation.prototype.init = function (params,callback) {
    try {
      for(var i in params){
        this[i] = params[i]
      }
      try {
        this.offsetY = $(this.el).offset().top;
        this.offsetX = $(this.el).offset().left;
        this.borderLeftWidth = $(this.el).css('borderLeftWidth').replace('px', '');
        this.borderTopWidth = $(this.el).css('borderTopWidth').replace('px', '');
      } catch (e) {
        console.log(e)
      }
    } catch (e) {
      console.log(e)
    } finally {
      if(!!callback) callback()
    }
  };

  Animation.prototype.getPos = function(event) {
    var x, y;

    if ( event.touches && event.touches.length > 0 ) {
      // iOS/android
      x = event.touches[0].pageX - $(this.el).offset().left + this.borderLeftWidth;
      y = event.touches[0].pageY - $(this.el).offset().top + this.borderTopWidth;
    } else if ( event.offsetX ) {
      // Chrome/Safari
      x = event.offsetX - this.borderLeftWidth;
      y = event.offsetY - this.borderTopWidth;
    } else {
      // Firefox
      x = event.pageX - $(this.el).offset().left - this.borderLeftWidth;
      y = event.pageY - $(this.el).offset().top - this.borderTopWidth;
    }
    return [x,y];
  };

  Animation.prototype.getScrollTop = function (){
    var scrollTop=0;
    if(document.documentElement&&document.documentElement.scrollTop){
      scrollTop=document.documentElement.scrollTop;
    }else if(document.body){
      scrollTop=document.body.scrollTop;
    }
    return scrollTop;
  };

  Animation.prototype.animationClass = function(){
    var className = '';

    try {
      className = 'animation-' + this.type.toLowerCase() + this.direction
    } catch (e) {
      className = 'animation-' + this.type.toLowerCase()
    }

    if(this.additionalMethod!==undefined){
      className += ' ' + this.additionalMethod;
    }

    return className
  };

  function Rotate(params){
    Animation.call(this);

    this.init(params,$.proxy(this.bindEvent,this));
    this.type = 'Rotate';
  }

  (function(){
    var Super = function(){};
    Super.prototype = Animation.prototype;
    Rotate.prototype = new Super();
  })();

  Rotate.prototype.constructor = Rotate;  // find back constructor

  Rotate.prototype.bindEvent = function(){
    // Bind events to element:
    $(this.el).on('mousedown',$.proxy(this.touchStartEvent,this))
      .on('mousemove',$.proxy(this.touchMoveEvent,this))
      .on('mouseup',$.proxy(this.touchEndEvent,this));

    // Mobile touch events:
    this.el.addEventListener('touchstart', $.proxy(this.touchStartEvent,this), false);
    this.el.addEventListener('touchmove', $.proxy(this.touchMoveEvent,this), false);
    this.el.addEventListener('touchend', $.proxy(this.touchEndEvent,this), false);
  };

  Rotate.prototype.touchStartEvent = function(event) {
    // event.preventDefault();

    var pos = this.getPos(event),
      x = pos[0],
      y = pos[1];

    console.log(this);

    // return false;
  };

  Rotate.prototype.touchMoveEvent = function(event) {
    // event.preventDefault();

    var pos = this.getPos(event),
      x = pos[0],
      y = pos[1];

    console.log(pos);

    // return false;
  };

  Rotate.prototype.touchEndEvent = function(event) {
    // return false;
  };

  function FadeIn(params){
    this.type = 'FadeIn';
    Animation.call(this);
    this.init(params,$.proxy(this.bindEvent,this));
  }

  (function(){
    var Super = function(){};
    Super.prototype = Animation.prototype;
    FadeIn.prototype = new Super();
  })();

  FadeIn.prototype.constructor = FadeIn;

  FadeIn.prototype.bindEvent = function(){
    var onLoadedHeight = this.detectFirstView();
    if ( !onLoadedHeight ) {
      // Bind events to element:
      $(window).on('scroll', $.proxy(this.scroll,this));

      // Mobile touch events:
      window.addEventListener('touchstart', $.proxy(this.touchStartEvent,this), false);
      window.addEventListener('touchmove', $.proxy(this.touchMoveEvent,this), false);
      window.addEventListener('touchend', $.proxy(this.touchEndEvent,this), false);

      this.listenerStatus = 'on';
    }
  };

  FadeIn.prototype.unbindEvent = function(){
    // remove listener
    $(window).off('scroll', $.proxy(this.scroll,this));

    // remove Mobile listener
    // window.removeEventListener('scroll',$.proxy(this.scroll,this), false);
  };

  FadeIn.prototype.detectFirstView = function(){
    var that = this;
    if( this.offsetY-window.innerHeight+100 <= this.getScrollTop() ){
      this.delay===undefined?$(this.el).addClass(this.animationClass()):setTimeout(function(){
        $(that.el).addClass(that.animationClass())
      },parseFloat(this.delay)+(window.window.animationDelayCount++ * this.defaultRevolution));
      return true
    }
    return false
  };

  FadeIn.prototype.scroll = function(event){
    var that = this;
    if( this.offsetY-window.innerHeight+100 <= this.getScrollTop() ){
      this.delay===undefined?$(this.el).addClass(this.animationClass()):setTimeout(function(){
        $(that.el).addClass(that.animationClass())
      },parseFloat(this.delay)+(window.window.animationDelayCount++ * this.defaultRevolution));
    }
  };

  FadeIn.prototype.touchStartEvent = function(event) {
    // event.preventDefault();
    // return false;
  };

  FadeIn.prototype.touchMoveEvent = function(event) {
    // event.preventDefault();
    var that = this;

    if( this.listenerStatus === 'on' && this.offsetY-window.innerHeight+100 <= this.getScrollTop() ){
      this.delay===undefined?$(this.el).addClass(this.animationClass()):setTimeout(function(){
        $(that.el).addClass(that.animationClass());
      },parseFloat(this.delay)+(window.window.animationDelayCount++ * this.defaultRevolution));
    }

    // return false;
  };

  FadeIn.prototype.touchEndEvent = function(event) {
    var that = this;

    if( this.listenerStatus === 'on' && this.offsetY-window.innerHeight+100 <= this.getScrollTop() ){
      this.delay===undefined?$(this.el).addClass(this.animationClass()):setTimeout(function(){
        $(that.el).addClass(that.animationClass())
      },parseFloat(this.delay)+(window.window.animationDelayCount++ * this.defaultRevolution));
      this.listenerStatus = 'off';
    }

    // return false;
  };

  var Project_Animation = {
    Rotate: function(params){
      return new Rotate(params)
    },
    FadeIn: function(params){
      return new FadeIn(params)
    }
  };

  return window.Project_Animation = Project_Animation;
});
