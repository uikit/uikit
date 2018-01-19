/*! UIkit 2.27.5 | http://www.getuikit.com | (c) 2014 YOOtheme | MIT License */
(function(addon) {

    var component;

    if (window.UIkit2) {
        component = addon(UIkit2);
    }

    if (typeof define == 'function' && define.amd) { // AMD
        define('uikit-lightbox', ['uikit'], function(){
            return component || addon(UIkit2);
        });
    }

})(function(UI){

    "use strict";

    var modal, cache = {};

    UI.component('lightbox', {

        defaults: {
            allowfullscreen : true,
            duration        : 400,
            group           : false,
            keyboard        : true
        },

        index : 0,
        items : false,

        boot: function() {

            UI.$html.on('click', '[data-uk-lightbox]', function(e){

                e.preventDefault();

                var link = UI.$(this);

                if (!link.data('lightbox')) {

                    UI.lightbox(link, UI.Utils.options(link.attr('data-uk-lightbox')));
                }

                link.data('lightbox').show(link);
            });

            // keyboard navigation
            UI.$doc.on('keyup', function(e) {

                if (modal && modal.is(':visible') && modal.lightbox.options.keyboard) {

                    e.preventDefault();

                    switch(e.keyCode) {
                        case 37:
                            modal.lightbox.previous();
                            break;
                        case 39:
                            modal.lightbox.next();
                            break;
                    }
                }
            });
        },

        init: function() {

            var siblings = [];

            this.index    = 0;
            this.siblings = [];

            if (this.element && this.element.length) {

                var domSiblings  = this.options.group ? UI.$('[data-uk-lightbox*="'+this.options.group+'"]') : this.element;

                domSiblings.each(function() {

                    var ele = UI.$(this);

                    siblings.push({
                        source : ele.attr('href'),
                        title  : ele.attr('data-title') || ele.attr('title'),
                        type   : ele.attr("data-lightbox-type") || 'auto',
                        link   : ele
                    });
                });

                this.index    = domSiblings.index(this.element);
                this.siblings = siblings;

            } else if (this.options.group && this.options.group.length) {
                this.siblings = this.options.group;
            }

            this.trigger('lightbox-init', [this]);
        },

        show: function(index) {

            this.modal = getModal(this);

            // stop previous animation
            this.modal.dialog.stop();
            this.modal.content.stop();

            var $this = this, promise = UI.$.Deferred(), data, item;

            index = index || 0;

            // index is a jQuery object or DOM element
            if (typeof(index) == 'object') {

                this.siblings.forEach(function(s, idx){

                    if (index[0] === s.link[0]) {
                        index = idx;
                    }
                });
            }

            // fix index if needed
            if ( index < 0 ) {
                index = this.siblings.length - index;
            } else if (!this.siblings[index]) {
                index = 0;
            }

            item   = this.siblings[index];

            data = {
                lightbox : $this,
                source   : item.source,
                type     : item.type,
                index    : index,
                promise  : promise,
                title    : item.title,
                item     : item,
                meta     : {
                    content : '',
                    width   : null,
                    height  : null
                }
            };

            this.index = index;

            this.modal.content.empty();

            if (!this.modal.is(':visible')) {
                this.modal.content.css({width:'', height:''}).empty();
                this.modal.modal.show();
            }

            this.modal.loader.removeClass('uk-hidden');

            promise.promise().done(function() {

                $this.data = data;
                $this.fitSize(data);

            }).fail(function(){

                data.meta.content = '<div class="uk-position-cover uk-flex uk-flex-middle uk-flex-center"><strong>Loading resource failed!</strong></div>';
                data.meta.width   = 400;
                data.meta.height  = 300;

                $this.data = data;
                $this.fitSize(data);
            });

            $this.trigger('showitem.uk.lightbox', [data]);
        },

        fitSize: function() {

            var $this    = this,
                data     = this.data,
                pad      = this.modal.dialog.outerWidth() - this.modal.dialog.width(),
                dpadTop  = parseInt(this.modal.dialog.css('margin-top'), 10),
                dpadBot  = parseInt(this.modal.dialog.css('margin-bottom'), 10),
                dpad     = dpadTop + dpadBot,
                content  = data.meta.content,
                duration = $this.options.duration;

            if (this.siblings.length > 1) {

                content = [
                    content,
                    '<a href="#" class="uk-slidenav uk-slidenav-contrast uk-slidenav-previous uk-hidden-touch" data-lightbox-previous></a>',
                    '<a href="#" class="uk-slidenav uk-slidenav-contrast uk-slidenav-next uk-hidden-touch" data-lightbox-next></a>'
                ].join('');
            }

            // calculate width
            var tmp = UI.$('<div>&nbsp;</div>').css({
                opacity   : 0,
                position  : 'absolute',
                top       : 0,
                left      : 0,
                width     : '100%',
                maxWidth  : $this.modal.dialog.css('max-width'),
                padding   : $this.modal.dialog.css('padding'),
                margin    : $this.modal.dialog.css('margin')
            }), maxwidth, maxheight, w = data.meta.width, h = data.meta.height;

            tmp.appendTo('body').width();

            maxwidth  = tmp.width();
            maxheight = window.innerHeight - dpad;

            tmp.remove();

            this.modal.dialog.find('.uk-modal-caption').remove();

            if (data.title) {
                this.modal.dialog.append('<div class="uk-modal-caption">'+data.title+'</div>');
                maxheight -= this.modal.dialog.find('.uk-modal-caption').outerHeight();
            }

            if (maxwidth < data.meta.width) {

                h = Math.floor( h * (maxwidth / w) );
                w = maxwidth;
            }

            if (maxheight < h) {

                h = Math.floor(maxheight);
                w = Math.ceil(data.meta.width * (maxheight/data.meta.height));
            }

            this.modal.content.css('opacity', 0).width(w).html(content);

            if (data.type == 'iframe') {
                this.modal.content.find('iframe:first').height(h);
            }

            var dh   = h + pad,
                t    = Math.floor(window.innerHeight/2 - dh/2) - dpad;

            if (t < 0) { t = 0; }

            this.modal.closer.addClass('uk-hidden');

            if ($this.modal.data('mwidth') == w &&  $this.modal.data('mheight') == h) {
                duration = 0;
            }

            this.modal.dialog.animate({width: w + pad, height: h + pad, top: t }, duration, 'swing', function() {
                $this.modal.loader.addClass('uk-hidden');
                $this.modal.content.css({width:''}).animate({opacity: 1}, function() {
                    $this.modal.closer.removeClass('uk-hidden');
                });

                $this.modal.data({mwidth: w, mheight: h});
            });
        },

        next: function() {
            this.show(this.siblings[(this.index+1)] ? (this.index+1) : 0);
        },

        previous: function() {
            this.show(this.siblings[(this.index-1)] ? (this.index-1) : this.siblings.length-1);
        }
    });


    // Plugins

    UI.plugin('lightbox', 'image', {

        init: function(lightbox) {

            lightbox.on('showitem.uk.lightbox', function(e, data){

                if (data.type == 'image' || data.source && data.source.match(/\.(jpg|jpeg|png|gif|svg)$/i)) {

                    var resolve = function(source, width, height) {

                        data.meta = {
                            content : '<img class="uk-responsive-width" width="'+width+'" height="'+height+'" src ="'+source+'">',
                            width   : width,
                            height  : height
                        };

                        data.type = 'image';

                        data.promise.resolve();
                    };

                    if (!cache[data.source]) {

                        var img = new Image();

                        img.onerror = function(){
                            data.promise.reject('Loading image failed');
                        };

                        img.onload = function(){
                            cache[data.source] = {width: img.width, height: img.height};
                            resolve(data.source, cache[data.source].width, cache[data.source].height);
                        };

                        img.src = data.source;

                    } else {
                        resolve(data.source, cache[data.source].width, cache[data.source].height);
                    }
                }
            });
        }
    });

    UI.plugin('lightbox', 'youtube', {

        init: function(lightbox) {

            var youtubeRegExp = /(\/\/.*?youtube\.[a-z]+)\/watch\?v=([^&]+)&?(.*)/,
                youtubeRegExpShort = /youtu\.be\/(.*)/;


            lightbox.on('showitem.uk.lightbox', function(e, data){

                var id, matches, resolve = function(id, width, height) {

                    data.meta = {
                        content: '<iframe src="//www.youtube.com/embed/'+id+'" width="'+width+'" height="'+height+'" style="max-width:100%;"'+(modal.lightbox.options.allowfullscreen?' allowfullscreen':'')+'></iframe>',
                        width: width,
                        height: height
                    };

                    data.type = 'iframe';

                    data.promise.resolve();
                };

                if (matches = data.source.match(youtubeRegExp)) {
                    id = matches[2];
                }

                if (matches = data.source.match(youtubeRegExpShort)) {
                    id = matches[1];
                }

                if (id) {

                    if(!cache[id]) {

                        var img = new Image(), lowres = false;

                        img.onerror = function(){
                            cache[id] = {width:640, height:320};
                            resolve(id, cache[id].width, cache[id].height);
                        };

                        img.onload = function(){
                            //youtube default 404 thumb, fall back to lowres
                            if (img.width == 120 && img.height == 90) {
                                if (!lowres) {
                                    lowres = true;
                                    img.src = '//img.youtube.com/vi/' + id + '/0.jpg';
                                } else {
                                    cache[id] = {width: 640, height: 320};
                                    resolve(id, cache[id].width, cache[id].height);
                                }
                            } else {
                                cache[id] = {width: img.width, height: img.height};
                                resolve(id, img.width, img.height);
                            }
                        };

                        img.src = '//img.youtube.com/vi/'+id+'/maxresdefault.jpg';

                    } else {
                        resolve(id, cache[id].width, cache[id].height);
                    }

                    e.stopImmediatePropagation();
                }
            });
        }
    });


    UI.plugin('lightbox', 'vimeo', {

        init: function(lightbox) {

            var regex = /(\/\/.*?)vimeo\.[a-z]+\/([0-9]+).*?/, matches;


            lightbox.on('showitem.uk.lightbox', function(e, data){

                var id, resolve = function(id, width, height) {

                    data.meta = {
                        content: '<iframe src="//player.vimeo.com/video/'+id+'" width="'+width+'" height="'+height+'" style="width:100%;box-sizing:border-box;"'+(modal.lightbox.options.allowfullscreen?' allowfullscreen':'')+'></iframe>',
                        width: width,
                        height: height
                    };

                    data.type = 'iframe';

                    data.promise.resolve();
                };

                if (matches = data.source.match(regex)) {

                    id = matches[2];

                    if(!cache[id]) {

                        UI.$.ajax({
                            type     : 'GET',
                            url      : '//vimeo.com/api/oembed.json?url=' + encodeURI(data.source),
                            jsonp    : 'callback',
                            dataType : 'jsonp',
                            success  : function(data) {
                                cache[id] = {width:data.width, height:data.height};
                                resolve(id, cache[id].width, cache[id].height);
                            }
                        });

                    } else {
                        resolve(id, cache[id].width, cache[id].height);
                    }

                    e.stopImmediatePropagation();
                }
            });
        }
    });

    UI.plugin('lightbox', 'video', {

        init: function(lightbox) {

            lightbox.on('showitem.uk.lightbox', function(e, data){


                var resolve = function(source, width, height) {

                    data.meta = {
                        content: '<video class="uk-responsive-width" src="'+source+'" width="'+width+'" height="'+height+'" controls></video>',
                        width: width,
                        height: height
                    };

                    data.type = 'video';

                    data.promise.resolve();
                };

                if (data.type == 'video' || data.source.match(/\.(mp4|webm|ogv)$/i)) {

                    if (!cache[data.source]) {

                        var vid = UI.$('<video style="position:fixed;visibility:hidden;top:-10000px;"></video>').attr('src', data.source).appendTo('body');

                        var idle = setInterval(function() {

                            if (vid[0].videoWidth) {
                                clearInterval(idle);
                                cache[data.source] = {width: vid[0].videoWidth, height: vid[0].videoHeight};
                                resolve(data.source, cache[data.source].width, cache[data.source].height);
                                vid.remove();
                            }

                        }, 20);

                    } else {
                        resolve(data.source, cache[data.source].width, cache[data.source].height);
                    }
                }
            });
        }
    });


    UI.plugin('lightbox', 'iframe', {

        init: function (lightbox) {

            lightbox.on('showitem.uk.lightbox', function (e, data) {

                var resolve = function (source, width, height) {

                    data.meta = {
                        content: '<iframe class="uk-responsive-width" src="' + source + '" width="' + width + '" height="' + height + '"'+(modal.lightbox.options.allowfullscreen?' allowfullscreen':'')+'></iframe>',
                        width: width,
                        height: height
                    };

                    data.type = 'iframe';

                    data.promise.resolve();
                };

                if (data.type === 'iframe' || data.source.match(/\.(html|php)$/)) {
                    resolve(data.source, (lightbox.options.width || 800), (lightbox.options.height || 600));
                }
            });

        }
    });

    function getModal(lightbox) {

        if (modal) {
            modal.lightbox = lightbox;
            return modal;
        }

        // init lightbox container
        modal = UI.$([
            '<div class="uk-modal">',
                '<div class="uk-modal-dialog uk-modal-dialog-lightbox uk-slidenav-position" style="margin-left:auto;margin-right:auto;width:200px;height:200px;top:'+Math.abs(window.innerHeight/2 - 200)+'px;">',
                    '<a href="#" class="uk-modal-close uk-close uk-close-alt"></a>',
                    '<div class="uk-lightbox-content"></div>',
                    '<div class="uk-modal-spinner uk-hidden"></div>',
                '</div>',
            '</div>'
        ].join('')).appendTo('body');

        modal.dialog  = modal.find('.uk-modal-dialog:first');
        modal.content = modal.find('.uk-lightbox-content:first');
        modal.loader  = modal.find('.uk-modal-spinner:first');
        modal.closer  = modal.find('.uk-close.uk-close-alt');
        modal.modal   = UI.modal(modal, {modal:false});

        // next / previous
        modal.on('swipeRight swipeLeft', function(e) {
            modal.lightbox[e.type=='swipeLeft' ? 'next':'previous']();
        }).on('click', '[data-lightbox-previous], [data-lightbox-next]', function(e){
            e.preventDefault();
            modal.lightbox[UI.$(this).is('[data-lightbox-next]') ? 'next':'previous']();
        });

        // destroy content on modal hide
        modal.on('hide.uk.modal', function(e) {
            modal.content.html('');
        });

        var resizeCache = {w: window.innerWidth, h:window.innerHeight};

        UI.$win.on('load resize orientationchange', UI.Utils.debounce(function(e){

            if (resizeCache.w !== window.innerWidth && modal.is(':visible') && !UI.Utils.isFullscreen()) {
                modal.lightbox.fitSize();
            }

            resizeCache = {w: window.innerWidth, h:window.innerHeight};

        }, 100));

        modal.lightbox = lightbox;

        return modal;
    }

    UI.lightbox.create = function(items, options) {

        if (!items) return;

        var group = [], o;

        items.forEach(function(item) {

            group.push(UI.$.extend({
                source : '',
                title  : '',
                type   : 'auto',
                link   : false
            }, (typeof(item) == 'string' ? {'source': item} : item)));
        });

        o = UI.lightbox(UI.$.extend({}, options, {'group':group}));

        return o;
    };

    return UI.lightbox;
});
