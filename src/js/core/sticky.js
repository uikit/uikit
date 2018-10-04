import Class from '../mixin/class';
import Media from '../mixin/media';
import {$, addClass, after, Animation, assign, attr, css, fastdom, hasClass, height, isNumeric, isString, isUndefined, isVisible, noop, offset, query, remove, removeClass, replaceClass, scrollTop, toFloat, toggleClass, trigger, within} from 'uikit-util';

export default {

    mixins: [Class, Media],

    props: {
        top: null,
        bottom: Boolean,
        offset: Number,
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

        selTarget({selTarget}, $el) {
            return selTarget && $(selTarget, $el) || $el;
        },

        widthElement({widthElement}, $el) {
            return query(widthElement, $el) || this.placeholder;
        }

    },

    connected() {
        this.placeholder = $('+ .uk-sticky-placeholder', this.$el) || $('<div class="uk-sticky-placeholder"></div>');
    },

    disconnected() {

        if (this.isActive) {
            this.isActive = undefined;
            this.hide();
            removeClass(this.selTarget, this.clsInactive);
        }

        remove(this.placeholder);
        this.placeholder = null;
        this.widthElement = null;
    },

    events: [

        {
            name: 'active',

            self: true,

            handler() {
                replaceClass(this.selTarget, this.clsInactive, this.clsActive);
            }

        },

        {
            name: 'inactive',

            self: true,

            handler() {
                replaceClass(this.selTarget, this.clsActive, this.clsInactive);
            }

        },

        {

            name: 'load hashchange popstate',

            el: window,

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

                        if (this.isActive && elTop + elHeight >= top && elTop <= top + target.offsetHeight) {
                            scrollTop(window, top - elHeight - (isNumeric(this.targetOffset) ? this.targetOffset : 0) - this.offset);
                        }

                    });
                }

            }

        }

    ],

    update: [

        {

            read({height}, {type}) {

                height = !this.isActive || type === 'resize' ? this.$el.offsetHeight : height;

                this.topOffset = offset(this.isActive ? this.placeholder : this.$el).top;
                this.bottomOffset = this.topOffset + height;

                const bottom = parseProp('bottom', this);

                this.top = Math.max(toFloat(parseProp('top', this)), this.topOffset) - this.offset;
                this.bottom = bottom && bottom - height;
                this.inactive = !this.matchMedia;

                return {
                    height,
                    margins: css(this.$el, ['marginTop', 'marginBottom', 'marginLeft', 'marginRight'])
                };
            },

            write({height, margins}) {

                const {placeholder} = this;

                css(placeholder, assign({height}, margins));

                if (!within(placeholder, document)) {
                    after(this.$el, placeholder);
                    attr(placeholder, 'hidden', '');
                }

                if (isUndefined(this.isActive)) {
                    this.hide();
                }

            },

            events: ['load', 'resize']

        },

        {

            read(_, {scrollY = window.pageYOffset}) {

                this.width = (isVisible(this.widthElement) ? this.widthElement : this.$el).offsetWidth;

                return {
                    scroll: this.scroll = scrollY,
                    visible: isVisible(this.$el)
                };
            },

            write({visible, scroll}, {dir} = {}) {

                if (scroll < 0 || !visible || this.disabled || this.showOnUp && !dir) {
                    return;
                }

                if (this.inactive
                    || scroll < this.top
                    || this.showOnUp && (scroll <= this.top || dir === 'down' || dir === 'up' && !this.isActive && scroll <= this.bottomOffset)
                ) {

                    if (!this.isActive) {
                        return;
                    }

                    this.isActive = false;

                    if (this.animation && scroll > this.topOffset) {
                        Animation.cancel(this.$el);
                        Animation.out(this.$el, this.animation).then(() => this.hide(), noop);
                    } else {
                        this.hide();
                    }

                } else if (this.isActive) {

                    this.update();

                } else if (this.animation) {

                    Animation.cancel(this.$el);
                    this.show();
                    Animation.in(this.$el, this.animation).catch(noop);

                } else {
                    this.show();
                }

            },

            events: ['load', 'resize', 'scroll']

        },

    ],

    methods: {

        show() {

            this.isActive = true;
            this.update();
            attr(this.placeholder, 'hidden', null);

        },

        hide() {

            if (!this.isActive || hasClass(this.selTarget, this.clsActive)) {
                trigger(this.$el, 'inactive');
            }

            removeClass(this.$el, this.clsFixed, this.clsBelow);
            css(this.$el, {position: '', top: '', width: ''});
            attr(this.placeholder, 'hidden', '');

        },

        update() {

            const active = this.top !== 0 || this.scroll > this.top;
            let top = Math.max(0, this.offset);

            if (this.bottom && this.scroll > this.bottom - this.offset) {
                top = this.bottom - this.scroll;
            }

            css(this.$el, {
                position: 'fixed',
                top: `${top}px`,
                width: this.width
            });

            if (hasClass(this.selTarget, this.clsActive)) {

                if (!active) {
                    trigger(this.$el, 'inactive');
                }

            } else if (active) {
                trigger(this.$el, 'active');
            }

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

    if (isNumeric(value)) {

        return propOffset + toFloat(value);

    } else if (isString(value) && value.match(/^-?\d+vh$/)) {

        return height(window) * toFloat(value) / 100;

    } else {

        const el = value === true ? $el.parentNode : query(value, $el);

        if (el) {
            return offset(el).top + el.offsetHeight;
        }

    }
}
