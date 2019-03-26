define(["jquery"],function($){
    function Captcha(params){
        this.el      = null;
        this.offsetX = null;
        this.payload = null;


        this.init(params)
    }

    Captcha.prototype.init = function (params) {
        try {
            this.el = params.el;
        } catch (e) {
            console.log(e)
        }
        this.fetchFromRemote();
    };

    Captcha.prototype.fetchFromRemote = function(){
        var that = this;
        $.ajax({
            type: 'get',
            url: '/api/me/colaUser/getImageCaptcha',
            success: function(res){
                console.log(res);
                that.payload = res.data;
                try {
                    $(that.el).after(createDOM(res.data))
                } catch (e) {
                    console.log(e)
                }
            }
        })
    };

    function createDOM(IMG){
        return (
            '<div class="geetest_fullpage_click geetest_float geetest_wind geetest_slide3" style="left: 969.5px; top: 3905px; display: block; opacity: 1;">' +
            '<div class="geetest_fullpage_ghost"></div>' +
            '<div class="geetest_fullpage_click_wrap">' +
            '<div class="geetest_fullpage_click_box" style="width: 278px; top: -117.5px;">' +
            '   <div class="geetest_holder geetest_mobile geetest_ant geetest_embed" style="width: 100%;">' +
            '       <div class="geetest_wrap">' +
            '           <div class="geetest_widget">' +
            '               <div class="geetest_window" style="padding-bottom: 61.54%;">' +
            '                   <a class="geetest_link">' +
            '                       <div class="geetest_canvas_img geetest_absolute" style="display: block;">' +
            '                           <div class="geetest_slicebg geetest_absolute">' +
            // '                               <canvas class="geetest_canvas_bg geetest_absolute" height="160" width="260"></canvas>' +
            '                               <img src="/api/me/colaImage/'+ IMG.images.deduction +'" class="geetest_canvas_bg geetest_absolute" height="160" width="260">' +
            '                               <img src="/api/me/colaImage/'+ IMG.images.subtract +'" class="geetest_canvas_slice geetest_absolute" width="260" height="160">' +
            // '                               <canvas class="geetest_canvas_slice geetest_absolute" width="260" height="160"></canvas>' +
            '                           </div>' +
            '                           <canvas class="geetest_canvas_fullbg geetest_fade geetest_absolute" height="160" width="260" style="display: none;"></canvas>' +
            '                       </div>' +
            '                       <div class="geetest_div_img geetest_absolute" style="display: none;">' +
            '                           <div class="geetest_slicebg geetest_absolute">' +
            '                               <div class="geetest_div_bg geetest_absolute"></div>' +
            '                               <div class="geetest_div_slice geetest_absolute"></div>' +
            '                           </div>' +
            '                           <div class="geetest_div_fullbg geetest_fade geetest_absolute"></div>' +
            '                       </div>' +
            '                   </a>' +
            '                   <div class="geetest_refresh" href="javascript:;" style="display: block;">' +
            '                       <div class="geetest_refresh_tip"></div>' +
            '                   </div>' +
            '                   <div class="geetest_loading geetest_absolute geetest_fade" style="padding-top: 10%; opacity: 0; display: none;">' +
            '                       <div class="geetest_loading_icon"></div>' +
            '                       <div class="geetest_loading_tip">加载中...</div>' +
            '                   </div>' +
            '                   <div class="geetest_result">' +
            '                       <div class="geetest_result_box" style="padding-top: 10%;">' +
            '                           <div class="geetest_result_icon"></div>' +
            '                           <div class="geetest_result_title"></div>' +
            '                           <div class="geetest_result_content"></div>' +
            '                       </div>' +
            '                   </div>' +
            '               </div>' +
            '           </div>' +
            '           <div class="geetest_slider geetest_ready">' +
            '               <div class="geetest_slider_track">' +
            '                   <div class="geetest_slider_tip geetest_fade">拖动左边滑块完成上方拼图</div>' +
            '               </div>' +
            '               <div class="geetest_slider_button" style="opacity: 1; transform: translate(0px, 0px);"></div>' +
            '           </div>' +
            '       </div>' +
            '       <div class="geetest_panel">' +
            '           <div class="geetest_small">' +
            '               <a class="geetest_close">' +
            '                   <div class="geetest_close_tip">关闭验证</div>' +
            '               </a>' +
            '               <a class="geetest_refresh_1" href="javascript:;">' +
            '                   <div class="geetest_refresh_icon"></div>' +
            '                   <div class="geetest_refresh_tip">刷新验证</div>' +
            '               </a>' +
            '               <a class="geetest_feedback" target="_blank" href="http://www.geetest.com/contact#report">' +
            '                   <div class="geetest_feedback_icon"></div>' +
            '                   <div class="geetest_feedback_tip">帮助反馈</div>' +
            '               </a>' +
            '               <a class="geetest_voice">' +
            '                   <div class="geetest_voice_tip"></div>' +
            '               </a>' +
            '           </div>' +
            '       </div>' +
            '   </div>' +
            '</div>' +
            '<div class="geetest_fullpage_pointer" style="display: block;">' +
            '   <div class="geetest_fullpage_pointer_out"></div>' +
            '   <div class="geetest_fullpage_pointer_in"></div>' +
            '</div>' +
            '</div></div>')
    }

    return Captcha
    // return window.Captcha = Captcha
});
