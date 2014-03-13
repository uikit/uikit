
(function(global, $, UI){

    var Toggle = function(element, options) {

        var $this = this, $element = $(element);

        if($element.data("toggle")) return;

        this.options  = $.extend({}, Toggle.defaults, options);
        this.totoggle = this.options.target ? $(this.options.target):[];
        this.element  = $element.on("click", function(e) {
            e.preventDefault();
            $this.toggle();
        });

        this.element.data("toggle", this);
    };

    $.extend(Toggle.prototype, {

        toggle: function() {

            if(!this.totoggle.length) return;

            this.totoggle.toggleClass(this.options.cls);
        }
    });

    Toggle.defaults = {
        target: false,
        cls: 'uk-hidden'
    };

    UI["toggle"] = Toggle;

    $(document).on("uk-domready", function(e) {

        $("[data-uk-toggle]").each(function() {
            var ele = $(this);

            if (!ele.data("toggle")) {
               var obj = new Toggle(ele, UI.Utils.options(ele.attr("data-uk-toggle")));
            }
        });
    });

})(this, jQuery, jQuery.UIkit);