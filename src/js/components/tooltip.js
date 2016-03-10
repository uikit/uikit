import $ from 'jquery';

UIkit.component('tooltip', {

    mixins: [UIkit.mixin.toggle, UIkit.mixin.position],

    props: {
        delay: Number,
        clsCustom: String
    },

    defaults: {
        pos: 'top',
        offset: 5,
        delay: 0,
        cls: 'uk-active',
        clsPos: 'uk-tooltip'
    },

    ready() {

        this.content = this.$el.attr('title');
        this.$el.removeAttr('title');
        this.tooltip = $(`<div class="uk-tooltip"><div class="uk-tooltip-inner">${this.content}</div></div>`).appendTo('body');

        this.$el.on('focus mouseenter', this.show.bind(this);
        this.$el.on('blur mouseleave', this.hide.bind(this);

    },

    methods: {

        show() {
            clearTimeout(this.showTimer);

            this.showTimer = setTimeout(() => {
                this.positionAt(this.tooltip, this.$el);
                this.toggleState(this.tooltip);
            }, delay);

        },

        hide() {
            clearTimeout(this.showTimer);
            this.toggleState(this.tooltip);
        }

    }

});
