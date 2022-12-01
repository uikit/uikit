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
import { isSameSiteAnchor, preventBackgroundScroll, preventOverscroll } from '../mixin/modal';

export let active;

export default {
    mixins: [Container, Lazyload, Position, Togglable],

    args: 'pos',

    props: {
        mode: 'list',
        toggle: Boolean,
        boundary: Boolean,
        boundaryX: Boolean,
        boundaryY: Boolean,
        target: Boolean,
        targetX: Boolean,
        targetY: Boolean,
        stretch: Boolean,
        delayShow: Number,
        delayHide: Number,
        autoUpdate: Boolean,
        clsDrop: String,
        animateOut: Boolean,
        bgScroll: Boolean,
    },

    data: {
        mode: ['click', 'hover'],
        toggle: '- *',
        boundary: false,
        boundaryX: false,
        boundaryY: false,
        target: false,
        targetX: false,
        targetY: false,
        stretch: false,
        delayShow: 0,
        delayHide: 800,
        autoUpdate: true,
        clsDrop: false,
        animateOut: false,
        bgScroll: true,
        animation: ['uk-animation-fade'],
        cls: 'uk-open',
        container: false,
    },

    computed: {
        boundary({ boundary, boundaryX, boundaryY }, $el) {
            return [
                query(boundaryX || boundary, $el) || window,
                query(boundaryY || boundary, $el) || window,
            ];
        },

        target({ target, targetX, targetY }, $el) {
            targetX = targetX || target || this.targetEl;
            targetY = targetY || target || this.targetEl;

            return [
                targetX === true ? window : query(targetX, $el),
                targetY === true ? window : query(targetY, $el),
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

        this._style = (({ width, height }) => ({ width, height }))(this.$el.style);
    },

    disconnected() {
        if (this.isActive()) {
            this.hide(false);
            active = null;
        }
        css(this.$el, this._style);
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
                return 'a[href*="#"]';
            },

            handler({ defaultPrevented, current }) {
                const { hash } = current;
                if (
                    !defaultPrevented &&
                    hash &&
                    isSameSiteAnchor(current) &&
                    !within(hash, this.$el)
                ) {
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

                const update = () => this.$emit();
                const handlers = [
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

                    on(window, 'resize', update),

                    (() => {
                        const observer = observeResize(
                            scrollParents(this.$el).concat(this.target),
                            update
                        );
                        return () => observer.disconnect();
                    })(),

                    ...(this.autoUpdate
                        ? [
                              on([document, scrollParents(this.$el)], 'scroll', update, {
                                  passive: true,
                              }),
                          ]
                        : []),

                    ...(this.bgScroll
                        ? []
                        : [preventOverscroll(this.$el), preventBackgroundScroll()]),
                ];

                once(this.$el, 'hide', () => handlers.forEach((handler) => handler()), {
                    self: true,
                });
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
            css(this.$el, this._style);

            // Ensure none positioned element does not generate scrollbars
            this.$el.hidden = true;

            const viewports = this.target.map((target) => getViewport(this.$el, target));
            const viewportOffset = this.getViewportOffset(this.$el);

            const dirs = [
                [0, ['x', 'width', 'left', 'right']],
                [1, ['y', 'height', 'top', 'bottom']],
            ];

            for (const [i, [axis, prop]] of dirs) {
                if (this.axis !== axis && includes([axis, true], this.stretch)) {
                    css(this.$el, {
                        [prop]: Math.min(
                            offset(this.boundary[i])[prop],
                            viewports[i][prop] - 2 * viewportOffset
                        ),
                        [`overflow-${axis}`]: 'auto',
                    });
                }
            }

            const maxWidth = viewports[0].width - 2 * viewportOffset;

            if (this.$el.offsetWidth > maxWidth) {
                addClass(this.$el, `${this.clsDrop}-stack`);
            }

            css(this.$el, 'maxWidth', maxWidth);

            this.$el.hidden = false;

            this.positionAt(this.$el, this.target, this.boundary);

            for (const [i, [axis, prop, start, end]] of dirs) {
                if (this.axis === axis && includes([axis, true], this.stretch)) {
                    const positionOffset = Math.abs(this.getPositionOffset(this.$el));
                    const targetOffset = offset(this.target[i]);
                    const elOffset = offset(this.$el);

                    css(this.$el, {
                        [prop]:
                            (targetOffset[start] > elOffset[start]
                                ? targetOffset[start] -
                                  Math.max(
                                      offset(this.boundary[i])[start],
                                      viewports[i][start] + viewportOffset
                                  )
                                : Math.min(
                                      offset(this.boundary[i])[end],
                                      viewports[i][end] - viewportOffset
                                  ) - targetOffset[end]) - positionOffset,
                        [`overflow-${axis}`]: 'auto',
                    });

                    this.positionAt(this.$el, this.target, this.boundary);
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

function getViewport(el, target) {
    return offsetViewport(scrollParents(target).find((parent) => within(el, parent)));
}
