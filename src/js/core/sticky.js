import Class from '../mixin/class';
import Media from '../mixin/media';
import {$, addClass, after, Animation, clamp, css, dimensions, fastdom, height as getHeight, getScrollingElement, hasClass, isNumeric, isString, isVisible, noop, offset, offsetPosition, parent, query, remove, removeClass, replaceClass, scrollTop, toggleClass, toPx, trigger, within} from 'uikit-util';

export default {

    mixins: [Class, Media],

    props: {
        position: String,
        top: null,
        bottom: Boolean,
        offset: String,
        animation: String,
        clsActive: String,
        clsInactive: String,
        clsFixed: String,
        clsBelow: String,
        selTarget: String,
        widthElement: Boolean,
        showOnUp: Boolean,
        targetOffset: Number
    },

    data: {
        position: 'top',
        top: 0,
        bottom: false,
        offset: 0,
        animation: '',
        clsActive: 'uk-active',
        clsInactive: '',
        clsFixed: 'uk-sticky-fixed',
        clsBelow: 'uk-sticky-below',
        selTarget: '',
        widthElement: false,
        showOnUp: false,
        targetOffset: false
    },

    computed: {

        position({position}, $el) {
            return position === 'auto'
                ? (this.isFixed ? this.placeholder : $el).offsetHeight > getHeight(window)
                    ? 'bottom'
                    : 'top'
                : position;
        },

        offset({offset}, $el) {
            if (this.position === 'bottom') {
                offset += '+100vh-100%';
            }
            return toPx(offset, 'height', $el);
        },

        selTarget({selTarget}, $el) {
            return selTarget && $(selTarget, $el) || $el;
        },

        widthElement({widthElement}, $el) {
            return query(widthElement, $el) || this.placeholder;
        },

        isActive: {

            get() {
                return hasClass(this.selTarget, this.clsActive);
            },

            set(value) {
                if (value && !this.isActive) {
                    replaceClass(this.selTarget, this.clsInactive, this.clsActive);
                    trigger(this.$el, 'active');
                } else if (!value && !hasClass(this.selTarget, this.clsInactive)) {
                    replaceClass(this.selTarget, this.clsActive, this.clsInactive);
                    trigger(this.$el, 'inactive');
                }
            }

        }

    },

    connected() {
        this.placeholder = $('+ .uk-sticky-placeholder', this.$el) || $('<div class="uk-sticky-placeholder"></div>');
        this.isFixed = false;
        this.isActive = false;
    },

    disconnected() {

        if (this.isFixed) {
            this.hide();
            removeClass(this.selTarget, this.clsInactive);
        }

        remove(this.placeholder);
        this.placeholder = null;
        this.widthElement = null;
    },

    events: [

        {

            name: 'load hashchange popstate',

            el() {
                return window;
            },

            handler() {

                if (!(this.targetOffset !== false && location.hash && scrollTop(window) > 0)) {
                    return;
                }

                const target = $(location.hash);

                if (target) {
                    fastdom.read(() => {

                        const {top} = offset(target);
                        const elTop = offset(this.$el).top;
                        const elHeight = this.$el.offsetHeight;

                        if (this.isFixed && elTop + elHeight >= top && elTop <= top + target.offsetHeight) {
                            scrollTop(window, top - elHeight - (isNumeric(this.targetOffset) ? this.targetOffset : 0) - this.offset);
                        }

                    });
                }

            }

        }

    ],

    update: [

        {

            read({height, margin}, types) {

                this.inactive = !this.matchMedia || !isVisible(this.$el);

                if (this.inactive) {
                    return false;
                }

                const hide = this.isActive && types.has('resize');
                if (hide) {
                    this.hide();
                }

                if (!this.isActive) {
                    height = this.$el.offsetHeight;
                    margin = css(this.$el, 'margin');
                }

                if (hide) {
                    this.show();
                }

                const overflow = Math.max(0, height + this.offset - getHeight(window));

                const referenceElement = this.isFixed ? this.placeholder : this.$el;
                const topOffset = offset(referenceElement).top;
                const offsetParentTop = offset(referenceElement.offsetParent).top;

                const top = parseProp(this.top, this.$el, topOffset);
                const bottom = parseProp(this.bottom, this.$el, topOffset + height);

                const start = Math.max(top, topOffset) - this.offset;
                const end = bottom
                    ? bottom - this.$el.offsetHeight + overflow - this.offset
                    : getScrollingElement(this.$el).scrollHeight - getHeight(window);

                return {
                    start,
                    end,
                    overflow,
                    topOffset,
                    offsetParentTop,
                    height,
                    margin,
                    width: dimensions(isVisible(this.widthElement) ? this.widthElement : this.$el).width,
                    top: offsetPosition(this.placeholder)[0]
                };
            },

            write({height, margin}) {

                const {placeholder} = this;

                css(placeholder, {height, margin});

                if (!within(placeholder, document)) {
                    after(this.$el, placeholder);
                    placeholder.hidden = true;
                }

                this.isActive = !!this.isActive; // force self-assign

            },

            events: ['resize']

        },

        {

            read({scroll: prevScroll = 0, dir: prevDir = 'down', overflow, overflowScroll = 0, start, end}) {

                const scroll = scrollTop(window);
                const dir = prevScroll <= scroll ? 'down' : 'up';

                return {
                    dir,
                    prevDir,
                    scroll,
                    prevScroll,
                    overflowScroll: clamp(
                        overflowScroll
                        + clamp(scroll, start, end)
                        - clamp(prevScroll, start, end),
                        0,
                        overflow
                    )
                };
            },

            write(data, types) {

                const isScrollUpdate = types.has('scroll');
                const {initTimestamp = 0, dir, prevDir, scroll, prevScroll = 0, top, start, topOffset, height} = data;

                if (scroll < 0 || scroll === prevScroll && isScrollUpdate || this.showOnUp && !isScrollUpdate && !this.isFixed) {
                    return;
                }

                const now = Date.now();
                if (now - initTimestamp > 300 || dir !== prevDir) {
                    data.initScroll = scroll;
                    data.initTimestamp = now;
                }

                if (this.showOnUp && !this.isFixed && Math.abs(data.initScroll - scroll) <= 30 && Math.abs(prevScroll - scroll) <= 10) {
                    return;
                }

                if (this.inactive
                    || scroll < start
                    || this.showOnUp && (scroll <= start || dir === 'down' && isScrollUpdate || dir === 'up' && !this.isFixed && scroll <= topOffset + height)
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

                } else if (this.animation) {

                    Animation.cancel(this.$el);
                    this.show();
                    Animation.in(this.$el, this.animation).catch(noop);

                } else {
                    this.show();
                }

            },

            events: ['resize', 'scroll']

        }

    ],

    methods: {

        show() {

            this.isFixed = true;
            this.update();
            this.placeholder.hidden = false;

        },

        hide() {

            this.isActive = false;
            removeClass(this.$el, this.clsFixed, this.clsBelow);
            css(this.$el, {position: '', top: '', width: ''});
            this.placeholder.hidden = true;

        },

        update() {

            const {width, scroll = 0, overflow, overflowScroll = 0, start, end, topOffset, height, offsetParentTop} = this._data;
            const active = start !== 0 || scroll > start;
            let top = this.offset;
            let position = 'fixed';

            if (scroll > end) {
                top = end + this.offset - offsetParentTop;
                position = 'absolute';
            }

            if (overflow) {
                top -= overflowScroll;
            }

            css(this.$el, {
                position,
                top: `${top}px`,
                width
            });

            this.isActive = active;
            toggleClass(this.$el, this.clsBelow, scroll > topOffset + height);
            addClass(this.$el, this.clsFixed);

        }

    }

};

function parseProp(value, el, propOffset) {

    if (!value) {
        return 0;
    }

    if (isString(value) && value.match(/^-?\d/)) {

        return propOffset + toPx(value);

    } else {

        return offset(value === true ? parent(el) : query(value, el)).bottom;

    }
}
