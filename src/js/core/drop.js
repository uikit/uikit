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
    toggleClass,
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
        boundaryAlign: Boolean,
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
        boundary: true,
        boundaryAlign: false,
        delayShow: 0,
        delayHide: 800,
        display: null,
        clsDrop: false,
        animation: ['uk-animation-fade'],
        cls: 'uk-open',
        container: false,
        animateOut: false,
        bgScroll: true,
    },

    created() {
        this.tracker = new MouseTracker();
    },

    beforeConnect() {
        this.clsDrop = this.$props.clsDrop || `uk-${this.$options.name}`;
    },

    connected() {
        addClass(this.$el, this.clsDrop);

        if (this.toggle && !this.target) {
            this.target = this.$create('toggle', query(this.toggle, this.$el), {
                target: this.$el,
                mode: this.mode,
            }).$el;
            attr(this.target, 'aria-haspopup', true);
            this.lazyload(this.target);
        }
    },

    disconnected() {
        if (this.isActive()) {
            active = null;
        }
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
                                        !(this.target && within(target, this.target))
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

                    ...(this.display === 'static' && this.align !== 'stretch'
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
        show(target = this.target, delay = true) {
            if (this.isToggled() && target && this.target && target !== this.target) {
                this.hide(false, false);
            }

            this.target = target;

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
            toggleClass(this.$el, `${this.clsDrop}-boundary`, this.boundaryAlign);
            toggleClass(this.$el, `${this.clsDrop}-stretch`, this.align === 'stretch');

            const boundary = query(this.boundary, this.$el);
            const target = boundary && this.boundaryAlign ? boundary : this.target;
            const [scrollParent] = scrollParents(
                boundary && this.boundaryAlign ? boundary : this.$el
            );
            const scrollParentOffset = offset(scrollParent);
            const boundaryOffset = boundary ? offset(boundary) : scrollParentOffset;
            const viewportOffset = this.getViewportOffset(this.$el);

            css(this.$el, 'maxWidth', '');
            const maxWidth = scrollParentOffset.width - 2 * viewportOffset;

            if (this.align === 'justify') {
                const prop = this.axis === 'y' ? 'width' : 'height';
                css(
                    this.$el,
                    prop,
                    Math.min(
                        (boundary ? boundaryOffset : offset(this.target))[prop],
                        scrollParentOffset[prop] - 2 * viewportOffset
                    )
                );
            } else if (this.align === 'stretch') {
                this.flip = this.axis === 'y' ? 'x' : 'y';
                this.display = 'static';

                const viewport = offsetViewport(scrollParent);
                const targetDim = offset(target);
                const elOffset = Math.abs(this.getPositionOffset(this.$el)) + viewportOffset;

                css(this.$el, {
                    width:
                        this.axis === 'y'
                            ? viewport.width
                            : (this.dir === 'left'
                                  ? targetDim.left - viewport.left
                                  : viewport.right - targetDim.right) - elOffset,
                    height:
                        this.axis === 'x'
                            ? viewport.height
                            : (this.dir === 'top'
                                  ? targetDim.top - viewport.top
                                  : viewport.bottom - targetDim.bottom) - elOffset,
                });
            } else if (this.$el.offsetWidth > maxWidth) {
                addClass(this.$el, `${this.clsDrop}-stack`);
            }

            css(this.$el, 'maxWidth', maxWidth);

            this.positionAt(this.$el, target, boundary);
        },
    },
};

function getPositionedElements(el) {
    const result = [];
    apply(el, (el) => css(el, 'position') !== 'static' && result.push(el));
    return result;
}
