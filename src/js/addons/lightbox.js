(function(addon) {

    if (typeof define == "function" && define.amd) { // AMD
        define(["uikit"], function(){
            return jQuery.UIkit || addon(window.jQuery, window.jQuery.UIkit);
        });
    }

    if (window && window.jQuery && window.jQuery.UIkit) {
        addon(window.jQuery, window.jQuery.UIkit);
    }

})(function($, UI){

    // tmp variables
    var container, html = $('html');

    UI.component('lightbox', {

        defaults: {
            "sources": [],
            "zoom": false,
            "animation": {"in": "fade", "out":"fade"},
            "duration": 200,
            "keyboard": true,
            "loop": true,
            "plugins": ['image', 'youtube', 'vimeo', 'video'],

            // events
            "onShow": function() {},
            "onHide": function() {},
            "onItemShow": function() {}
        },

        index: 0,

        init: function() {

            var $this = this;

            this.sources = this.options.sources || [];

            if (!container) {

                container = $([
                    '<div class="uk-modal" style="text-align: center;">',
                        '<div class="uk-modal-dialog" style="text-align: left;display:inline-block;width:auto;">',
                            '<a class="uk-modal-close uk-close"></a>',
                            '<div class="uk-lightbox-content"></div>',
                        '</div>',
                    '</div>'
                ].join('')).appendTo('body');

                container.dialog  = container.find('.uk-modal-dialog:first');
                container.content = container.find('.uk-lightbox-content:first');

                container.on("swipeRight swipeLeft", function(e) {
                    $this[e.type=='swipeLeft' ? 'next':'previous']();
                });

                container.modal = new UI.modal.Modal(container);
                this.proxy(container.modal, ['hide', 'isActive']);
            }

            this.container = container;
            this.trigger('lightbox-init', [this]);
        },

        _animateIn: function(meta) {

            if (meta.width && meta.height) {

                container.content.animate({width:meta.width, height:meta.height}, function(){
                    container.content.html(meta.content).removeClass('uk-animation-fade uk-animation-reverse').width();
                    container.content.addClass('uk-animation-fade');
                });

            } else {
                container.content.html(meta.content).removeClass('uk-animation-fade uk-animation-reverse').width();
                container.content.addClass('uk-animation-fade');
            }
        },

        _animateOut: function(resolve) {

            if (container.content.is(':visible')) {

                container.content.removeClass('uk-animation-fade uk-animation-reverse').one(UI.support.animation.end, function() {
                    if (resolve) resolve();
                }).width()

                container.content.addClass('uk-animation-fade uk-animation-reverse');

            } else {
                if (resolve) resolve();
            }
        },

        show: function(index) {

            var $this = this;

            if (!this.sources.length) {
                return false;
            }

            index = index || 0;

            if ( index < 0 ) {
                index = this.sources.length - index;
            }

            if (!this.sources[index]) {
                index = 0;
            }

            (new Promise(function(resolve){

                // hide previous slide
                if ($this.isActive()) {
                    $this._animateOut(resolve);
                } else {
                    container.modal.show();
                    resolve();
                }

            })).then(function(){

                // show next slide

                var view = {
                        "lightbox" : $this,
                        "source"   : $this.sources[index],
                        "index"    : index,
                        "promise"  : null
                    },
                    promise = new Promise(function(resolve, reject){
                        view.resolve = resolve;
                        view.reject  = reject;
                    }),
                    meta  = {
                       content: '',
                       width: null,
                       height: null
                    };

                $this.trigger('lightbox-show', [view]);

                promise.then(

                    // on resolve
                    function(data) {

                        if (typeof(data)=='string') {
                            meta.content = data;
                        } else {
                            meta = $.extend({}, meta, data);
                        }

                        $this._animateIn(meta);
                    }
                );
            });

            this.index = index;
            this.container.modal.lightbox = this;
        },

        next: function() {
            this.show(this.sources[(this.index+1)] ? (this.index+1) : 0);
        },

        previous: function() {
            this.show(this.sources[(this.index-1)] ? (this.index-1) : this.sources.length-1);
        }
    });

    // plugins
    UI.plugin("lightbox", "image", {

        init: function(lightbox) {

            var cache = {};

            lightbox.on("lightbox-show", function(e, view){

                if (view.source.match(/\.(jpg|jpeg|png|gif|svg)$/)) {

                    var resolve = function(source, width, height) {
                        view.resolve({
                            'content': '<img src="'+source+'">',
                            'width': width,
                            'height': height
                        });
                    };

                    if (!cache[view.source]) {

                        var img = new Image();

                        img.onerror = function(){
                            view.resolve(':-(');
                        };

                        img.onload = function(){
                            cache[view.source] = {width: img.width, height: img.height};
                            resolve(view.source, cache[view.source].width, cache[view.source].height);
                        };

                        img.src = view.source;

                    } else {
                        resolve(view.source, cache[view.source].width, cache[view.source].height);
                    }
                }
            });
        }
    });


    UI.plugin("lightbox", "youtube", {

        init: function(lightbox) {

            var youtubeRegExp = /(\/\/.*?youtube\.[a-z]+)\/watch\?v=([^&]+)&?(.*)/,
                youtubeRegExpShort = /youtu\.be\/(.*)/,
                cache = {};


            lightbox.on("lightbox-show", function(e, view){

                var id, matches, resolve = function(id, width, height) {
                    view.resolve({
                        'content': '<iframe src="//www.youtube.com/embed/'+id+'" width="'+width+'" height="'+height+'" style="max-width:100%;"></iframe>',
                        'width': width,
                        'height': height
                    });
                };

                if (matches = view.source.match(youtubeRegExp)) {
                    id = matches[2];
                }

                if (matches = view.source.match(youtubeRegExpShort)) {
                    id = matches[1];
                }

                if (id) {

                    if(!cache[id]) {

                        var img = new Image();

                        img.onerror = function(){
                            cache[id] = {width:640, height:320};
                            resolve(id, cache[id].width, cache[id].height);
                        };

                        img.onload = function(){
                            cache[id] = {width:img.width, height:img.height};
                            resolve(id, img.width, img.height);
                        };

                        img.src = '//img.youtube.com/vi/'+id+'/0.jpg';

                    } else {
                        resolve(id, cache[id].width, cache[id].height);
                    }

                    e.stopImmediatePropagation();
                }
            });
        }
    });


    UI.plugin("lightbox", "vimeo", {

        init: function(lightbox) {

            var regex = /(\/\/.*?)vimeo\.[a-z]+\/([0-9]+).*?/, matches, cache = {};


            lightbox.on("lightbox-show", function(e, view){

                var id, resolve = function(id, width, height) {
                    view.resolve({
                        'content': '<iframe src="//player.vimeo.com/video/'+id+'" width="'+width+'" height="'+height+'" style="max-width:100%;"></iframe>',
                        'width': width,
                        'height': height
                    });
                };

                if (matches = view.source.match(regex)) {

                    id = matches[2];

                    if(!cache[id]) {

                        $.ajax({
                            type     : 'GET',
                            url      : 'http://vimeo.com/api/oembed.json?url=' + encodeURI(view.source),
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

    UI.plugin("lightbox", "video", {

        init: function(lightbox) {

            var cache = {};

            lightbox.on("lightbox-show", function(e, view){

                var resolve = function(source, width, height) {
                    view.resolve({
                        'content': '<video src="'+source+'" width="'+width+'" height="'+height+'" controls width="'+width+'" height="'+height+'"></video>',
                        'width': width,
                        'height': height
                    });
                };

                if (view.source.match(/\.(mp4|webm|ogv)$/)) {

                    if(!cache[view.source]) {

                        var vid = $('<video style="position:fixed;visibility:hidden;top:-10000px;"></video>').attr('src', view.source).appendTo('body');

                        var idle = setInterval(function() {

                            if (vid[0].videoWidth) {
                                clearInterval(idle);
                                cache[view.source] = {width: vid[0].videoWidth, height: vid[0].videoHeight};
                                resolve(view.source, cache[view.source].width, cache[view.source].height);
                                vid.remove();
                            }

                        }, 20);

                    } else {
                        resolve(view.source, cache[view.source].width, cache[view.source].height);
                    }
                }
            });
        }
    });

    $(document).on( 'keyup', function(e) {

        if (container && container.modal.isActive()) {

            e.preventDefault();

            switch(e.keyCode) {
                case 37:
                    container.modal.lightbox.previous();
                    break;
                case 39:
                    container.modal.lightbox.next();
                    break;
            }
        }
    });

    return UI.lightbox;
});
