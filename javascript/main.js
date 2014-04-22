;
(function ($) {

    var default_options = {
        height: 200,
        background: '#000',
        load: '/list',
        itemTemplate: function (itemData) {
            return "<div class='item'></div>";
        },
        beforeRender:function(){},
        afterRender:function(){},
        whenRenderItem:function(){}
    }

    //copy from underscore.js
    var debounce = function (func, wait, immediate) {
        var timeout, args, context, timestamp, result;
        return function () {
            context = this;
            args = arguments;
            timestamp = new Date();
            var later = function () {
                var last = (new Date()) - timestamp;
                if (last < wait) {
                    timeout = setTimeout(later, wait - last);
                } else {
                    timeout = null;
                    if (!immediate) result = func.apply(context, args);
                }
            };
            var callNow = immediate && !timeout;
            if (!timeout) {
                timeout = setTimeout(later, wait);
            }
            if (callNow) result = func.apply(context, args);
            return result;
        };
    };

    $.fn.tabCarousel = function (options) {
        options = $.extend({}, default_options, options);
        options.itemSize = options.itemSize || options.height * 0.618;
        options.itemGutterWidth = options.itemGutterWidth || (options.height - options.itemSize) / 2;

        return this.each(function (i) {
            var id = "tabCarousel-" + i + "-" + Date.now();
            var $container = $(this).addClass('tab-carousel carousel slider')
                .attr('id', id).height(options.height)
                .append("<div class='carousel-inner'></div>");
            var $left = $("<a class='left carousel-control'  >" +
                "<span class='glyphicon glyphicon-chevron-left'></span></a>").appendTo($container);
            var $right = $("<a class='right carousel-control'  >" +
                "<span class='glyphicon glyphicon-chevron-right'></span>" +
                "</a>").appendTo($container);
            var $list = $container.find('.carousel-inner').css('lineHeight', options.height + 'px');

            var itemClickHandle = function () {
                $(this).addClass('active').siblings('.item').removeClass('active').find('.arraw').hide();
                var $arraw = $(this).find('.arraw');
                if (!$arraw.length) {
                    $arraw = $('<div class="arraw"></div>').appendTo($(this));
                    var arrawSize = $arraw.outerHeight();
                    var scale =
                        $arraw.css('top', (options.itemSize + options.height / 1.1) / 2 - arrawSize + 1).show();
                }
                $arraw.show();
            }

            var next = function () {
                var left = +$list.css('left').replace('px', '');
                var itemCount = $list.find('.item').length;
                var delta = -(options.itemSize + options.itemGutterWidth);
                var limit = $container.width() - (options.itemSize + options.itemGutterWidth) * itemCount - options.itemGutterWidth;
                if (left >= limit) {
                    left = (left + delta <= limit) ? limit : (left + delta);
                    $list.animate({left: left},function(){
                        resetGutterAndControls();
                    });
                }
            }

            var prev = function () {
                var left = +$list.css('left').replace('px', '');
                var delta = options.itemSize + options.itemGutterWidth;
                var limit = 0;
                if (left <= limit) {
                    left = (left + delta >= limit) ? limit : (left + delta);
                    $list.animate({left: left},function(){
                        resetGutterAndControls();
                    });
                }

            }

            var resetGutterAndControls = function(){
                $list.find('.item').css('marginRight', 0).last().css('marginRight', options.itemGutterWidth);
                var listWidth = $list.find('.item').length * (options.itemSize+options.itemGutterWidth);
                var containerWidth = $container.width();
                var left = ~~+$list.css('left').replace('px', '');
                if( left < 0 ) { $left.show() }else{ $left.hide() }
                if( listWidth > containerWidth && left >= containerWidth - listWidth ){ $right.show() }else{ $right.hide() }
            }

            $container.on('click', '.item', debounce(itemClickHandle, 300, true))
                .on('click', '.right', debounce(next, 300, true))
                .on('click', '.left', debounce(prev, 300, true));

            var makeItem = function (itemData,position) {
                var $item = $(options.itemTemplate(itemData));
                $item.addClass('item').height(options.itemSize)
                    .width(options.itemSize).css('marginLeft', options.itemGutterWidth);
                if(position===undefined || position===null){
                    $item = $item.appendTo($list);
                }else if(position===-1 ){
                    $item = $item.prependTo($list);
                }else{
                    $item = $item.insertAfter($list.find('.item').eq( +position ));
                }
                options.whenRenderItem($item,itemData,$list);
                return $item ;
            }

            var getItems = function (callback) {
                if (typeof options.load === 'function') {
                    return options.load.call(this, options, callback);
                }
                $.getJSON(options.load, function (data) {
                    callback(data);
                })
            }

            var render = function (data) {
                options.beforeRender(data);
                if (data.list && data.list.length) {
                    for (var i = 0; i < data.list.length; i++) {
                        makeItem(data.list[i]);
                    }
                }
                resetGutterAndControls();
                options.afterRender(data);
            }

            $container.data('api',{
                next: next,
                prev: prev,
                render: render,
                append: function(data,position){
                    var $item = makeItem(data,position);
                    itemClickHandle.call($item);
                    resetGutterAndControls();
                    return $item;
                },
                remove: function($el){
                    $el = typeof($el)==='number'? $list.index($el): $list.find($el);
                    $el.remove();
                    resetGutterAndControls();
                }
            });

            getItems(render);
        })
    }

})(jQuery)