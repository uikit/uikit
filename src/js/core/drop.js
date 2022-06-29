import Container from '../mixin/container';
import Lazyload from '../mixin/lazyload';
import Position from '../mixin/position';
import Togglable from '../mixin/togglable';
import {
    addClass,
    append,
    apply,
    attr,
    css,
    hasClass,
    includes,
    isTouch,
    matches,
    MouseTracker,
    observeResize,
    offset,
    offsetViewport,
    on,
    once,
    parent,
    pointerCancel,
    pointerDown,
    pointerEnter,
    pointerLeave,
    pointerUp,
    query,
    removeClass,
    scrollParents,
    within,
} from 'uikit-util';
import { preventBackgroundScroll, preventOverscroll } from '../mixin/modal';

export let active;

export default {
    mixins: [Container, Lazyload, Position, Togglable],

    args: 'pos',

    props: {
        mode: 'list',
        toggle: Boolean,
        boundary: Boolean,
        target: Boolean,
        targetX: Boolean,
        targetY: Boolean,
        stretch: Boolean,
        delayShow: Number,
        delayHide: Number,
        display: String,
        clsDrop: String,
        animateOut: Boolean,
        bgScroll: Boolean,
    },

    data: {
        mode: ['click', 'hover'],
        toggle: '- *',
        boundary: false,
        target: false,
        targetX: false,
        targetY: false,
        stretch: false,
        delayShow: 0,
        delayHide: 800,
        display: null,
        clsDrop: false,
        animateOut: false,
        bgScroll: true,
        animation: ['uk-animation-fade'],
        cls: 'uk-open',
        container: false,
    },

    computed: {
        target({ target, targetX, targetY }, $el) {
            return [
                query(targetX || target || this.targetEl, $el),
                query(targetY || target || this.targetEl, $el),
            ];
        },
    },

    created() {
        this.tracker = new MouseTracker();
    },

    beforeConnect() {
        this.clsDrop = this.$props.clsDrop || `uk-${this.$options.name}`;
    },

    connected() {
        addClass(this.$el, this.clsDrop);

        if (this.toggle && !this.targetEl) {
            this.targetEl = this.$create('toggle', query(this.toggle, this.$el), {
                target: this.$el,
                mode: this.mode,
            }).$el;
            attr(this.targetEl, 'aria-haspopup', true);
            this.lazyload(this.targetEl);
        }
    },

    disconnected() {
        if (this.isActive()) {
            active = null;
        }
        this.targetEl = null;
    },

    events: [
        {
            name: 'click',

            delegate() {
                return `.${this.clsDrop}-close`;
            },

            handler(e) {
                e.preventDefault();
                this.hide(false);
            },
        },

        {
            name: 'click',

            delegate() {
                return 'a[href^="#"]';
            },

            handler({ defaultPrevented, current: { hash } }) {
                if (!defaultPrevented && hash && !within(hash, this.$el)) {
                    this.hide(false);
                }
            },
        },

        {
            name: 'beforescroll',

            handler() {
                this.hide(false);
            },
        },

        {
            name: 'toggle',

            self: true,

            handler(e, toggle) {
                e.preventDefault();

                if (this.isToggled()) {
                    this.hide(false);
                } else {
                    this.show(toggle?.$el, false);
                }
            },
        },

        {
            name: 'toggleshow',

            self: true,

            handler(e, toggle) {
                e.preventDefault();
                this.show(toggle?.$el);
            },
        },

        {
            name: 'togglehide',

            self: true,

            handler(e) {
                e.preventDefault();
                if (!matches(this.$el, ':focus,:hover')) {
                    this.hide();
                }
            },
        },

        {
            name: `${pointerEnter} focusin`,

            filter() {
                return includes(this.mode, 'hover');
            },

            handler(e) {
                if (!isTouch(e)) {
                    this.clearTimers();
                }
            },
        },

        {
            name: `${pointerLeave} focusout`,

            filter() {
                return includes(this.mode, 'hover');
            },

            handler(e) {
                if (!isTouch(e) && e.relatedTarget) {
                    this.hide();
                }
            },
        },

        {
            name: 'toggled',

            self: true,

            handler(e, toggled) {
                if (!toggled) {
                    return;
                }

                this.clearTimers();
                this.position();
            },
        },

        {
            name: 'show',

            self: true,

            handler() {
                active = this;

                this.tracker.init();

                for (const handler of [
                    on(
                        document,
                        pointerDown,
                        ({ target }) =>
                            !within(target, this.$el) &&
                            once(
                                document,
                                `${pointerUp} ${pointerCancel} scroll`,
                                ({ defaultPrevented, type, target: newTarget }) => {
                                    if (
                                        !defaultPrevented &&
                                        type === pointerUp &&
                                        target === newTarget &&
                                        !(this.targetEl && within(target, this.targetEl))
                                    ) {
                                        this.hide(false);
                                    }
                                },
                                true
                            )
                    ),

                    on(document, 'keydown', (e) => {
                        if (e.keyCode === 27) {
                            this.hide(false);
                        }
                    }),

                    ...(this.bgScroll
                        ? []
                        : [preventOverscroll(this.$el), preventBackgroundScroll()]),

                    ...(this.display === 'static'
                        ? []
                        : (() => {
                              const handler = () => this.$emit();
                              return [
                                  on(window, 'resize', handler),
                                  on(document, 'scroll', handler, true),
                                  (() => {
                                      const observer = observeResize(
                                          scrollParents(this.$el),
                                          handler
                                      );
                                      return () => observer.disconnect();
                                  })(),
                              ];
                          })()),
                ]) {
                    once(this.$el, 'hide', handler, { self: true });
                }
            },
        },

        {
            name: 'beforehide',

            self: true,

            handler() {
                this.clearTimers();
            },
        },

        {
            name: 'hide',

            handler({ target }) {
                if (this.$el !== target) {
                    active =
                        active === null && within(target, this.$el) && this.isToggled()
                            ? this
                            : active;
                    return;
                }

                active = this.isActive() ? null : active;
                this.tracker.cancel();
            },
        },
    ],

    update: {
        write() {
            if (this.isToggled() && !hasClass(this.$el, this.clsEnter)) {
                this.position();
            }
        },
    },

    methods: {
        show(target = this.targetEl, delay = true) {
            if (this.isToggled() && target && this.targetEl && target !== this.targetEl) {
                this.hide(false, false);
            }

            this.targetEl = target;

            this.clearTimers();

            if (this.isActive()) {
                return;
            }

            if (active) {
                if (delay && active.isDelaying) {
                    this.showTimer = setTimeout(() => matches(target, ':hover') && this.show(), 10);
                    return;
                }

                let prev;
                while (active && prev !== active && !within(this.$el, active.$el)) {
                    prev = active;
                    active.hide(false, false);
                }
            }

            if (this.container && parent(this.$el) !== this.container) {
                append(this.container, this.$el);
            }

            this.showTimer = setTimeout(
                () => this.toggleElement(this.$el, true),
                (delay && this.delayShow) || 0
            );
        },

        hide(delay = true, animate = true) {
            const hide = () => this.toggleElement(this.$el, false, this.animateOut && animate);

            this.clearTimers();

            this.isDelaying = getPositionedElements(this.$el).some((el) =>
                this.tracker.movesTo(el)
            );

            if (delay && this.isDelaying) {
                this.hideTimer = setTimeout(this.hide, 50);
            } else if (delay && this.delayHide) {
                this.hideTimer = setTimeout(hide, this.delayHide);
            } else {
                hide();
            }
        },

        clearTimers() {
            clearTimeout(this.showTimer);
            clearTimeout(this.hideTimer);
            this.showTimer = null;
            this.hideTimer = null;
            this.isDelaying = false;
        },

        isActive() {
            return active === this;
        },

        position() {
            removeClass(this.$el, `${this.clsDrop}-stack`);
            css(this.$el, { width: '', height: '', maxWidth: '' });

            const boundary = query(this.boundary, this.$el);
            const viewportOffset = this.getViewportOffset(this.$el);

            // Ensure none positioned element does not generate scrollbars
            this.$el.hidden = true;

            const dirs = [
                ['x', 'width', 'left', 'right'],
                ['y', 'height', 'top', 'bottom'],
            ];

            for (const i in dirs) {
                const [axis, prop] = dirs[i];

                if (this.axis !== axis && includes([axis, true], this.stretch)) {
                    css(
                        this.$el,
                        prop,
                        offsetViewport(boundary || scrollParents(this.target[i])[0])[prop] -
                            2 * viewportOffset
                    );
                }
            }

            const maxWidth =
                offsetViewport(scrollParents(this.target[0])[0]).width - 2 * viewportOffset;

            this.$el.hidden = false;

            if (this.$el.offsetWidth > maxWidth) {
                addClass(this.$el, `${this.clsDrop}-stack`);
            }

            css(this.$el, 'maxWidth', maxWidth);

            this.positionAt(this.$el, this.target, boundary);

            for (const i in dirs) {
                const [axis, prop, start, end] = dirs[i];

                if (this.axis === axis && includes([axis, true], this.stretch)) {
                    const elOffset = Math.abs(this.getPositionOffset(this.$el)) + viewportOffset;
                    const targetDim = offset(this.target[i]);
                    const boundaryOffset = offsetViewport(
                        boundary || scrollParents(this.target[i])[0]
                    );

                    css(
                        this.$el,
                        prop,
                        (getDir(this.$el, this.target[i]) === start
                            ? targetDim[start] - boundaryOffset[start]
                            : boundaryOffset[end] - targetDim[end]) - elOffset
                    );

                    this.positionAt(this.$el, this.target, boundary);
                }
            }
        },
    },
};

function getPositionedElements(el) {
    const result = [];
    apply(el, (el) => css(el, 'position') !== 'static' && result.push(el));
    return result;
}

function getDir(el, target) {
    const properties = [
        ['left', 'right'],
        ['top', 'bottom'],
    ];

    const elOffset = offset(el);
    const targetOffset = offset(target);

    for (const props of properties) {
        if (elOffset[props[0]] >= targetOffset[props[1]]) {
            return props[1];
        }
        if (elOffset[props[1]] <= targetOffset[props[0]]) {
            return props[0];
        }
    }
}
