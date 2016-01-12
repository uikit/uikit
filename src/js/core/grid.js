"use strict";

import $ from '../lib/dom';
import $util from '../lib/util';

let grids = [];

$(window).on('load resize orientationchange', e => {
    grids.forEach(grid => {
        grid.check();
    });
});


export default function(UI) {

    UI.component('grid', {

        webcomponent: true,

        props: {
            margin  : 'uk-grid-margin',
            match   : false,
            rowfirst: 'uk-grid-first'
        },

        init() {
            this.check();
            grids.push(this);
        },

        check() {

            this.columns = this.$el.children();

            if (this.match) this.matcher();
            if (this.margin) this.margins();

            if (!this.$opts.rowfirst) {
                return this;
            }

            // Mark first column elements
            let pos_cache = this.columns.removeClass(this.$opts.rowfirst).filter(':visible').first().position();

            if (pos_cache) {

                let $this = this;

                this.columns.each(function() {
                    $(this)[$(this).position().left == pos_cache.left ? 'addClass':'removeClass']($this.$opts.rowfirst);
                });
            }
        },

        matcher(){

            if (this.match) {

                let children     = this.columns;
                let firstvisible = children.filter(":visible:first");

                if (!firstvisible.length) return;

                let elements = this.match === true ? children : this.$find(this.match);
                let stacked  = Math.ceil(100 * parseFloat(firstvisible.css('width')) / parseFloat(firstvisible.parent().css('width'))) >= 100;

                if (stacked && !this.ignorestacked) {
                    elements.css('min-height', '');
                } else {
                    $util.matchHeights(elements, this.options);
                }
            }

            return this;
        },

        margins() {

            if (this.margin) {
                $util.stackMargin(this.columns, this.$opts);
            }

            return this;
        }

    });

}
