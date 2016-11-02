/*! UIkit 2.27.2 | http://www.getuikit.com | (c) 2014 YOOtheme | MIT License */
(function(UI){

    "use strict";

    var toggles = [];

    UI.component('toggle', {

        defaults: {
            target    : false,
            cls       : 'uk-hidden',
            animation : false,
            duration  : 200
        },

        boot: function(){

            // init code
            UI.ready(function(context) {

                UI.$('[data-uk-toggle]', context).each(function() {
                    var ele = UI.$(this);

                    if (!ele.data('toggle')) {
                        var obj = UI.toggle(ele, UI.Utils.options(ele.attr('data-uk-toggle')));
                    }
                });

                setTimeout(function(){

                    toggles.forEach(function(toggle){
                        toggle.getToggles();
                    });

                }, 0);
            });
        },

        init: function() {

            var $this = this;

            this.aria = (this.options.cls.indexOf('uk-hidden') !== -1);

            this.on('click', function(e) {

                if ($this.element.is('a[href="#"]')) {
                    e.preventDefault();
                }

                $this.toggle();
            });

            toggles.push(this);
        },

        toggle: function() {

            this.getToggles();

            if(!this.totoggle.length) return;

            if (this.options.animation && UI.support.animation) {

                var $this = this, animations = this.options.animation.split(',');

                if (animations.length == 1) {
                    animations[1] = animations[0];
                }

                animations[0] = animations[0].trim();
                animations[1] = animations[1].trim();

                this.totoggle.css('animation-duration', this.options.duration+'ms');

                this.totoggle.each(function(){

                    var ele = UI.$(this);

                    if (ele.hasClass($this.options.cls)) {

                        ele.toggleClass($this.options.cls);

                        UI.Utils.animate(ele, animations[0]).then(function(){
                            ele.css('animation-duration', '');
                            UI.Utils.checkDisplay(ele);
                        });

                    } else {

                        UI.Utils.animate(this, animations[1]+' uk-animation-reverse').then(function(){
                            ele.toggleClass($this.options.cls).css('animation-duration', '');
                            UI.Utils.checkDisplay(ele);
                        });

                    }

                });

            } else {
                this.totoggle.toggleClass(this.options.cls);
                UI.Utils.checkDisplay(this.totoggle);
            }

            this.updateAria();

        },

        getToggles: function() {
            this.totoggle = this.options.target ? UI.$(this.options.target):[];
            this.updateAria();
        },

        updateAria: function() {
            if (this.aria && this.totoggle.length) {
                this.totoggle.not('[aria-hidden]').each(function(){
                    UI.$(this).attr('aria-hidden', UI.$(this).hasClass('uk-hidden'));
                });
            }
        }
    });

})(UIkit2);
