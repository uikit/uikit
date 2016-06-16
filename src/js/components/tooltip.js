import $ from 'jquery';
import {util, mixin} from 'uikit';

var flipPosition = util.flipPosition;

UIkit.component('tooltip', {

    mixins: [mixin.toggable, mixin.position],

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

        this.updateAria(this.tooltip);
        this.$el.attr('aria-expanded', false);
    },

    methods: {

        show() {
            clearTimeout(this.showTimer);

            if (this.$el.attr('aria-expanded') === 'true') {
                return;
            }

            this.$el.attr('aria-expanded', true);

            this.positionAt(this.tooltip, this.$el);
            this.origin = this.getAxis() === 'y' ? `${flipPosition(this.dir)}-${this.align}` : `${this.align}-${flipPosition(this.dir)}`;

            this.showTimer = setTimeout(() => this.toggleElement(this.tooltip, true), this.delay);
        },

        hide() {
            clearTimeout(this.showTimer);
            this.$el.attr('aria-expanded', false);
            this.toggleElement(this.tooltip, false);
        }

    },

    events: {
        'focus mouseenter': 'show',
        'blur mouseleave': 'hide'
    }

});
