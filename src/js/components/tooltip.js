import $ from 'jquery';
import {removeClass} from '../util/index';

UIkit.component('tooltip', {

    mixins: [UIkit.mixin.toggable, UIkit.mixin.position],

    props: {
        delay: Number,
        clsCustom: String
    },

    defaults: {
        pos: 'top',
        offset: 5,
        delay: 0,
        cls: 'uk-active',
        clsPos: 'uk-tooltip',
        clsAnimation: 'uk-animation-',
        animation: 'uk-animation-scale-up',
        duration: 150
    },

    ready() {

        this.content = this.$el.attr('title');
        this.$el.removeAttr('title');
        this.tooltip = $(`<div class="uk-tooltip" aria-hidden="true"><div class="uk-tooltip-inner">${this.content}</div></div>`).appendTo('body');

    },

    methods: {

        show() {
            clearTimeout(this.showTimer);

            this.showTimer = setTimeout(() => {
                this.positionAt(this.tooltip, this.$el);
                removeClass(this.$el, this.clsAnimation);
                this.$el.addClass(`${this.clsAnimation}${this.dir}-${this.align}`);
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
