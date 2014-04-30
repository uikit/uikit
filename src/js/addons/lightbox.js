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
    var active, container, html = $('html');

    var Lightbox = function(sources, options) {

        var $this = this;

        this.sources  = sources || [];
        this.options  = $.extend(true, {}, Lightbox.defaults, options);

        this._init();
    };

    $.extend(Lightbox.prototype, {
        index   : 0,
        visible : false,

        _init: function() {

            var $this = this;

            this.options.plugins.forEach(function(plugin) {
                Lightbox.plugins[plugin]($this);
            });

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

                container.on("click", ".uk-modal-close", function(e) {
                    e.preventDefault();
                    $this.hide();

                }).on("swipeRight swipeLeft", function(e) {

                    $this[e.type=='swipeLeft' ? 'next':'previous']();
                });

                container.modal = new UI.modal.Modal(container);

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

            if (active && active!==this) {
                active.hide();
            }

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

                if ($this.visible) {
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

            this.visible = true;
            this.index   = index;

            active = this;
        },

        hide: function(resolve) {
            var $this = this;

            container.modal.hide();

            if (active && active===this) {
                active = false;
            }

            this.visible = false;
        },

        next: function() {
            this.show(this.sources[(this.index+1)] ? (this.index+1) : 0);
        },

        previous: function() {
            this.show(this.sources[(this.index-1)] ? (this.index-1) : this.sources.length-1);
        },

        // events
        on: function(event, callback){
            $(this).on(event, callback);
        },

        trigger: function(event, params) {
            $(this).trigger(event, params);
        }
    });

    Lightbox.plugins   = {};

    Lightbox.addPlugin = function(name, plugin) {
        Lightbox.plugins[name] = plugin;
    };

    Lightbox.defaults = {
        "group": [],
        "zoom": false,
        "animation": {"in": "fade", "out":"fade"},
        "duration": 200,
        "keyboard": true,
        "loop": true,
        "plugins": ['image', 'domid', 'youtube', 'vimeo'],

        // events
        "onShow": function() {},
        "onHide": function() {},
        "onItemShow": function() {}
    };

    UI["lightbox"] = Lightbox;

    // plugins
    Lightbox.addPlugin("image", function(lightbox) {

        lightbox.on("lightbox-show", function(e, view){

            if (view.source.match(/\.(jpg|jpeg|png|gif|svg)/)) {

                var img = new Image();

                img.onerror = function(){
                    view.resolve(':-(');
                };

                img.onload = function(){
                    view.resolve({
                        'content': '<img src="'+view.source+'">',
                        'width': img.width,
                        'height': img.height
                    });
                };

                img.src = view.source;
            }
        });
    });

    Lightbox.addPlugin("youtube", function(lightbox) {

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
    });

    Lightbox.addPlugin("vimeo", function(lightbox) {

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
    });

    Lightbox.addPlugin("domid", function(lightbox) {

        lightbox.on("lightbox-show", function(e, view){

            if (view.source[0]=="#") {

            }
        });
    });

    $(document).on( 'keyup', function(e) {

        if (!active) return;

        e.preventDefault();

        switch(e.keyCode) {
            case 27:
                active.hide();
                break;
            case 37:
                active.previous();
                break;
            case 39:
                active.next();
                break;
        }
    });

    return Lightbox;
});
