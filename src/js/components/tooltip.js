import $ from 'jquery';
import {flipPosition} from '../util/index';

UIkit.component('tooltip', {

    mixins: [UIkit.mixin.toggable, UIkit.mixin.position],

    props: {
        delay: Number
    },

    defaults: {
        pos: 'top',
        delay: 0,
        animation: 'uk-animation-scale-up',
        duration: 100,
        cls: 'uk-active',
        clsPos: 'uk-tooltip'
    },

    ready() {
        this.content = this.$el.attr('title');
        this.$el.removeAttr('title');
        this.tooltip = $(`<div class="${this.clsPos}" aria-hidden="true"><div class="${this.clsPos}-inner">${this.content}</div></div>`).appendTo('body');
    },

    methods: {

        show() {
            clearTimeout(this.showTimer);

            if (this.tooltip.hasClass('uk-active')) {
                return;
            }

            this.showTimer = setTimeout(() => {
                this.positionAt(this.tooltip, this.$el);
                this.origin = `${flipPosition(this.dir)}-${this.align}`;
                this.toggleElement(this.tooltip, true);
            }, this.delay);
        },

        hide() {
            clearTimeout(this.showTimer);
            this.toggleElement(this.tooltip, false);
        }

    },

    events: {
        'focus mouseenter': 'show',
        'blur mouseleave': 'hide'
    }

});
