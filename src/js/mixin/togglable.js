import {$$, Animation, assign, attr, css, fastdom, hasAttr, hasClass, height, includes, isBoolean, isFunction, isVisible, noop, Promise, toFloat, toggleClass, toNodes, Transition, trigger} from 'uikit-util';

export default {

    props: {
        cls: Boolean,
        animation: 'list',
        duration: Number,
        origin: String,
        transition: String
    },

    data: {
        cls: false,
        animation: [false],
        duration: 200,
        origin: false,
        transition: 'linear',

        initProps: {
            overflow: '',
            height: '',
            paddingTop: '',
            paddingBottom: '',
            marginTop: '',
            marginBottom: ''
        },

        hideProps: {
            overflow: 'hidden',
            height: 0,
            paddingTop: 0,
            paddingBottom: 0,
            marginTop: 0,
            marginBottom: 0
        }

    },

    computed: {

        hasAnimation({animation}) {
            return !!animation[0];
        },

        hasTransition({animation}) {
            return this.hasAnimation && animation[0] === true;
        }

    },

    methods: {

        toggleElement(targets, show, animate) {
            return Promise.all(toNodes(targets).map(el =>
                new Promise(resolve =>
                    this._toggleElement(el, show, animate).then(resolve, noop)
                )
            ));
        },

        isToggled(el) {
            const nodes = toNodes(el || this.$el);
            return this.cls
                ? hasClass(nodes, this.cls.split(' ')[0])
                : !hasAttr(nodes, 'hidden');
        },

        updateAria(el) {
            if (this.cls === false) {
                attr(el, 'aria-hidden', !this.isToggled(el));
            }
        },

        _toggleElement(el, show, animate) {

            show = isBoolean(show)
                ? show
                : Animation.inProgress(el)
                    ? hasClass(el, 'uk-animation-leave')
                    : Transition.inProgress(el)
                        ? el.style.height === '0px'
                        : !this.isToggled(el);

            if (!trigger(el, `before${show ? 'show' : 'hide'}`, [this])) {
                return Promise.reject();
            }

            const promise = (
                isFunction(animate)
                    ? animate
                    : animate === false || !this.hasAnimation
                        ? this._toggle
                        : this.hasTransition
                            ? toggleHeight(this)
                            : toggleAnimation(this)
            )(el, show);

            trigger(el, show ? 'show' : 'hide', [this]);

            const final = () => {
                trigger(el, show ? 'shown' : 'hidden', [this]);
                this.$update(el);
            };

            return (promise || Promise.resolve()).then(final);
        },

        _toggle(el, toggled) {

            if (!el) {
                return;
            }

            toggled = Boolean(toggled);

            let changed;
            if (this.cls) {
                changed = includes(this.cls, ' ') || toggled !== hasClass(el, this.cls);
                changed && toggleClass(el, this.cls, includes(this.cls, ' ') ? undefined : toggled);
            } else {
                changed = toggled === hasAttr(el, 'hidden');
                changed && attr(el, 'hidden', !toggled ? '' : null);
            }

            $$('[autofocus]', el).some(el => isVisible(el) ? el.focus() || true : el.blur());

            this.updateAria(el);

            if (changed) {
                trigger(el, 'toggled', [this]);
                this.$update(el);
            }
        }

    }

};

export function toggleHeight({isToggled, duration, initProps, hideProps, transition, _toggle}) {
    return (el, show) => {

        const inProgress = Transition.inProgress(el);
        const inner = el.hasChildNodes ? toFloat(css(el.firstElementChild, 'marginTop')) + toFloat(css(el.lastElementChild, 'marginBottom')) : 0;
        const currentHeight = isVisible(el) ? height(el) + (inProgress ? 0 : inner) : 0;

        Transition.cancel(el);

        if (!isToggled(el)) {
            _toggle(el, true);
        }

        height(el, '');

        // Update child components first
        fastdom.flush();

        const endHeight = height(el) + (inProgress ? 0 : inner);
        height(el, currentHeight);

        return (show
            ? Transition.start(el, assign({}, initProps, {overflow: 'hidden', height: endHeight}), Math.round(duration * (1 - currentHeight / endHeight)), transition)
            : Transition.start(el, hideProps, Math.round(duration * (currentHeight / endHeight)), transition).then(() => _toggle(el, false))
        ).then(() => css(el, initProps));

    };
}

function toggleAnimation(cmp) {
    return (el, show) => {

        Animation.cancel(el);

        const {animation, duration, _toggle} = cmp;

        if (show) {
            _toggle(el, true);
            return Animation.in(el, animation[0], duration, cmp.origin);
        }

        return Animation.out(el, animation[1] || animation[0], duration, cmp.origin).then(() => _toggle(el, false));
    };
}
