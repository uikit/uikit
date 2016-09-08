import { util, mixin, container } from 'uikit';

var {$, flipPosition} = util;

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
        this.$el
            .removeAttr('title')
            .attr('aria-expanded', false);
    },

    methods: {

        show() {

            clearTimeout(this.showTimer);

            if (this.$el.attr('aria-expanded') === 'true') {
                return;
            }

            this.tooltip = $(`<div class="${this.clsPos}" aria-hidden="true"><div class="${this.clsPos}-inner">${this.content}</div></div>`).appendTo(container);

            this.$el.attr('aria-expanded', true);

            this.positionAt(this.tooltip, this.$el);
            this.origin = this.getAxis() === 'y' ? `${flipPosition(this.dir)}-${this.align}` : `${this.align}-${flipPosition(this.dir)}`;

            this.showTimer = setTimeout(() => {
                this.toggleElement(this.tooltip, true);

                this.hideTimer = setInterval(() => {
                    if (!this.$el.is(':visible')) {
                        this.hide();
                    }
                }, 150);

            }, this.delay);
        },

        hide() {

            if (this.$el.is('input') && this.$el[0] === document.activeElement) {
                return;
            }

            clearTimeout(this.showTimer);
            clearInterval(this.hideTimer);
            this.$el.attr('aria-expanded', false);
            this.toggleElement(this.tooltip, false);
            this.tooltip.remove();
            this.tooltip = false;
        }

    },

    events: {
        'focus mouseenter': 'show',
        'blur mouseleave': 'hide'
    }

});
