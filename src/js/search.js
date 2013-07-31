(function($, UI) {

    "use strict";

    var Search = function(element, options) {

        var $this = this;

        this.options = $.extend({}, this.options, options);

        this.element = $(element);

        this.timer = null;
        this.value = null;
        this.input = this.element.find(".uk-search-field");
        this.form  = this.input.length ? $(this.input.get(0).form) : $();
        this.input.attr('autocomplete', 'off');

        this.input.on({
            keydown: function(event) {
                $this.form[($this.input.val()) ? 'addClass' : 'removeClass']($this.options.filledClass);

                if (event && event.which && !event.shiftKey) {

                    switch (event.which) {
                        case 13: // enter
                            $this.done($this.selected);
                            event.preventDefault();
                            break;
                        case 38: // up
                            $this.pick('prev');
                            event.preventDefault();
                            break;
                        case 40: // down
                            $this.pick('next');
                            event.preventDefault();
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
            keyup: function(event) {
                $this.trigger();
            },
            blur: function(event) {
                setTimeout(function() { $this.hide(event); }, 200);
            }
        });

        this.form.find('button[type=reset]').bind('click', function() {
            $this.form.removeClass("uk-open").removeClass("uk-loading").removeClass("uk-active");
            $this.value = null;
            $this.input.focus();
        });

        this.dropdown = $('<div class="uk-dropdown uk-dropdown-search"><ul class="uk-nav uk-nav-search"></ul></div>').appendTo(this.form).find('.uk-nav-search');

        if (this.options.flipDropdown) {
            this.dropdown.parent().addClass('uk-dropdown-flip');
        }
    };

    $.extend(Search.prototype, {

        options: {
            source: false,
            param: 'search',
            method: 'post',
            minLength: 3,
            delay: 300,
            flipDropdown: false,
            match: ':not(.uk-skip)',
            skipClass: 'uk-skip',
            loadingClass: 'uk-loading',
            filledClass: 'uk-active',
            resultsHeaderClass: 'uk-nav-header',
            moreResultsClass: '',
            noResultsClass: '',
            listClass: 'results',
            hoverClass: 'uk-active',
            msgResultsHeader: 'Search Results',
            msgMoreResults: 'More Results',
            msgNoResults: 'No results found',
            onSelect: function(selected) { window.location = selected.data('choice').url; },
            onLoadedResults: function(results) { return results; }
        },

        request: function(options) {
            var $this = this;

            this.form.addClass(this.options.loadingClass);

            if (this.options.source) {

                $.ajax($.extend({
                    url: this.options.source,
                    type: this.options.method,
                    dataType: 'json',
                    success: function(data) {
                        data = $this.options.onLoadedResults.apply(this, [data]);
                        $this.form.removeClass($this.options.loadingClass);
                        $this.suggest(data);
                    }
                }, options));

            } else {
                this.form.removeClass($this.options.loadingClass);
            }
        },

        pick: function(item) {
            var selected = false;

            if (typeof item !== "string" && !item.hasClass(this.options.skipClass)) {
                selected = item;
            }

            if (item == 'next' || item == 'prev') {

                var items = this.dropdown.children().filter(this.options.match);

                if (this.selected) {
                    var index = items.index(this.selected);

                    if (item == 'next') {
                        selected = items.eq(index + 1 < items.length ? index + 1 : 0);
                    } else {
                        selected = items.eq(index - 1 < 0 ? items.length - 1 : index - 1);
                    }

                } else {
                    selected = items[(item == 'next') ? 'first' : 'last']();
                }

            }

            if (selected && selected.length) {
                this.selected = selected;
                this.dropdown.children().removeClass(this.options.hoverClass);
                this.selected.addClass(this.options.hoverClass);
            }
        },

        done: function(selected) {

            if (!selected) {
                this.form.submit();
                return;
            }

            if (selected.hasClass(this.options.moreResultsClass)) {
                this.form.submit();
            } else if (selected.data('choice')) {
                this.options.onSelect.apply(this, [selected]);
            }

            this.hide();
        },

        trigger: function() {

            var $this = this, old = this.value, data = {};

            this.value = this.input.val();

            if (this.value.length < this.options.minLength) {
                return this.hide();
            }

            if (this.value != old) {

                if (this.timer) window.clearTimeout(this.timer);

                this.timer = window.setTimeout(function() {
                    data[$this.options.param] = $this.value;
                    $this.request({'data': data});
                }, this.options.delay, this);
            }

            return this;
        },

        suggest: function(data) {

            if (!data) return;

            var $this  = this,
                events = {
                    'mouseover': function() { $this.pick($(this).parent()); },
                    'click': function(e) {
                        e.preventDefault();
                        $this.done($(this).parent());
                    }
                };

            if (data === false) {
                this.hide();
            } else {
                this.selected = null;
                this.dropdown.empty();

                if (this.options.msgResultsHeader) {
                    $('<li>').addClass(this.options.resultsHeaderClass + ' ' + this.options.skipClass).html(this.options.msgResultsHeader).appendTo(this.dropdown);
                }

                if (data.results && data.results.length > 0) {

                    $(data.results).each(function(i) {

                        var item = $('<li><a href="#">' + this.title + '</a></li>').data('choice', this);

                        if (this["text"]) {
                            item.find("a").append('<div>' + this.text + '</div>');
                        }

                        $this.dropdown.append(item);
                    });

                    if (this.options.msgMoreResults) {
                        $('<li>').addClass('uk-nav-divider ' + $this.options.skipClass).appendTo($this.dropdown);
                        $('<li>').addClass($this.options.moreResultsClass).html('<a href="#">' + $this.options.msgMoreResults + '</a>').appendTo($this.dropdown).on(events);
                    }

                    $this.dropdown.find("li>a").on(events);

                } else if (this.options.msgNoResults) {
                    $('<li>').addClass(this.options.noResultsClass + ' ' + this.options.skipClass).html('<a>' + this.options.msgNoResults + '</a>').appendTo(this.dropdown);
                }

                this.show();
            }
        },

        show: function() {
            if (this.visible) return;
            this.visible = true;
            this.form.addClass("uk-open");
        },

        hide: function() {
            if (!this.visible)
                return;
            this.visible = false;
            this.form.removeClass(this.options.loadingClass).removeClass("uk-open");
        }
    });

    UI["search"] = Search;

    // init code
    $(document).on("focus.search.uikit", "[data-uk-search]", function(e) {
        var ele = $(this);

        if (!ele.data("search")) {
            ele.data("search", new Search(ele, UI.Utils.options(ele.data("uk-search"))));
        }
    });

})(jQuery, jQuery.UIkit);