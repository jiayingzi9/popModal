;(function () {
    var defaults={
        width :'300px',
        height:'auto',//高度可以自定义,默认为自适应
        footerTitle:'关闭',
        title:'标题',
        headerBG:'#f0f0f0',
        footbtnBG:'#5bc0de',
        magnifyWinColor:'2px solid #080606',
        shrinkWinColor:'2px solid #080606',
        popdownOpacity:'#ddd',
        zoomPopdown:'none',
        popdownLoading:'none',
        onloadBg:null,
    };
    var originalWidth = null,originalHeight = null;
    var _function={
        init:function () {
            _function. show_popdown.call(this);
            _function. close_popdown.call(this);
            _function. zoom_out_popdown.call(this);
            _function. vertical_center_popdown.call(this);
            _function. popdown_body_height.call(this);
        },
        //打开
        show_popdown:function (uri, options) {
            if($('#jf-popdown-opacity').length > 0) {
                $('#jf-popdown-opacity').remove();
            }
            opacity = $('<div />').attr('id', 'jf-popdown-opacity').css({
                position: 'absolute',
                top		: 0,
                left	: 0,
                width 	: $(document).outerWidth(true),
                height 	: $(document).outerHeight(true),
                zIndex	: 99998,
                display : 'none'
            });
            container = $('<div class="jf-popdown-loading" />').attr('id', 'jf-popdown-dialog').css({
                zIndex	: 99999,
                margin	: '0 auto',
                position: 'relative',
                display : 'none',
                width:options.width,
                height:options.height,
            });
            $('body').append(opacity);
            $('#jf-popdown-opacity').fadeIn(100).append(container);
            $('#jf-popdown-opacity').append(container).stop().animate({
                opacity: 1.0
            }, 100, function() {
                $('#jf-popdown-dialog').fadeIn(50, function(){
                    $.get(uri, function(resp) {
                        //加载模态框内容
                        $('#jf-popdown-dialog').html(resp).addClass('popdown-done').removeClass('jf-popdown-loading');
                        // 头部
                        $('#jf-popdown-dialog').prepend('<div class="jf-popdown-header jf-drag-popdown">' +
                            '<h2>'+options.title+'<span class="jf-close-popdown">&times;</span><span class="jf-zoom-in-popdown"></span></h2>' +
                            '</div>');
                        // 拉动
                        $('#jf-popdown-dialog').prepend('<div class="jf-zoom-popdown"></div>')
                        //脚部
                        $('#jf-popdown-dialog').append('<div class="jf-popdown-footer"><button class="jf-close-popdown">'+options.footerTitle+'</button></div>');
                        $('.jf-popdown-header').css({
                            'background':options.headerBG,
                        });
                        $('button.jf-close-popdown').css({
                            'background':options.footbtnBG,
                        });
                        $('.jf-zoom-in-popdown').css({
                            'border':options.magnifyWinColor,
                        });
                        $('#jf-popdown-opacity').css({
                            'background':options.popdownOpacity,
                        });
                        $('#jf-zoom-popdown').css({
                            'background':options.zoomPopdown,
                        });
                        $('.jf-popdown-loading').css({
                            'background':options.popdownLoading,
                        })
                        $("html, body").animate({ scrollTop: 0 }, "fast");
                        // 获取弹窗的原始宽高
                        originalWidth = $('#jf-popdown-dialog').width();
                        originalHeight = $('#jf-popdown-dialog').height();
                        _function.vertical_center_popdown(originalHeight);

                    });
                });
            });
        },
        //关闭
        close_popdown:function () {
            if($('#jf-popdown-opacity').length > 0) {
                $('#jf-popdown-dialog').stop().animate({
                    opacity:0,
                    height:0
                }, 200, function(){
                    $('#jf-popdown-opacity').remove();
                });
            }
        },
        //拉动
        zoom_out_popdown:function (options) {
            _function.vertical_center_popdown(options.height);
            $('#jf-popdown-dialog').css({
                width   : options.width,
                height  : options.height,
                marginLeft : 'auto'
            });
            _function.popdown_body_height();
            if (options.width >= $(document).outerWidth()) {
                $('.jf-zoom-in-popdown').addClass("jf-zoom-out-popdown").removeClass("jf-zoom-in-popdown");
                $('.jf-zoom-out-popdown').css({
                    'border':options._options.shrinkWinColor,
                })
            }else {
                $('.jf-zoom-out-popdown').addClass("jf-zoom-in-popdown").removeClass("jf-zoom-out-popdown");
                console.log($('.jf-zoom-out-popdown'));
            }
        },
        vertical_center_popdown:function (objHeight) {
            var marginTopValue = ($(document).outerHeight()-objHeight)/2;
            $('#jf-popdown-dialog').css({
                marginTop :marginTopValue
            });
        },
        //模态框距离顶部高度
        popdown_body_height:function () {
            $(".jf-popdown-body").outerHeight($("#jf-popdown-dialog").height() - $(".jf-popdown-header").outerHeight(true) -  $(".jf-popdown-footer").outerHeight(true) );
        },
    };
    var popdown=function (element,option) {
        this.elements=$.extend({},defaults,element);
        this.options=$.extend({},defaults,option);
        var _options=this.options;
        var _elements=this.elements;
        $(window).resize(function() {
            if($('#jf-popdown-opacity').length > 0) {
                $('#jf-popdown-opacity').css({
                    width : $(document).outerWidth(),
                    height: $(document).outerHeight()
                });
            }
        });
        $(document).on('click', '.jf-close-popdown', function(e){
            if(!$(this).is('.jf-close-popdown'))  {
                e.preventDefault();
            }
            _function.close_popdown();
        });
        $(document).on('click', '.jf-zoom-in-popdown', function(e){
            if(!$(this).is('.jf-zoom-in-popdown'))  {
                e.preventDefault();
            }else {
                _function.zoom_out_popdown({'width':$(document).outerWidth(),'height':$(document).outerHeight(),_options});
            }
        });
        $(document).on('click', '.jf-zoom-out-popdown', function(e){
            if(!$(this).is('.jf-zoom-out-popdown'))  {
                e.preventDefault();
            }else {
                _function.zoom_out_popdown({'width':originalWidth,'height':originalHeight,_options});
            }
        });
        $(document).on('dblclick', '.jf-popdown-header', function(e){
            if(!$(this).is('.jf-popdown-header'))  {
                e.preventDefault();
            }else {
                if ($(this).find(".jf-zoom-in-popdown").length>0){
                    _function.zoom_out_popdown({'width':$(document).outerWidth(),'height':$(document).outerHeight(),_options});
                }else {
                    _function.zoom_out_popdown({'width':originalWidth,'height':originalHeight,_options});
                }
            }
        });
        $(document).on('mousedown', '.jf-zoom-popdown', function(e){
            if(!$(this).is('.jf-zoom-popdown'))  {
                e.preventDefault();
            }else {
                // 模态框
                var obj2 = $("#jf-popdown-dialog");
                //判断鼠标抬起时间
                var drag_is = true;
                //计算body的宽度、高度
                var bodyWidth = $(document).outerWidth();
                var bodyHeight = $(document).outerHeight();
                //计算模态框的宽度、高度
                var modalWidth = obj2.width();
                var modalHeight = obj2.height();

                //计算鼠标点击位置和obj2左上角的距离；
                disX = e.pageX;
                disY = e.pageY;

                $(document).mousemove(function(e) {
                    if (drag_is) {
                        // 计算鼠标按下移动的距离，正数表示是向右下角移动即放大模态框，反之则缩小模态框
                        var obj1MoveY = e.pageY;//鼠标指针向对于浏览器页面（客户区）的垂直坐标
                        var obj1MoveX = e.pageX;
                        var obj1MoveDisY = e.pageY - disY;
                        var obj1MoveDisX = e.pageX - disX;
                        var minHeight = bodyHeight * 0.6;
                        var minWidth = bodyWidth * 0.6;
                        var realWidth = modalWidth + obj1MoveDisY;
                        var realHeight = modalHeight + obj1MoveDisX;

                        if ((realWidth > minWidth && realWidth < bodyWidth ) && (realHeight > minHeight && realHeight < bodyHeight )) {
                            _function.zoom_out_popdown({'width':realWidth,'height':realHeight});
                        } else if (realWidth < minWidth || realHeight < minHeight) {
                            // 鼠标移动缩放极限是将模态框设置成60%
                            _function.zoom_out_popdown({'width':minWidth,'height':minHeight});

                        } else if (obj1MoveX >= bodyWidth || obj1MoveY >= bodyHeight) {
                            // 鼠标移到最边上时模态框显示100%
                            _function.zoom_out_popdown({'width':$(document).outerWidth(),'height':$(document).outerHeight()});
                        }
                    }else {
                        return;
                    }
                });
                $(document).mouseup(function () {
                    drag_is = false;
                    return;
                });
                return false;
            }

        });
        $(document).on('mousedown', '.jf-drag-popdown', function(e){
            if(!$(this).is('.jf-drag-popdown'))  {
                e.preventDefault();
            }else {
                // 模态框
                var obj2 = $("#jf-popdown-dialog")
                //判断鼠标抬起时间
                var drag_is = true;
                //计算body的宽度、高度
                var body_width = $(document).outerWidth();
                var body_height = $(document).outerHeight();
                //计算模态框的宽度、高度
                var modal_width = obj2.width();
                var modal_height = obj2.height();
                //计算body与模态框的宽度差、高度差
                var differ_width = body_width - modal_width;
                var differ_height = body_height - modal_height;

                //计算鼠标点击位置和obj2左上角的距离；
                disX = e.pageX - obj2.offset().left;
                disY = e.pageY - obj2.offset().top;

                $(document).mousemove(function (e) {
                    if (drag_is) {
                        obj2.css({
                            marginLeft :e.pageX - disX,
                            marginTop :e.pageY - disY
                        });
                        if ((e.pageX - disX) < 0) {
                            obj2.css('margin-left', '0px');
                        }
                        if ((e.pageX - disX) > differ_width) {
                            obj2.css('margin-left', differ_width + 'px');
                        }
                        if ((e.pageY - disY) < 0) {
                            obj2.css('margin-top', '0px');
                        }
                        if ((e.pageY - disY) > differ_height) {
                            obj2.css('margin-top', differ_height + 'px');
                        }
                    } else {
                        return;
                    }
                });
                $(document).mouseup(function () {
                    drag_is = false;
                    return;
                });
                return false;
            }

        });
        return this.elements.each(function() {
            var self = $(this);
            self.bind('click', function(e){
                if(self.is('a')) {
                    e.preventDefault();
                }
                if($('#jf-popdown-opacity').is(':visible')) {
                    _function.close_popdown();
                } else {
                    if(self.data('uri')) {
                        _function.show_popdown(self.data('uri'), _options);
                        //添加扩展方法
                        _options.onloadBg&& _options.onloadBg.call(this,e);
                    } else if(self.attr('href')) {
                        _function.show_popdown(self.attr('href'),_options);
                        //添加扩展方法
                        _options.onloadBg&& _options.onloadBg.call(this,e);
                    } else {
                        alert("不能打开模态框");
                    }
                }
            });
        });
        _function.init.call(this);
    };
    popdown.prototype={

    };
    window.JF ? window.JF['popdown']=popdown : window.popdown=popdown;
})();