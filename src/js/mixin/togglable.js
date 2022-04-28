import {
    $$,
    addClass,
    Animation,
    css,
    fastdom,
    hasClass,
    height,
    includes,
    isBoolean,
    isFunction,
    isVisible,
    noop,
    removeClass,
    toFloat,
    toggleClass,
    toNodes,
    Transition,
    trigger,
} from 'uikit-util';

export default {
    props: {
        cls: Boolean,
        animation: 'list',
        duration: Number,
        velocity: Number,
        origin: String,
        transition: String,
    },

    data: {
        cls: false,
        animation: [false],
        duration: 200,
        velocity: 0.2,
        origin: false,
        transition: 'ease',
        clsEnter: 'uk-togglabe-enter',
        clsLeave: 'uk-togglabe-leave',

        initProps: {
            overflow: '',
            height: '',
            paddingTop: '',
            paddingBottom: '',
            marginTop: '',
            marginBottom: '',
            boxShadow: '',
        },

        hideProps: {
            overflow: 'hidden',
            height: 0,
            paddingTop: 0,
            paddingBottom: 0,
            marginTop: 0,
            marginBottom: 0,
            boxShadow: 'none',
        },
    },

    computed: {
        hasAnimation({ animation }) {
            return !!animation[0];
        },

        hasTransition({ animation }) {
            return this.hasAnimation && animation[0] === true;
        },
    },

    methods: {
        toggleElement(targets, toggle, animate) {
            return new Promise((resolve) =>
                Promise.all(
                    toNodes(targets).map((el) => {
                        const show = isBoolean(toggle) ? toggle : !this.isToggled(el);

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

                        const cls = show ? this.clsEnter : this.clsLeave;

                        addClass(el, cls);

                        trigger(el, show ? 'show' : 'hide', [this]);

                        const done = () => {
                            removeClass(el, cls);
                            trigger(el, show ? 'shown' : 'hidden', [this]);
                            this.$update(el);
                        };

                        return promise
                            ? promise.then(done, () => {
                                  removeClass(el, cls);
                                  return Promise.reject();
                              })
                            : done();
                    })
                ).then(resolve, noop)
            );
        },

        isToggled(el = this.$el) {
            [el] = toNodes(el);
            return hasClass(el, this.clsEnter)
                ? true
                : hasClass(el, this.clsLeave)
                ? false
                : this.cls
                ? hasClass(el, this.cls.split(' ')[0])
                : isVisible(el);
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
                changed = toggled === el.hidden;
                changed && (el.hidden = !toggled);
            }

            $$('[autofocus]', el).some((el) => (isVisible(el) ? el.focus() || true : el.blur()));

            if (changed) {
                trigger(el, 'toggled', [toggled, this]);
                this.$update(el);
            }
        },
    },
};

export function toggleHeight({
    isToggled,
    duration,
    velocity,
    initProps,
    hideProps,
    transition,
    _toggle,
}) {
    return (el, show) => {
        const inProgress = Transition.inProgress(el);
        const inner = el.hasChildNodes()
            ? toFloat(css(el.firstElementChild, 'marginTop')) +
              toFloat(css(el.lastElementChild, 'marginBottom'))
            : 0;
        const currentHeight = isVisible(el) ? height(el) + (inProgress ? 0 : inner) : 0;

        Transition.cancel(el);

        if (!isToggled(el)) {
            _toggle(el, true);
        }

        height(el, '');

        // Update child components first
        fastdom.flush();

        const endHeight = height(el) + (inProgress ? 0 : inner);
        duration = velocity * el.offsetHeight + duration;

        height(el, currentHeight);

        return (
            show
                ? Transition.start(
                      el,
                      { ...initProps, overflow: 'hidden', height: endHeight },
                      Math.round(duration * (1 - currentHeight / endHeight)),
                      transition
                  )
                : Transition.start(
                      el,
                      hideProps,
                      Math.round(duration * (currentHeight / endHeight)),
                      transition
                  ).then(() => _toggle(el, false))
        ).then(() => css(el, initProps));
    };
}

function toggleAnimation(cmp) {
    return (el, show) => {
        Animation.cancel(el);

        const { animation, duration, _toggle } = cmp;

        if (show) {
            _toggle(el, true);
            return Animation.in(el, animation[0], duration, cmp.origin);
        }

        return Animation.out(el, animation[1] || animation[0], duration, cmp.origin).then(() =>
            _toggle(el, false)
        );
    };
}
