import {
    $,
    $$,
    MouseTracker,
    addClass,
    append,
    attr,
    css,
    hasClass,
    includes,
    isSameSiteAnchor,
    isTouch,
    matches,
    observeResize,
    observeViewportResize,
    offset,
    offsetViewport,
    on,
    once,
    overflowParents,
    parent,
    pick,
    pointerCancel,
    pointerDown,
    pointerEnter,
    pointerLeave,
    pointerUp,
    query,
    removeClass,
} from 'uikit-util';
import Container from '../mixin/container';
import Position, { storeScrollPosition } from '../mixin/position';
import Togglable from '../mixin/togglable';
import { keyMap } from '../util/keys';
import { preventBackgroundScroll } from '../util/scroll';

export let active;

export default {
    mixins: [Container, Position, Togglable],

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
        closeOnScroll: Boolean,
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
        closeOnScroll: false,
    },

    computed: {
        boundary({ boundary, boundaryX, boundaryY }, $el) {
            return [
                query(boundaryX || boundary, $el) || window,
                query(boundaryY || boundary, $el) || window,
            ];
        },

        target({ target, targetX, targetY }, $el) {
            targetX ||= target || this.targetEl;
            targetY ||= target || this.targetEl;

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
        this.clsDrop = this.$props.clsDrop || this.$options.id;
    },

    connected() {
        addClass(this.$el, 'uk-drop', this.clsDrop);

        if (this.toggle && !this.targetEl) {
            this.targetEl = createToggleComponent(this);
        }

        this._style = pick(this.$el.style, ['width', 'height']);
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

            delegate: () => '.uk-drop-close',

            handler(e) {
                e.preventDefault();
                this.hide(false);
            },
        },

        {
            name: 'click',

            delegate: () => 'a[href*="#"]',

            handler({ defaultPrevented, current }) {
                const { hash } = current;
                if (
                    !defaultPrevented &&
                    hash &&
                    isSameSiteAnchor(current) &&
                    !this.$el.contains($(hash))
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

            filter: ({ mode }) => includes(mode, 'hover'),

            handler(e) {
                if (!isTouch(e)) {
                    this.clearTimers();
                }
            },
        },

        {
            name: `${pointerLeave} focusout`,

            filter: ({ mode }) => includes(mode, 'hover'),

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
                if (toggled) {
                    this.clearTimers();
                    this.position();
                }
            },
        },

        {
            name: 'show',

            self: true,

            handler() {
                active = this;

                this.tracker.init();
                attr(this.targetEl, 'aria-expanded', true);

                const handlers = [
                    listenForResize(this),
                    listenForEscClose(this),
                    listenForBackgroundClose(this),
                    this.autoUpdate && listenForScroll(this),
                    this.closeOnScroll && listenForScrollClose(this),
                ];

                once(this.$el, 'hide', () => handlers.forEach((handler) => handler && handler()), {
                    self: true,
                });

                if (!this.bgScroll) {
                    once(this.$el, 'hidden', preventBackgroundScroll(this.$el), { self: true });
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
                        active === null && this.$el.contains(target) && this.isToggled()
                            ? this
                            : active;
                    return;
                }

                active = this.isActive() ? null : active;
                this.tracker.cancel();
                attr(this.targetEl, 'aria-expanded', null);
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
                if (delay && active.isDelaying()) {
                    this.showTimer = setTimeout(() => matches(target, ':hover') && this.show(), 10);
                    return;
                }

                let prev;
                while (active && prev !== active && !active.$el.contains(this.$el)) {
                    prev = active;
                    active.hide(false, false);
                }
            }

            if (this.container && parent(this.$el) !== this.container) {
                append(this.container, this.$el);
            }

            this.showTimer = setTimeout(
                () => this.toggleElement(this.$el, true),
                (delay && this.delayShow) || 0,
            );
        },

        hide(delay = true, animate = true) {
            const hide = () => this.toggleElement(this.$el, false, this.animateOut && animate);

            this.clearTimers();

            this.isDelayedHide = delay;

            if (delay && this.isDelaying()) {
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
        },

        isActive() {
            return active === this;
        },

        isDelaying() {
            return [this.$el, ...$$('.uk-drop', this.$el)].some((el) => this.tracker.movesTo(el));
        },

        position() {
            const restoreScrollPosition = storeScrollPosition(this.$el);

            removeClass(this.$el, 'uk-drop-stack');
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
                            viewports[i][prop] - 2 * viewportOffset,
                        ),
                        [`overflow-${axis}`]: 'auto',
                    });
                }
            }

            const maxWidth = viewports[0].width - 2 * viewportOffset;

            this.$el.hidden = false;

            css(this.$el, 'maxWidth', '');

            if (this.$el.offsetWidth > maxWidth) {
                addClass(this.$el, 'uk-drop-stack');
            }

            css(this.$el, 'maxWidth', maxWidth);

            this.positionAt(this.$el, this.target, this.boundary);

            for (const [i, [axis, prop, start, end]] of dirs) {
                if (this.axis === axis && includes([axis, true], this.stretch)) {
                    const positionOffset = Math.abs(this.getPositionOffset());
                    const targetOffset = offset(this.target[i]);
                    const elOffset = offset(this.$el);

                    css(this.$el, {
                        [prop]:
                            (targetOffset[start] > elOffset[start]
                                ? targetOffset[this.inset ? end : start] -
                                  Math.max(
                                      offset(this.boundary[i])[start],
                                      viewports[i][start] + viewportOffset,
                                  )
                                : Math.min(
                                      offset(this.boundary[i])[end],
                                      viewports[i][end] - viewportOffset,
                                  ) - targetOffset[this.inset ? start : end]) - positionOffset,
                        [`overflow-${axis}`]: 'auto',
                    });

                    this.positionAt(this.$el, this.target, this.boundary);
                }
            }

            restoreScrollPosition();
        },
    },
};

function getViewport(el, target) {
    return offsetViewport(overflowParents(target).find((parent) => parent.contains(el)));
}

function createToggleComponent(drop) {
    const { $el } = drop.$create('toggle', query(drop.toggle, drop.$el), {
        target: drop.$el,
        mode: drop.mode,
    });
    attr($el, 'aria-haspopup', true);

    return $el;
}

function listenForResize(drop) {
    const update = () => drop.$emit();
    const off = [
        observeViewportResize(update),
        observeResize(overflowParents(drop.$el).concat(drop.target), update),
    ];
    return () => off.map((observer) => observer.disconnect());
}

function listenForScroll(drop, fn = () => drop.$emit()) {
    return on([document, ...overflowParents(drop.$el)], 'scroll', fn, {
        passive: true,
    });
}

function listenForEscClose(drop) {
    return on(document, 'keydown', (e) => {
        if (e.keyCode === keyMap.ESC) {
            drop.hide(false);
        }
    });
}

function listenForScrollClose(drop) {
    return listenForScroll(drop, () => drop.hide(false));
}

function listenForBackgroundClose(drop) {
    return on(document, pointerDown, ({ target }) => {
        if (drop.$el.contains(target)) {
            return;
        }

        once(
            document,
            `${pointerUp} ${pointerCancel} scroll`,
            ({ defaultPrevented, type, target: newTarget }) => {
                if (
                    !defaultPrevented &&
                    type === pointerUp &&
                    target === newTarget &&
                    !drop.targetEl?.contains(target)
                ) {
                    drop.hide(false);
                }
            },
            true,
        );
    });
}
