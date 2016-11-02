(function(UI) {

    "use strict";

    var grids = [];

    UI.component('gridMatchHeight', {

        defaults: {
            target        : false,
            row           : true,
            ignorestacked : false,
            observe       : false
        },

        boot: function() {

            // init code
            UI.ready(function(context) {

                UI.$('[data-uk-grid-match]', context).each(function() {
                    var grid = UI.$(this), obj;

                    if (!grid.data('gridMatchHeight')) {
                        obj = UI.gridMatchHeight(grid, UI.Utils.options(grid.attr('data-uk-grid-match')));
                    }
                });
            });
        },

        init: function() {

            var $this = this;

            this.columns  = this.element.children();
            this.elements = this.options.target ? this.find(this.options.target) : this.columns;

            if (!this.columns.length) return;

            UI.$win.on('load resize orientationchange', (function() {

                var fn = function() {
                    if ($this.element.is(':visible')) $this.match();
                };

                UI.$(function() { fn(); });

                return UI.Utils.debounce(fn, 50);
            })());

            if (this.options.observe) {

                UI.domObserve(this.element, function(e) {
                    if ($this.element.is(':visible')) $this.match();
                });
            }

            this.on('display.uk.check', function(e) {
                if(this.element.is(':visible')) this.match();
            }.bind(this));

            grids.push(this);
        },

        match: function() {

            var firstvisible = this.columns.filter(':visible:first');

            if (!firstvisible.length) return;

            var stacked = Math.ceil(100 * parseFloat(firstvisible.css('width')) / parseFloat(firstvisible.parent().css('width'))) >= 100;

            if (stacked && !this.options.ignorestacked) {
                this.revert();
            } else {
                UI.Utils.matchHeights(this.elements, this.options);
            }

            return this;
        },

        revert: function() {
            this.elements.css('min-height', '');
            return this;
        }
    });

    UI.component('gridMargin', {

        defaults: {
            cls      : 'uk-grid-margin',
            rowfirst : 'uk-row-first'
        },

        boot: function() {

            // init code
            UI.ready(function(context) {

                UI.$('[data-uk-grid-margin]', context).each(function() {
                    var grid = UI.$(this), obj;

                    if (!grid.data('gridMargin')) {
                        obj = UI.gridMargin(grid, UI.Utils.options(grid.attr('data-uk-grid-margin')));
                    }
                });
            });
        },

        init: function() {

            var stackMargin = UI.stackMargin(this.element, this.options);
        }
    });

})(UIkit2);
