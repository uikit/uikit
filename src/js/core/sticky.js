import Class from '../mixin/class';
import Media from '../mixin/media';
import Resize from '../mixin/resize';
import Scroll from '../mixin/scroll';
import {
    $,
    addClass,
    after,
    Animation,
    clamp,
    css,
    dimensions,
    height as getHeight,
    offset as getOffset,
    intersectRect,
    isNumeric,
    isString,
    isVisible,
    noop,
    offsetPosition,
    parent,
    query,
    remove,
    removeClass,
    replaceClass,
    scrollTop,
    toFloat,
    toggleClass,
    toPx,
    trigger,
    within,
} from 'uikit-util';

export default {
    mixins: [Class, Media, Resize, Scroll],

    props: {
        position: String,
        top: null,
        bottom: null,
        start: null,
        end: null,
        offset: String,
        overflowFlip: Boolean,
        animation: String,
        clsActive: String,
        clsInactive: String,
        clsFixed: String,
        clsBelow: String,
        selTarget: String,
        showOnUp: Boolean,
        targetOffset: Number,
    },

    data: {
        position: 'top',
        top: false,
        bottom: false,
        start: false,
        end: false,
        offset: 0,
        overflowFlip: false,
        animation: '',
        clsActive: 'uk-active',
        clsInactive: '',
        clsFixed: 'uk-sticky-fixed',
        clsBelow: 'uk-sticky-below',
        selTarget: '',
        showOnUp: false,
        targetOffset: false,
    },

    computed: {
        selTarget({ selTarget }, $el) {
            return (selTarget && $(selTarget, $el)) || $el;
        },
    },

    resizeTargets() {
        return document.documentElement;
    },

    connected() {
        this.start = coerce(this.start || this.top);
        this.end = coerce(this.end || this.bottom);

        this.placeholder =
            $('+ .uk-sticky-placeholder', this.$el) ||
            $('<div class="uk-sticky-placeholder"></div>');
        this.isFixed = false;
        this.setActive(false);
    },

    disconnected() {
        if (this.isFixed) {
            this.hide();
            removeClass(this.selTarget, this.clsInactive);
        }

        remove(this.placeholder);
        this.placeholder = null;
    },

    events: [
        {
            name: 'resize',

            el() {
                return window;
            },

            handler() {
                this.$emit('resize');
            },
        },
        {
            name: 'load hashchange popstate',

            el() {
                return window;
            },

            filter() {
                return this.targetOffset !== false;
            },

            handler() {
                if (!location.hash || scrollTop(window) === 0) {
                    return;
                }

                setTimeout(() => {
                    const targetOffset = getOffset($(location.hash));
                    const elOffset = getOffset(this.$el);

                    if (this.isFixed && intersectRect(targetOffset, elOffset)) {
                        scrollTop(
                            window,
                            targetOffset.top -
                                elOffset.height -
                                toPx(this.targetOffset, 'height', this.placeholder) -
                                toPx(this.offset, 'height', this.placeholder)
                        );
                    }
                });
            },
        },
    ],

    update: [
        {
            read({ height, margin }, types) {
                this.inactive = !this.matchMedia || !isVisible(this.$el);

                if (this.inactive) {
                    return false;
                }

                const hide = this.active && types.has('resize');
                if (hide) {
                    css(this.selTarget, 'transition', '0s');
                    this.hide();
                }

                if (!this.active) {
                    height = getOffset(this.$el).height;
                    margin = css(this.$el, 'margin');
                }

                if (hide) {
                    this.show();
                    requestAnimationFrame(() => css(this.selTarget, 'transition', ''));
                }

                const referenceElement = this.isFixed ? this.placeholder : this.$el;
                const windowHeight = getHeight(window);

                let position = this.position;
                if (this.overflowFlip && height > windowHeight) {
                    position = position === 'top' ? 'bottom' : 'top';
                }

                let offset = toPx(this.offset, 'height', referenceElement);
                if (position === 'bottom' && (height < windowHeight || this.overflowFlip)) {
                    offset += windowHeight - height;
                }

                const overflow = this.overflowFlip
                    ? 0
                    : Math.max(0, height + offset - windowHeight);
                const topOffset = getOffset(referenceElement).top;

                const start =
                    (this.start === false
                        ? topOffset
                        : parseProp(this.start, this.$el, topOffset)) - offset;
                const end =
                    this.end === false
                        ? document.scrollingElement.scrollHeight - windowHeight
                        : parseProp(this.end, this.$el, topOffset + height, true) -
                          getOffset(this.$el).height +
                          overflow -
                          offset;

                return {
                    start,
                    end,
                    offset,
                    overflow,
                    topOffset,
                    height,
                    margin,
                    width: dimensions(referenceElement).width,
                    top: offsetPosition(referenceElement)[0],
                };
            },

            write({ height, margin }) {
                const { placeholder } = this;

                css(placeholder, { height, margin });

                if (!within(placeholder, document)) {
                    after(this.$el, placeholder);
                    placeholder.hidden = true;
                }
            },

            events: ['resize'],
        },

        {
            read({
                scroll: prevScroll = 0,
                dir: prevDir = 'down',
                overflow,
                overflowScroll = 0,
                start,
                end,
            }) {
                const scroll = scrollTop(window);
                const dir = prevScroll <= scroll ? 'down' : 'up';

                return {
                    dir,
                    prevDir,
                    scroll,
                    prevScroll,
                    offsetParentTop: getOffset(
                        (this.isFixed ? this.placeholder : this.$el).offsetParent
                    ).top,
                    overflowScroll: clamp(
                        overflowScroll + clamp(scroll, start, end) - clamp(prevScroll, start, end),
                        0,
                        overflow
                    ),
                };
            },

            write(data, types) {
                const isScrollUpdate = types.has('scroll');
                const {
                    initTimestamp = 0,
                    dir,
                    prevDir,
                    scroll,
                    prevScroll = 0,
                    top,
                    start,
                    topOffset,
                    height,
                } = data;

                if (
                    scroll < 0 ||
                    (scroll === prevScroll && isScrollUpdate) ||
                    (this.showOnUp && !isScrollUpdate && !this.isFixed)
                ) {
                    return;
                }

                const now = Date.now();
                if (now - initTimestamp > 300 || dir !== prevDir) {
                    data.initScroll = scroll;
                    data.initTimestamp = now;
                }

                if (
                    this.showOnUp &&
                    !this.isFixed &&
                    Math.abs(data.initScroll - scroll) <= 30 &&
                    Math.abs(prevScroll - scroll) <= 10
                ) {
                    return;
                }

                if (
                    this.inactive ||
                    scroll < start ||
                    (this.showOnUp &&
                        (scroll <= start ||
                            (dir === 'down' && isScrollUpdate) ||
                            (dir === 'up' && !this.isFixed && scroll <= topOffset + height)))
                ) {
                    if (!this.isFixed) {
                        if (Animation.inProgress(this.$el) && top > scroll) {
                            Animation.cancel(this.$el);
                            this.hide();
                        }

                        return;
                    }

                    this.isFixed = false;

                    if (this.animation && scroll > topOffset) {
                        Animation.cancel(this.$el);
                        Animation.out(this.$el, this.animation).then(() => this.hide(), noop);
                    } else {
                        this.hide();
                    }
                } else if (this.isFixed) {
                    this.update();
                } else if (this.animation && scroll > topOffset) {
                    Animation.cancel(this.$el);
                    this.show();
                    Animation.in(this.$el, this.animation).catch(noop);
                } else {
                    this.show();
                }
            },

            events: ['resize', 'scroll'],
        },
    ],

    methods: {
        show() {
            this.isFixed = true;
            this.update();
            this.placeholder.hidden = false;
        },

        hide() {
            this.setActive(false);
            removeClass(this.$el, this.clsFixed, this.clsBelow);
            css(this.$el, { position: '', top: '', width: '' });
            this.placeholder.hidden = true;
        },

        update() {
            let {
                width,
                scroll = 0,
                overflow,
                overflowScroll = 0,
                start,
                end,
                offset,
                topOffset,
                height,
                offsetParentTop,
            } = this._data;
            const active = start !== 0 || scroll > start;
            let position = 'fixed';

            if (scroll > end) {
                offset += end - offsetParentTop;
                position = 'absolute';
            }

            if (overflow) {
                offset -= overflowScroll;
            }

            css(this.$el, {
                position,
                top: `${offset}px`,
                width,
            });

            this.setActive(active);
            toggleClass(this.$el, this.clsBelow, scroll > topOffset + height);
            addClass(this.$el, this.clsFixed);
        },

        setActive(active) {
            const prev = this.active;
            this.active = active;
            if (active) {
                replaceClass(this.selTarget, this.clsInactive, this.clsActive);
                prev !== active && trigger(this.$el, 'active');
            } else {
                replaceClass(this.selTarget, this.clsActive, this.clsInactive);
                prev !== active && trigger(this.$el, 'inactive');
            }
        },
    },
};

function parseProp(value, el, propOffset, padding) {
    if (!value) {
        return 0;
    }

    if (isNumeric(value) || (isString(value) && value.match(/^-?\d/))) {
        return propOffset + toPx(value, 'height', el, true);
    } else {
        const refElement = value === true ? parent(el) : query(value, el);
        return (
            getOffset(refElement).bottom -
            (padding && refElement && within(el, refElement)
                ? toFloat(css(refElement, 'paddingBottom'))
                : 0)
        );
    }
}

function coerce(value) {
    if (value === 'true') {
        return true;
    } else if (value === 'false') {
        return false;
    }
    return value;
}
