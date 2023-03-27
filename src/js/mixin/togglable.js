import {
    $$,
    addClass,
    Animation,
    css,
    dimensions,
    hasClass,
    includes,
    isBoolean,
    isFunction,
    isVisible,
    noop,
    removeClass,
    startsWith,
    toFloat,
    toggleClass,
    toNode,
    toNodes,
    Transition,
    trigger,
    unwrap,
    wrapInner,
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
    },

    computed: {
        hasAnimation({ animation }) {
            return !!animation[0];
        },

        hasTransition({ animation }) {
            return ['slide', 'reveal'].some((transition) => startsWith(animation[0], transition));
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
                                ? toggleInstant
                                : this.hasTransition
                                ? toggleTransition
                                : toggleAnimation
                        )(el, show, this);

                        const cls = show ? this.clsEnter : this.clsLeave;

                        addClass(el, cls);

                        trigger(el, show ? 'show' : 'hide', [this]);

                        const done = () => {
                            removeClass(el, cls);
                            trigger(el, show ? 'shown' : 'hidden', [this]);
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
            el = toNode(el);
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
            }
        },
    },
};

function toggleInstant(el, show, { _toggle }) {
    Animation.cancel(el);
    Transition.cancel(el);
    return _toggle(el, show);
}

export async function toggleTransition(
    el,
    show,
    { animation, duration, velocity, transition, _toggle }
) {
    const [mode = 'reveal', startProp = 'top'] = animation[0]?.split('-') || [];

    const dirs = [
        ['left', 'right'],
        ['top', 'bottom'],
    ];
    const dir = dirs[includes(dirs[0], startProp) ? 0 : 1];
    const end = dir[1] === startProp;
    const props = ['width', 'height'];
    const dimProp = props[dirs.indexOf(dir)];
    const marginProp = `margin-${dir[0]}`;
    const marginStartProp = `margin-${startProp}`;

    let currentDim = dimensions(el)[dimProp];

    const inProgress = Transition.inProgress(el);
    await Transition.cancel(el);

    if (show) {
        _toggle(el, true);
    }

    const prevProps = Object.fromEntries(
        [
            'padding',
            'border',
            'width',
            'height',
            'minWidth',
            'minHeight',
            'overflowY',
            'overflowX',
            marginProp,
            marginStartProp,
        ].map((key) => [key, el.style[key]])
    );

    const dim = dimensions(el);
    const currentMargin = toFloat(css(el, marginProp));
    const marginStart = toFloat(css(el, marginStartProp));
    const endDim = dim[dimProp] + marginStart;

    if (!inProgress && !show) {
        currentDim += marginStart;
    }

    const [wrapper] = wrapInner(el, '<div>');
    css(wrapper, {
        boxSizing: 'border-box',
        height: dim.height,
        width: dim.width,
        ...css(el, [
            'overflow',
            'padding',
            'borderTop',
            'borderRight',
            'borderBottom',
            'borderLeft',
            'borderImage',
            marginStartProp,
        ]),
    });

    css(el, {
        padding: 0,
        border: 0,
        minWidth: 0,
        minHeight: 0,
        [marginStartProp]: 0,
        width: dim.width,
        height: dim.height,
        overflow: 'hidden',
        [dimProp]: currentDim,
    });

    const percent = currentDim / endDim;
    duration = (velocity * endDim + duration) * (show ? 1 - percent : percent);
    const endProps = { [dimProp]: show ? endDim : 0 };

    if (end) {
        css(el, marginProp, endDim - currentDim + currentMargin);
        endProps[marginProp] = show ? currentMargin : endDim + currentMargin;
    }

    if (!end ^ (mode === 'reveal')) {
        css(wrapper, marginProp, -endDim + currentDim);
        Transition.start(wrapper, { [marginProp]: show ? 0 : -endDim }, duration, transition);
    }

    try {
        await Transition.start(el, endProps, duration, transition);
    } finally {
        css(el, prevProps);
        unwrap(wrapper.firstChild);

        if (!show) {
            _toggle(el, false);
        }
    }
}

function toggleAnimation(el, show, cmp) {
    Animation.cancel(el);

    const { animation, duration, _toggle } = cmp;

    if (show) {
        _toggle(el, true);
        return Animation.in(el, animation[0], duration, cmp.origin);
    }

    return Animation.out(el, animation[1] || animation[0], duration, cmp.origin).then(() =>
        _toggle(el, false)
    );
}
