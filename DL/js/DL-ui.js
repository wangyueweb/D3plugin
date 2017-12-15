/**
 *  Created by phy on 2017/12/14.
 *  此 DL-ui.js 作为整个前端简单 ui 控制存在
 *  document.ready 内是页面简单动态样式的控制
 *  而整个项目前端通用控件也封装在此文件内,采用 jquery 插件模式
 */

$(document).ready(function () {
    /**
     * 重新计算遮罩div和移动弹窗到页面中心
     */
    if(window.onresize === null){
        window.onresize = function(){
            var $mask = $('div.zy-msg-mask');
            if($mask.length){
                // 容器高宽
                var w_d = $(document).width(),
                    h_d = $(document).height(),
                    w_w = $(window).width(),
                    h_w = $(window).height();
                // 遮罩
                $mask.height(h_d).width(w_d);

                var $action = $('div.zy-action-box');
                var pos_l, pos_t;
                if($action.length){
                    var w_a = $action.width();
                    var h_a = $action.height();
                    pos_l = w_w / 2 - w_a / 2;
                    pos_t = h_w / 2 - h_a / 2;
                    $action.stop().animate({
                        left: pos_l,
                        top: pos_t
                    },'fast',function(){
                        $action.data('left',pos_l).data('top',pos_t);
                    });
                }
            }
        }
    }
});

/**
 * EXPT 通用导出弹出框
 * 调用形式: JQ.EXPT()
 * 基本功能: 导出 excel,doc,pdf前
 * 传输名字
 * 注意：拷贝至WIND 扩展了表单提交功能
 */
;(function ($) {
    function E(options) {
        this.name = '';
        this.defaults = {
            width: 550,
            height: 290,
            title: '导出',                              // 标题
            actionBox: 'div.zy-export-box',             // 外盒子
            closeBtn: 'i.zy-action-close',              // 关闭按钮
            closeBtnAct: '',                            // 关闭函数
            yesBtn: 'button.export-button-yes',         // 确认按钮
            noBtn: 'button.export-button-no',           // 取消按钮
            yesBtnAct: '',                      // 确认函数
            noBtnAct: '',                       // 取消函数
            yesBtnTxt: '<i class="zy-setsave-icon"></i>确认',                  // 确认按钮文本
            noBtnTxt: '取消',                   // 取消按钮文本
            resetForm: '',                      // 需要重置的表单-JQ对象
            param: '',                          // 表单参数
            server: '/',                        // 导出api
            name: '',                           // 导出标题
            type: 'name',                       // 文件内标题 title or name
            drag: true,                         // 是否启用拖拽
            doc: false,                         // 导出pdf或doc(false表示只导出pdf,true两者都可导出)
            pdfDoc: 'pdf'                       // 表明用户选择的是pdf或doc

        };
        this.settings = $.extend({}, this.defaults, options);
    }

    E.prototype = {
        mask: function () {
            var w_h = $(window).height();
            var w_w = $(window).width();
            var $mask = $('<div class="zy-msg-mask active"></div>');
            $mask.css({
                'height': w_h,
                'width': w_w
            });
            if ($(document.body).find('div.zy-msg-mask').length === 0) {
                $(document.body).append($mask);
                $mask.fadeIn('fast');
            }
            return this;
        },
        clear: function () {
            $(document.body).find('div.zy-msg-mask').remove();
            $(document.body).find('div.zy-action-box').hide();
            return this;
        },
        init: function () {

            var self = this;

            // width - height
            var w_h = ($(window).height()) / 2 - (self.settings.height / 2);
            var w_w = ($(window).width()) / 2 - (self.settings.width / 2);

            // action - box
            var $action_box;
            if (self.settings.actionBox) {
                $action_box = $(self.settings.actionBox);
                $action_box.css({
                    'width': self.settings.width,
                    'height': self.settings.height,
                    'left': w_w,
                    'top': w_h
                }).data('left', w_w).data('top', w_h);
            }

            // pdf or doc
            var $pdf_doc = $action_box.find('div.zy-pdf-doc-line');
            if(self.settings.doc){
                $pdf_doc.removeClass('hidden');
                var $radio = $pdf_doc.find('i.zy-radio-icon');
                if($radio.length){
                    $radio.removeClass('active');
                    $radio.eq(0).addClass('active');
                    $radio.on('change',function(){
                        var $this = $(this);
                        var type = $this.attr('data-type');
                        if(type){
                            self.settings.pdfDoc = type;
                        }
                    });
                }
            }

            // input
            var $input_name = $action_box.find('input[name="export_name"]');
            if ($input_name.length > 0 && self.settings.name) {
                $input_name.val(self.settings.name);
            }

            // iframe
            var $iframe = $action_box.find('iframe[name="export_iframe"]');
            if ($iframe.length) {
                $iframe.get(0).onload = function () {
                    try {
                        var content = this.contentWindow.document.body.innerHTML;
                        if (content) {
                            content = $.parseJSON(content);
                            if (!content.bool) {
                                if (content.message === 'sessionStatusFalse') {
                                    $(this).MSG({
                                        type: 'error',
                                        content: content.result,
                                        yesBtnAct: DyyBase.goLogin,
                                        closeBtnAct: DyyBase.goLogin
                                    });
                                } else {
                                    $(this).MSG({
                                        type: 'error',
                                        content: content.result
                                    });
                                }
                            }
                        }
                    } catch (e) {
                        $(this).MSG({
                            type: 'error',
                            content: e.message
                        });
                    }
                };
            }

            // form
            var $form = $action_box.find('form[name="export_form"]');
            if ($form.length > 0) {
                var action = self.settings.server + '?AjaxMode=true&random=' + (Math.random()).toString();
                $form.empty().attr('action', action);

                var param = self.settings.param;
                if (param) {
                    if (param instanceof Function) {
                        param = param();
                    }
                }

                for (var k in param) {
                    var $hidden = $('<input type="hidden">');
                    $hidden.prop('name', k).val(param[k]);
                    $form.append($hidden);
                }
            }

            // drag ------------------------------------------------------ start
            if (self.settings.drag) {
                var $title_bar = $action_box.find('div.zy-action-title');

                function getCss(tag, pos) {
                    return parseInt((tag.css(pos)).replace('px', ''));
                }

                $title_bar.off('mousedown').on('mousedown', function (event) {
                    $action_box.data('drag', true).data('x', event.clientX).data('y', event.clientY);
                });
                $(document).off('mousemove').on('mousemove', function (event) {
                    var drag = $action_box.data('drag');
                    if (drag) {
                        var x = event.clientX - $action_box.data('x');
                        var y = event.clientY - $action_box.data('y');
                        var dis_x = $action_box.data('left') + x;
                        var dis_y = $action_box.data('top') + y;
                        $action_box.css({
                            'left': dis_x,
                            'top': dis_y
                        });
                    }
                });
                $(document).off('mouseup').on('mouseup', function () {
                    $action_box.data('left', getCss($action_box, 'left'));
                    $action_box.data('top', getCss($action_box, 'top'));
                    $action_box.data('drag', false);
                });
            }
            // drag ------------------------------------------------------ end

            // title
            var $title_span = $action_box.find('span.zy-action-span');
            if (self.settings.title) {
                $title_span.text(self.settings.title);
            }

            // closeBtn
            if (self.settings.closeBtn) {
                self.settings.closeBtn = $(self.settings.closeBtn);
                self.settings.closeBtn.off('click').click(function () {
                    if (self.settings.closeBtnAct instanceof Function) {
                        self.clear();
                        self.settings.closeBtnAct();
                    } else {
                        if (self.settings.resetForm) {
                            self.clear();
                            self.settings.resetForm.reset();
                        } else {
                            self.clear();
                        }
                    }
                });
            }

            // yesBtn
            if (self.settings.yesBtn) {
                self.settings.yesBtn = $(self.settings.yesBtn);
                self.settings.yesBtn.html(self.settings.yesBtnTxt).off('click').click(function () {
                    var mode = true;
                    var val = $.trim($input_name.val());
                    if (val !== undefined && val !== null && val !== '') {
                        if (val.length > 50) {
                            $input_name.TIP({
                                content: '导出名称不能超过50个字符!',
                                scroll: false,
                                mode: 'position'
                            });
                            mode = false;
                        }
                    } else {
                        $input_name.TIP({
                            content: '导出名称不能为空!',
                            scroll: false,
                            mode: 'position'
                        });
                        mode = false;
                    }
                    if (mode) {
                        if (self.settings.yesBtnAct instanceof Function) {
                            self.name = val;
                            self.settings.yesBtnAct(self.clear, self.name, self.settings.pdfDoc, self.settings.server[self.settings.pdfDoc]);
                        } else {
                            self.clear();
                            var $name = $('<input type="hidden">');
                            if (self.settings.type === 'title') {
                                $name.prop('name', 'fileTitle').val(val);
                            } else if (self.settings.type === 'name') {
                                $name.prop('name', 'fileName').val(val);
                            }
                            $form.append($name).submit();
                        }
                    }
                });
            }

            // noBtn
            if (self.settings.noBtn) {
                self.settings.noBtn = $(self.settings.noBtn);
                self.settings.noBtn.html(self.settings.noBtnTxt).off('click').click(function () {
                    if (self.settings.noBtnAct instanceof Function) {
                        self.settings.noBtnAct(self.clear);
                    } else {
                        if (self.settings.resetForm) {
                            self.clear();
                            self.settings.resetForm.reset();
                        } else {
                            self.clear();
                        }
                    }
                });
            }

            $action_box.show();
            self.mask();
            return self;
        }
    };
    $.fn.EXPT = function (options) {
        var expt = new E(options);
        return expt.init();
    }
})(jQuery);
