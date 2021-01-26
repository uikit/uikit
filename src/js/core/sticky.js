import Class from '../mixin/class';
import Media from '../mixin/media';
import {$, addClass, after, Animation, assign, css, dimensions, fastdom, hasClass, isNumeric, isString, isVisible, noop, offset, offsetPosition, parent, query, remove, removeClass, replaceClass, scrollTop, toFloat, toggleClass, toPx, trigger, within} from 'uikit-util';

export default {

    mixins: [Class, Media],

    props: {
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

        offset({offset}) {
            return toPx(offset);
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

                if (!(this.targetOffset !== false && location.hash && window.pageYOffset > 0)) {
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

            read({height}, types) {

                this.inactive = !this.matchMedia || !isVisible(this.$el);

                if (this.inactive) {
                    return false;
                }

                if (this.isActive && types.has('resize')) {
                    this.hide();
                    height = this.$el.offsetHeight;
                    this.show();
                }

                height = !this.isActive ? this.$el.offsetHeight : height;

                this.topOffset = offset(this.isFixed ? this.placeholder : this.$el).top;
                this.bottomOffset = this.topOffset + height;

                const bottom = parseProp('bottom', this);

                this.top = Math.max(toFloat(parseProp('top', this)), this.topOffset) - this.offset;
                this.bottom = bottom && bottom - this.$el.offsetHeight;
                this.width = dimensions(isVisible(this.widthElement) ? this.widthElement : this.$el).width;

                return {
                    height,
                    top: offsetPosition(this.placeholder)[0],
                    margins: css(this.$el, ['marginTop', 'marginBottom', 'marginLeft', 'marginRight'])
                };
            },

            write({height, margins}) {

                const {placeholder} = this;

                css(placeholder, assign({height}, margins));

                if (!within(placeholder, document)) {
                    after(this.$el, placeholder);
                    placeholder.hidden = true;
                }

                this.isActive = !!this.isActive; // force self-assign

            },

            events: ['resize']

        },

        {

            read({scroll = 0}) {

                this.scroll = window.pageYOffset;

                return {
                    dir: scroll <= this.scroll ? 'down' : 'up',
                    scroll: this.scroll
                };
            },

            write(data, types) {

                const now = Date.now();
                const isScrollUpdate = types.has('scroll');
                const {initTimestamp = 0, dir, lastDir, lastScroll, scroll, top} = data;

                data.lastScroll = scroll;

                if (scroll < 0 || scroll === lastScroll && isScrollUpdate || this.showOnUp && !isScrollUpdate && !this.isFixed) {
                    return;
                }

                if (now - initTimestamp > 300 || dir !== lastDir) {
                    data.initScroll = scroll;
                    data.initTimestamp = now;
                }

                data.lastDir = dir;

                if (this.showOnUp && !this.isFixed && Math.abs(data.initScroll - scroll) <= 30 && Math.abs(lastScroll - scroll) <= 10) {
                    return;
                }

                if (this.inactive
                    || scroll < this.top
                    || this.showOnUp && (scroll <= this.top || dir === 'down' && isScrollUpdate || dir === 'up' && !this.isFixed && scroll <= this.bottomOffset)
                ) {

                    if (!this.isFixed) {

                        if (Animation.inProgress(this.$el) && top > scroll) {
                            Animation.cancel(this.$el);
                            this.hide();
                        }

                        return;
                    }

                    this.isFixed = false;

                    if (this.animation && scroll > this.topOffset) {
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

            const active = this.top !== 0 || this.scroll > this.top;
            let top = Math.max(0, this.offset);

            if (isNumeric(this.bottom) && this.scroll > this.bottom - this.offset) {
                top = this.bottom - this.scroll;
            }

            css(this.$el, {
                position: 'fixed',
                top: `${top}px`,
                width: this.width
            });

            this.isActive = active;
            toggleClass(this.$el, this.clsBelow, this.scroll > this.bottomOffset);
            addClass(this.$el, this.clsFixed);

        }

    }

};

function parseProp(prop, {$props, $el, [`${prop}Offset`]: propOffset}) {

    const value = $props[prop];

    if (!value) {
        return;
    }

    if (isString(value) && value.match(/^-?\d/)) {

        return propOffset + toPx(value);

    } else {

        return offset(value === true ? parent($el) : query(value, $el)).bottom;

    }
}
