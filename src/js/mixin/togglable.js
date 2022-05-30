import {
    $$,
    addClass,
    Animation,
    css,
    fastdom,
    hasClass,
    includes,
    isBoolean,
    isFunction,
    isVisible,
    noop,
    offset,
    removeClass,
    scrollParents,
    startsWith,
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
            maxHeight: '',
            paddingTop: '',
            paddingBottom: '',
            marginTop: '',
            marginBottom: '',
            boxShadow: '',
        },

        hideProps: {
            overflow: 'hidden',
            maxHeight: 0,
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
            return startsWith(animation[0], 'slide');
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
                                ? toggleInstant(this)
                                : this.hasTransition
                                ? toggleTransition(this)
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

function toggleInstant({ _toggle }) {
    return (el, show) => {
        Animation.cancel(el);
        Transition.cancel(el);
        return _toggle(el, show);
    };
}

function toggleTransition(cmp) {
    switch (cmp.animation[0]) {
        case 'slide-left':
            return slideHorizontal(cmp);
        case 'slide-right':
            return slideHorizontal(cmp, true);
    }
    return slide(cmp);
}

export function slide({
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
        const inner =
            !inProgress && el.hasChildNodes()
                ? toFloat(css(el.firstElementChild, 'marginTop')) +
                  toFloat(css(el.lastElementChild, 'marginBottom'))
                : 0;
        const currentHeight = isVisible(el) ? toFloat(css(el, 'height')) + inner : 0;

        const props = inProgress ? css(el, Object.keys(initProps)) : show ? hideProps : initProps;

        Transition.cancel(el);

        if (!isToggled(el)) {
            _toggle(el, true);
        }

        css(el, 'maxHeight', '');

        // Update child components first
        fastdom.flush();

        const endHeight = toFloat(css(el, 'height')) + inner;
        duration = velocity * endHeight + duration;

        css(el, { ...props, maxHeight: currentHeight });

        return (
            show
                ? Transition.start(
                      el,
                      { ...initProps, overflow: 'hidden', maxHeight: endHeight },
                      duration * (1 - currentHeight / endHeight),
                      transition
                  )
                : Transition.start(
                      el,
                      hideProps,
                      duration * (currentHeight / endHeight),
                      transition
                  ).then(() => _toggle(el, false))
        ).then(() => css(el, initProps));
    };
}

function slideHorizontal({ isToggled, duration, velocity, transition, _toggle }, right) {
    return (el, show) => {
        const visible = isVisible(el);
        const marginLeft = toFloat(css(el, 'marginLeft'));

        Transition.cancel(el);

        const [scrollElement] = scrollParents(el);
        css(scrollElement, 'overflowX', 'hidden');

        if (!isToggled(el)) {
            _toggle(el, true);
        }

        const width = toFloat(css(el, 'width'));
        duration = velocity * width + duration;

        const percent = visible ? ((width + marginLeft * (right ? -1 : 1)) / width) * 100 : 0;
        const offsetEl = offset(el);
        const useClipPath = right
            ? offsetEl.right < scrollElement.clientWidth
            : Math.round(offsetEl.left) > 0;

        css(el, {
            clipPath: useClipPath
                ? right
                    ? `polygon(0 0,${percent}% 0,${percent}% 100%,0 100%)`
                    : `polygon(${100 - percent}% 0,100% 0,100% 100%,${100 - percent}% 100%)`
                : '',
            marginLeft: (((100 - percent) * (right ? 1 : -1)) / 100) * width,
        });

        return (
            show
                ? Transition.start(
                      el,
                      {
                          clipPath: useClipPath ? `polygon(0 0,100% 0,100% 100%,0 100%)` : '',
                          marginLeft: 0,
                      },
                      duration * (1 - percent / 100),
                      transition
                  )
                : Transition.start(
                      el,
                      {
                          clipPath: useClipPath
                              ? right
                                  ? `polygon(0 0,0 0,0 100%,0 100%)`
                                  : `polygon(100% 0,100% 0,100% 100%,100% 100%)`
                              : '',
                          marginLeft: (right ? 1 : -1) * width,
                      },
                      duration * (percent / 100),
                      transition
                  ).then(() => _toggle(el, false))
        ).then(() => {
            css(scrollElement, 'overflowX', '');
            css(el, { clipPath: '', marginLeft: '' });
        });
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
