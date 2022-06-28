import {
    $$,
    addClass,
    Animation,
    css,
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
    toNodes,
    Transition,
    trigger,
    ucfirst,
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

export function toggleTransition(cmp) {
    let { animation, static: isStatic = true } = cmp;
    const [mode, startProp = 'top'] = animation[0].split('-');
    isStatic = isStatic || mode === 'slide';

    const dirs = [
        ['left', 'right'],
        ['top', 'bottom'],
    ];
    const props = ['width', 'height'];
    const dir = dirs[includes(dirs[0], startProp) ? 0 : 1];
    const end = dir[1] === startProp;
    const endProp = dir[end ? 0 : 1];
    const dimProp = props[dirs.indexOf(dir)];

    const useWrapper = isStatic || end || dirs[0] === dir;

    // TODO add border props
    const getBoxProps = (value) =>
        useWrapper
            ? { padding: value, margin: value }
            : {
                  [`padding${ucfirst(startProp)}`]: value,
                  [`padding${ucfirst(endProp)}`]: value,
                  [`margin${ucfirst(startProp)}`]: value,
                  [`margin${ucfirst(endProp)}`]: value,
              };

    const initProps = { [dimProp]: '', ...getBoxProps(''), boxShadow: '' };
    const hideProps = { [dimProp]: 0, ...getBoxProps(0), boxShadow: 'none' };

    const getBoxDim = (el, outer) => {
        if (!isVisible(el)) {
            return { width: 0, height: 0 };
        }

        const dim = {};
        for (const [i, prop] of Object.entries(props)) {
            const startProp = ucfirst(dirs[i][0]);
            const endProp = ucfirst(dirs[i][1]);
            dim[prop] =
                toFloat(css(el, prop)) +
                (outer
                    ? toFloat(css(el, `margin${startProp}`)) +
                      toFloat(css(el, `margin${endProp}`)) +
                      toFloat(css(el, `border${startProp}Width`)) +
                      toFloat(css(el, `border${endProp}Width`))
                    : 0);
        }

        return dim;
    };

    return async (el, show) => {
        let { isToggled, duration, velocity, transition, _toggle } = cmp;

        const inProgress = Transition.inProgress(el);
        const currentDim = getBoxDim(el, !inProgress && isStatic)[dimProp];
        const props = inProgress ? css(el, Object.keys(initProps)) : show ? hideProps : initProps;

        const referenceEl = inProgress && useWrapper ? el.firstElementChild : el;

        Transition.cancel([el, referenceEl]);

        if (!isToggled(el)) {
            _toggle(el, true);
        }

        if (inProgress && !useWrapper) {
            css(el, { ...initProps });
        }

        const dim = getBoxDim(referenceEl, isStatic && !inProgress);

        if (useWrapper && !inProgress) {
            const wrapper = wrapInner(el, '<div>');

            css(wrapper, { ...css(el, ['boxSizing']), ...dim });
            if (isStatic) {
                css(wrapper, css(el, Object.keys(getBoxProps(''))));
            }
        }

        const endDim = toFloat(dim[dimProp]);
        const percent = currentDim / endDim;

        duration = (velocity * endDim + duration) * (show ? 1 - percent : percent);

        css(el, {
            ...props,
            overflow: 'hidden',
            [dimProp]: currentDim,
            [`min-${dimProp}`]: 0,
        });

        let endProps = show ? { ...initProps, [dimProp]: endDim } : hideProps;

        if (isStatic) {
            const hideBoxProps = getBoxProps(0);
            css(el, hideBoxProps);
            endProps = { ...endProps, ...hideBoxProps };
        }
        if (end) {
            const marginProp = `margin${ucfirst(dir[0])}`;
            css(el, marginProp, endDim * (1 - percent));
            endProps[marginProp] = show ? 0 : endDim;
        }

        if (!end ^ (mode === 'reveal')) {
            const marginProp = `margin${ucfirst(dir[0])}`;
            const wrapper = el.firstElementChild;
            css(wrapper, marginProp, -endDim * (1 - percent));
            Transition.start(
                wrapper,
                { [marginProp]: show ? 0 : -endDim },
                duration,
                transition
            ).catch(noop);
        }

        await Transition.start(el, endProps, duration, transition);

        if (!show) {
            _toggle(el, false);
        }

        css(el, { ...initProps, overflow: '', [`min-${dimProp}`]: '' });

        if (useWrapper) {
            unwrap(el.firstElementChild.firstChild);
        }
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
