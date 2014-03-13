(function(addon) {

    if (typeof define == "function" && define.amd) { // AMD
        define("uikit-autocomplete", ["uikit"], function(){
            return jQuery.UIkit.autocomplete || addon(window, window.jQuery, window.jQuery.UIkit);
        });
    }

    if(window && window.jQuery && window.jQuery.UIkit) {
        addon(window, window.jQuery, window.jQuery.UIkit);
    }

})(function(global, $, UI){

    var Autocomplete = function(element, options) {

        var $this = this, $element = $(element);

        if($element.data("autocomplete")) return;

        this.options = $.extend({}, Autocomplete.defaults, options);

        this.element = $element;

        this.dropdown   = $element.find('.uk-autocomplete-dropdown');
        this.resultItem = $element.find('script.js-item');

        if (!this.dropdown.length) {
           this.dropdown = $('<div class="uk-dropdown uk-autocomplete-dropdown"></div>').appendTo($element);
        }

        if(!this.resultItem.length) {
            this.resultContainer = $('<ul class="uk-list"></ul>').appendTo(this.dropdown);
            this.resultItem      = '<li>{{value}}</ul>';
        } else {
            this.resultContainer = this.resultItem.parent();
            this.resultItem      = this.resultItem.html();
        }

        this.input = $element.find("input:first");

        this.element.data("autocomplete", this);

        this.init();
    };

    $.extend(Autocomplete.prototype, {

        visible: false,
        value: null,

        init: function() {

            var $this = this,
                trigger = UI.Utils.debounce(function(e) {
                    $this.trigger();
                }, this.options.delay);

            this.input.on({
                "keydown": function(e) {

                    if (e && e.which && !e.shiftKey) {

                        switch (e.which) {
                            case 13: // enter
                                e.preventDefault();
                                break;
                            case 38: // up
                                e.preventDefault();
                                break;
                            case 40: // down
                                e.preventDefault();
                                break;
                            case 27:
                            case 9: // esc, tab
                                $this.hide();
                                break;
                            default:
                                break;
                        }
                    }

                },
                "keyup": trigger,
                "blur": function(e) {
                    setTimeout(function() { $this.hide(); }, 200);
                }
            });

            this.resultContainer.on("click", ">*", function(){
                alert($(this).data("value"));
            });
        },

        trigger: function() {

            var $this = this, old = this.value;

            this.value = this.input.val();

            if (this.value.length < this.options.minLength) return this.hide();

            if (this.value != old) {
                $this.request();
            }

            return this;
        },

        show: function() {
            if (this.visible) return;
            this.visible = true;
            this.element.addClass("uk-open");
            return this;
        },

        hide: function() {
            if (!this.visible) return;
            this.visible = false;
            this.element.removeClass("uk-open");
            return this;
        },

        request: function() {

            var $this = this;

            this.element.addClass(this.options.loadingClass);

            this.options.source = [
                {value:'Lorem'},
                {value:'Lorem'},
                {value:'Lorem'},
                {value:'Lorem'},
                {value:'Lorem'},
                {value:'Lorem'},
                {value:'Lorem'},
                {value:'Lorem'}
            ];


            if (this.options.source) {

                this.render(this.options.source);
                this.show();

            } else {
                this.element.removeClass($this.options.loadingClass);
            }
        },

        render: function(data) {

            var $this = this;

            this.resultContainer.empty();

            if(data && data.length) {

                var results = [];

                data.forEach(function(item){

                    var resultitem = $this.resultItem;

                    Object.keys(item).forEach(function(key){
                        resultitem = resultitem.replace(new RegExp('{{'+key+'}}', 'g'), item[key]);
                    });

                    $this.resultContainer.append($(resultitem).data(item));

                }, this);
            }
        }
    });

    Autocomplete.defaults = {
        minLength: 3,
        param: 'search',
        delay: 300,
        loadingClass: 'uk-loading',
        source: null
    };

    UI["autocomplete"] = Autocomplete;

    // init code
    $(document).on("focus.autocomplete.uikit", "[data-uk-autocomplete]", function(e) {

        var ele = $(this);
        if (!ele.data("autocomplete")) {
            var obj = new Autocomplete(ele, UI.Utils.options(ele.attr("data-uk-autocomplete")));
        }
    });

    return Autocomplete;

});