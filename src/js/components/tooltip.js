function plugin(UIkit) {

    if (plugin.installed) {
        return;
    }

    var {util, mixin} = UIkit;
    var {append, attr, doc, flipPosition, includes, isTouch, isVisible, matches, on, pointerDown, pointerEnter, pointerLeave, remove, within} = util;

    var actives = [];

    UIkit.component('tooltip', {

        attrs: true,

        mixins: [mixin.togglable, mixin.position],

        props: {
            delay: Number,
            title: String
        },

        defaults: {
            pos: 'top',
            title: '',
            delay: 0,
            animation: ['uk-animation-scale-up'],
            duration: 100,
            cls: 'uk-active',
            clsPos: 'uk-tooltip'
        },

        connected() {
            attr(this.$el, {title: null, 'aria-expanded': false});
        },

        disconnected() {
            this.hide();
        },

        methods: {

            show() {

                if (includes(actives, this)) {
                    return;
                }

                actives.forEach(active => active.hide());
                actives.push(this);

                this._unbind = on(doc, 'click', e => !within(e.target, this.$el) && this.hide());

                clearTimeout(this.showTimer);

                this.tooltip = append(UIkit.container, `<div class="${this.clsPos}" aria-hidden><div class="${this.clsPos}-inner">${this.title}</div></div>`);

                attr(this.$el, 'aria-expanded', true);

                this.positionAt(this.tooltip, this.$el);

                this.origin = this.getAxis() === 'y' ? `${flipPosition(this.dir)}-${this.align}` : `${this.align}-${flipPosition(this.dir)}`;

                this.showTimer = setTimeout(() => {

                    this.toggleElement(this.tooltip, true);

                    this.hideTimer = setInterval(() => {

                        if (!isVisible(this.$el)) {
                            this.hide();
                        }

                    }, 150);

                }, this.delay);
            },

            hide() {

                var index = actives.indexOf(this);

                if (!~index || matches(this.$el, 'input') && this.$el === doc.activeElement) {
                    return;
                }

                actives.splice(index, 1);

                clearTimeout(this.showTimer);
                clearInterval(this.hideTimer);
                attr(this.$el, 'aria-expanded', false);
                this.toggleElement(this.tooltip, false);
                this.tooltip && remove(this.tooltip);
                this.tooltip = false;
                this._unbind();

            }

        },

        events: {

            [`focus ${pointerEnter} ${pointerDown}`](e) {
                if (e.type !== pointerDown || !isTouch(e)) {
                    this.show();
                }
            },

            blur: 'hide',

            [pointerLeave](e) {
                if (!isTouch(e)) {
                    this.hide();
                }
            }

        }

    });

}

if (!BUNDLED && typeof window !== 'undefined' && window.UIkit) {
    window.UIkit.use(plugin);
}

export default plugin;
