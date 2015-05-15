(function($){
    var Tips = function(element, options) {
        this.el = element;

        options.viewport = $.extend({}, {
            selector: 'body',
            padding: 0
        }, options.viewport);
        options.content = options.content || element.attr('title');
        options.placement = options.placement || element.data('placement');

        this.options = options;
        this.timer = new BFA.Timer();
        this.template = options.template || '<div class="popover" role="tooltip"><div class="arrow"></div><div class="inner"><#=content#></div></div>';

        this.init();
    }

    Tips.prototype.init = function(){
        this.viewport = this.options.viewport && $(this.options.viewport.selector || this.options.viewport);

        // 是否只显示一个开关
        if(this.options.singleton){
            $('[role="tooltip"]').remove();
        }

        this.create();
    }

    Tips.prototype.create = function(){
        var template = NT.tpl(this.template, this.options);
        this.tip = $(template);
        $('body').append(this.tip);
    }

    Tips.prototype.show = function(){
        if(this.isShow)
            return;

        this.tip.show();

        var actualWidth  = this.tip[0].offsetWidth;
        var actualHeight = this.tip[0].offsetHeight;

        var placement = this.options.placement || 'top';

        var pos = this.getPosition();
        var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight);

        this.tip.addClass(placement).css(calculatedOffset);
        this.isShow = true;
    }

    Tips.prototype.hide = function(){
        this.tip.removeClass('in');
        this.isShow = false;
    }

    Tips.prototype.getCalculatedOffset = function(placement, pos, actualWidth, actualHeight){
        return placement == 'bottom' ? {
            top: pos.top + pos.height,
            left: pos.left + pos.width / 2 - actualWidth / 2
        } : placement == 'top' ? {
            top: pos.top - actualHeight,
            left: pos.left + pos.width / 2 - actualWidth / 2
        } : placement == 'left' ? {
            top: pos.top + pos.height / 2 - actualHeight / 2,
            left: pos.left - actualWidth
        } : {
            top: pos.top + pos.height / 2 - actualHeight / 2,
            left: pos.left + pos.width
        }
    }

    Tips.prototype.getPosition = function(el){
        el = el || this.el;
        var element = el[0];
        var isBody = element.tagName.toLocaleLowerCase() == 'body';

        var elRect = element.getBoundingClientRect();

        if(elRect.width == null){
            elRect = $.extend({}, elRect, {
                width: elRect.right - elRect.left,
                height: elRect.bottom - elRect.top
            });
        }

        var elOffset = isBody ? {
            top: 0,
            left: 0
        } : el.offset();

        var scroll = {
            scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : el.scrollTop()
        }

        var outerDims = isBody ? {
            width: $(window).width(),
            height: $(window).height()
        } : null;

        return $.extend({}, elRect, scroll, outerDims, elOffset);
    }


    $.fn.tips = function(option){
        el = $(this);
        var options = option || {};

        return new Tips(el, options);
    }

})(jQuery);
