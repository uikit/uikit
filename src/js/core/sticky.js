// keeping util imports small and explicit helps
// for a better and fast understanding of the dependencies
// plus makes it easier to refactor

// Additionally the offset was imported as offsetOf to avoid concept
// and name conflicts. In general is a good idea to have less generic globals.

import {attr} from '../util/attr';
import {css} from '../util/style';
import {trigger} from '../util/event';
import {win, docEl} from '../util/env';
import {fastdom} from '../util/fastdom';
import {offset as offsetOf, height} from '../util/position';
import {$, query, within} from '../util/selector';
import {isVisible, Animation, after, remove} from '../util/dom';
import {assign, isNumeric, isString, toFloat, noop} from '../util/lang';
import {hasClass, addClass, removeClass, toggleClass, replaceClass} from '../util/class';

export default function (UIkit) {

    UIkit.component('sticky', {

        // Relying on a mixing that literally does one simple
        // line of code introduces more troubles than solutions.
        // The final size code saving is very minimum and not worthy of
        // loosing explicitness of what this component does.
        // mixins: [Class], // logic moved to Connected event

        attrs: true,

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
            widthElement: 'query',
            showOnUp: Boolean,
            media: 'media',
            target: Number
        },

        defaults: {
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
            media: false,
            target: false
        },

        computed: {

            selTarget({selTarget}, $el) {
                return selTarget
                    ? $(selTarget, $el)
                    : $el;
            }

        },

        connected() {

            addClass(this.$el, this.$name);

            this.placeholder = $('<div class="uk-sticky-placeholder"></div>');
            this.widthElement = this.$props.widthElement || this.placeholder;

            if (!this.isActive) {
                this.hide();
            }
        },

        disconnected() {

            if (this.isActive) {
                this.isActive = false;
                this.hide();
                removeClass(this.selTarget, this.clsInactive);
            }

            remove(this.placeholder);
            this.placeholder = null;
            this.widthElement = null;
        },

        ready() {

            if (!(this.target && location.hash && win.pageYOffset > 0)) {
                return;
            }

            const target = $(location.hash);

            if (target) {
                fastdom.read(() => {

                    const {top} = offsetOf(target);
                    const elTop = offsetOf(this.$el).top;
                    const elHeight = this.$el.offsetHeight;

                    if (elTop + elHeight >= top && elTop <= top + target.offsetHeight) {
                        win.scrollTo(0, top - elHeight - this.target - this.offset);
                    }

                });
            }

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

            }

        ],

        update: [

            {

                write() {

                    // a workaround until no cached computed props are supported
                    this.outerHeight = (this.isActive ? this.placeholder : this.$el).offsetHeight;

                    this.updatePlaceholder();
                    this.updateWidthElement();

                    this.topOffset = offsetOf(this.isActive ? this.placeholder : this.$el).top;
                    this.bottomOffset = this.topOffset + this.outerHeight;

                    const top = parseProp('top', this);
                    const bottom = parseProp('bottom', this);

                    // names changed to be more descriptive and less conflicting
                    this.stickAt = Math.max(toFloat(top), this.topOffset) - this.offset;
                    this.stickUntil = bottom && bottom - this.outerHeight;
                    this.inactive = this.media && !win.matchMedia(this.media).matches;

                    if (this.isActive) {
                        this.update();
                    }
                },

                events: ['load', 'resize']

            },

            {

                read(_, {scrollY = win.pageYOffset}) {
                    return {
                        scroll: this.scroll = scrollY,
                        visible: isVisible(this.$el)
                    };
                },

                write({visible, scroll}, {dir} = {}) {

                    // place the logic into descriptive variables
                    const isHidden = !visible;
                    const {bottomOffset, topOffset, stickAt} = this;
                    const {showOnUp, disabled, isActive, inactive, animation} = this;

                    // this one os confusing, in what situation
                    // a scroll could be less than 0?
                    const noScroll = scroll < 0;

                    // this one as well, what is the !dir meaning?
                    // it is perhaps another way to say no srolled yet?
                    const showOnUpConfusing = (showOnUp && !dir);

                    if (noScroll || isHidden || disabled || showOnUpConfusing) {
                        return;
                    }

                    const scrollingUp = dir === 'up';
                    const scrollingDown = dir === 'down';
                    const stickAtReached = scroll <= stickAt;
                    const stickAtNotReached = scroll < stickAt;
                    const bottomOffsetReached = scroll <= bottomOffset;

                    // the condition is still long and the entire logic of this
                    // function could be refactored, but at list for now there is
                    // a better understanding of what is going on and that may lead
                    // to easier later refactoring
                    if (inactive || stickAtNotReached || showOnUp &&
                      (stickAtReached || scrollingDown ||
                        (scrollingUp && !isActive && bottomOffsetReached)
                      )
                    ) {

                        if (!isActive) {
                            return;
                        }

                        this.isActive = false;

                        if (animation && scroll > topOffset) {
                            Animation.cancel(this.$el);
                            Animation.out(this.$el, animation).then(() => this.hide(), noop);
                        } else {
                            this.hide();
                        }

                    } else if (isActive) {

                        this.update();

                    } else if (animation) {

                        Animation.cancel(this.$el);
                        this.show();
                        Animation.in(this.$el, animation).catch(noop);

                    } else {
                        this.show();
                    }

                },

                events: ['scroll']

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

                let top = Math.max(0, this.offset);
                const active = this.stickAt !== 0 || this.scroll > this.stickAt;

                if (this.stickUntil && this.scroll > this.stickUntil - this.offset) {
                    top = this.stickUntil - this.scroll;
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

            },

            updatePlaceholder() {

                css(this.placeholder, assign(
                    {height: css(this.$el, 'position') !== 'absolute' ? this.outerHeight : ''},
                    css(this.$el, ['marginTop', 'marginBottom', 'marginLeft', 'marginRight'])
                ));

                if (!within(this.placeholder, docEl)) {
                    after(this.$el, this.placeholder);
                    attr(this.placeholder, 'hidden', '');
                }

            },

            updateWidthElement() {

                attr(this.widthElement, 'hidden', null);
                this.width = this.widthElement.offsetWidth;
                attr(this.widthElement, 'hidden', this.isActive ? null : '');

            }

        }

    });

    function parseProp(prop, {$props, $el, [`${prop}Offset`]: propOffset}) {

        const value = $props[prop];

        if (!value) {
            return;
        }

        if (isNumeric(value)) {

            return propOffset + toFloat(value);

        } else if (isString(value) && value.match(/^-?\d+vh$/)) {

            return height(win) * toFloat(value) / 100;

        } else {

            const el = value === true ? $el.parentNode : query(value, $el);

            if (el) {
                return offsetOf(el).top + el.offsetHeight;
            }

        }
    }

}
