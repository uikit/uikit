import $ from 'jquery';

UIkit.component('tooltip', {

    mixins: [UIkit.mixin.toggle, UIkit.mixin.position],

    props: {
        delay: Number,
        clsActive: String
    },

    defaults: {
        pos: 'top',
        offset: 5,
        delay: 0,
        cls: 'uk-active',
        clsActive: '',
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
            this.clearTimeout();

            this.positionAt(this.tooltip, this.$el);
            this.toggleState(this.tooltip);
            //this.tooltip.toggleClass(this.cls);
        },

        hide() {
            this.clearTimeout();

            this.toggleState(this.tooltip);
            //this.tooltip.toggleClass(this.cls);
        },

        clearTimeout() {
            clearTimeout(this.showTimer);
        }

    }

});
