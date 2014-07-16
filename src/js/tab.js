(function($, UI) {

    "use strict";


    UI.component('tab', {

        defaults: {
            'target'  : '>li:not(.uk-tab-responsive, .uk-disabled)',
            'connect' : false,
            'active'  : 0
        },

        init: function() {

            var $this = this;

            this.on("click", this.options.target, function(e) {
                e.preventDefault();
                $this.find($this.options.target).not(this).removeClass("uk-active").blur();
                $this.trigger("change", [$(this).addClass("uk-active")]);
            });


            if (this.options.connect) {
                this.connect = $(this.options.connect);
            }

            if (location.hash && location.hash.match(/^#[a-z0-9_-]+$/)) {
                var active = this.element.children().filter(window.location.hash);

                if (active.length) {
                    this.element.children().removeClass('uk-active').filter(active).addClass("uk-active");
                }
            }


            // init responsive tab

            this.responsivetab = $('<li class="uk-tab-responsive uk-active"><a></a></li>').append('<div class="uk-dropdown uk-dropdown-small"><ul class="uk-nav uk-nav-dropdown"></ul><div>');

            this.responsivetab.dropdown = this.responsivetab.find('.uk-dropdown');
            this.responsivetab.lst      = this.responsivetab.dropdown.find('ul');


            if (this.element.hasClass("uk-tab-bottom")) this.responsivetab.dropdown.addClass("uk-dropdown-up");
            if (this.element.hasClass("uk-tab-flip"))   this.responsivetab.dropdown.addClass("uk-dropdown-flip");

            // handle click
            this.responsivetab.lst.on('click', 'a', function(e) {

                if ($this.options.connect) {
                    e.preventDefault();
                    $this.element.data("switcher").show($(this).data('index'));
                }
            });

            // init UIkit components
            UI.switcher(this.element, {"toggle": ">li:not(.uk-tab-responsive)", "connect": this.options.connect, "active": this.options.active});
            UI.dropdown(this.responsivetab, {"mode": "click"});

            this.element.append(this.responsivetab);


            this.check();

            UI.$win.on('resize orientationchange', UI.Utils.debounce(function(){

                $this.check();

            }, 100));

        },

        check: function() {

            var children = this.element.children(':not(.uk-tab-responsive)');

            if (children.length < 2) return;

            var top = (children.eq(0).offset().top + Math.ceil(children.eq(0).height()/2)), added = 0;

            children.removeClass('uk-hidden');

            this.responsivetab.lst.empty();
            this.responsivetab.removeClass('uk-hidden');

            for (var i = children.length - 1; i > 0; i--) {

                var item = children.eq(i);

                if (item.offset().top > top || (added && this.responsivetab.offset().top > top)) {

                    var link = item.find('a');

                    if (item.css('float') != 'none' && !item.attr('uk-dropdown')) {

                        item.addClass('uk-hidden');
                        if(!item.hasClass('uk-disabled')) {
                            this.responsivetab.lst.append('<li><a href="'+link.attr('href')+'" data-index="'+i+'">'+link.html()+'</a></li>');
                            added++;
                        }
                    }
                }
            }

            this.responsivetab[this.responsivetab.lst.children().length ? 'removeClass':'addClass']('uk-hidden');
        }
    });

    // init code
    UI.ready(function(e) {

        $("[data-uk-tab]").each(function() {
            var tab = $(this);

            if (!tab.data("tab")) {
                var obj = UI.tab(tab, UI.Utils.options(tab.attr("data-uk-tab")));
            }
        });
    });

})(jQuery, jQuery.UIkit);