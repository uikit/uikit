/*! UIkit 2.11.0 | http://www.getuikit.com | (c) 2014 YOOtheme | MIT License */

(function(global, $, UI){

    var togglers = [];

    UI.component('toggle', {

        defaults: {
            target: false,
            cls: 'uk-hidden'
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

            this.totoggle.toggleClass(this.options.cls);

            if (this.options.cls == 'uk-hidden') {
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