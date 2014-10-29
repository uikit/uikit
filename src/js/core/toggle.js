
(function(global, $, UI){

    var togglers = [];

    UI.component('toggle', {

        defaults: {
            target    : false,
            cls       : 'uk-hidden',
            animation : false
        },

        init: function() {

            var $this = this;

            this.getTogglers();

            this.on("click", function(e) {
                if ($this.element.is('a[href="#"]')) e.preventDefault();
                $this.toggle();
            });

            togglers.push(this);
        },

        toggle: function() {

            if(!this.totoggle.length) return;

            if (this.options.animation) {

                var animations = this.options.animation.split(',');

                if (animations.length == 1) {
                    animations[1] = animations[0];
                }

                animations[0] = animations[0].trim();
                animations[1] = animations[1].trim();

                if (this.totoggle.hasClass(this.options.cls)) {

                    this.totoggle.toggleClass(this.options.cls);

                    UI.Utils.animate(this.totoggle, animations[0]).then(function(){
                        UI.Utils.checkDisplay(this.totoggle);
                    }.bind(this));

                } else {

                    UI.Utils.animate(this.totoggle, animations[1]+' uk-animation-reverse').then(function(){
                        this.totoggle.toggleClass(this.options.cls);
                        UI.Utils.checkDisplay(this.totoggle);
                    }.bind(this));
                }

            } else {
                this.totoggle.toggleClass(this.options.cls);
                UI.Utils.checkDisplay(this.totoggle);
            }
        },

        getTogglers: function() {
            this.totoggle = this.options.target ? $(this.options.target):[];
        }
    });

    // init code
    UI.ready(function(context) {

        $("[data-uk-toggle]", context).each(function() {
            var ele = $(this);

            if (!ele.data("toggle")) {
               var obj = UI.toggle(ele, UI.Utils.options(ele.attr("data-uk-toggle")));
            }
        });

        setTimeout(function(){

            togglers.forEach(function(toggler){
                toggler.getTogglers();
            });

        }, 0);
    });



})(this, jQuery, jQuery.UIkit);
