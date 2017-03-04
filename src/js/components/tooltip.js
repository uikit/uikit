function plugin(UIkit) {

    if (plugin.installed) {
        return;
    }

    var { util, mixin } = UIkit;
    var {$, doc, fastdom, flipPosition, isTouch, isWithin, pointerDown, pointerEnter, pointerLeave, toJQuery} = util;

    var active;

    doc.on('click', e => {
        if (active && !isWithin(e.target, active.$el)) {
            active.hide();
        }
    });

    UIkit.component('tooltip', {

        mixins: [mixin.toggable, mixin.position],

        props: {
            delay: Number,
            container: Boolean,
            title: String
        },

        defaults: {
            pos: 'top',
            title: '',
            delay: 0,
            animation: 'uk-animation-scale-up',
            duration: 100,
            cls: 'uk-active',
            clsPos: 'uk-tooltip',
            container: true,
        },

        init() {
            this.container = this.container === true && UIkit.container || this.container && toJQuery(this.container);
            fastdom.mutate(() => this.$el.removeAttr('title').attr('aria-expanded', false));
        },

        methods: {

            show() {

                if (active === this) {
                    return;
                }

                if (active) {
                    active.hide();
                }

                active = this;

                clearTimeout(this.showTimer);

                this.tooltip = $(`<div class="${this.clsPos}" aria-hidden="true"><div class="${this.clsPos}-inner">${this.title}</div></div>`).appendTo(this.container);

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

                active = active !== this && active || false;

                clearTimeout(this.showTimer);
                clearInterval(this.hideTimer);
                this.$el.attr('aria-expanded', false);
                this.toggleElement(this.tooltip, false);
                this.tooltip && this.tooltip.remove();
                this.tooltip = false;
            }

        },

        events: {
            [`focus ${pointerEnter} ${pointerDown}`](e) {
                if (e.type !== pointerDown || !isTouch(e)) {
                    this.show();
                }
            },
            'blur': 'hide',
            [pointerLeave](e) {
                if (!isTouch(e)) {
                    this.hide()
                }
            }
        }

    });

}

if (!BUNDLED && typeof window !== 'undefined' && window.UIkit) {
    window.UIkit.use(plugin);
}

export default plugin;
