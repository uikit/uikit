import Media from '../mixin/media';
import Togglable from '../mixin/togglable';
import {attr, closest, hasClass, includes, isBoolean, isFocusable, isTouch, matches, once, pointerDown, pointerEnter, pointerLeave, queryAll, trigger, within} from 'uikit-util';

export default {

    mixins: [Media, Togglable],

    args: 'target',

    props: {
        href: String,
        target: null,
        mode: 'list',
        queued: Boolean
    },

    data: {
        href: false,
        target: false,
        mode: 'click',
        queued: true
    },

    connected() {
        if (!includes(this.mode, 'media') && !isFocusable(this.$el)) {
            attr(this.$el, 'tabindex', '0');
        }
    },

    computed: {

        target: {

            get({href, target}, $el) {
                target = queryAll(target || href, $el);
                return target.length && target || [$el];
            },

            watch() {
                this.updateAria();
            },

            immediate: true

        }

    },

    events: [

        {
            name: pointerDown,

            filter() {
                return includes(this.mode, 'hover');
            },

            handler(e) {

                if (!isTouch(e) || this._showState) {
                    return;
                }

                // Clicking a button does not give it focus on all browsers and platforms
                // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#clicking_and_focus
                trigger(this.$el, 'focus');
                once(document, pointerDown, () => trigger(this.$el, 'blur'), true, e => !within(e.target, this.$el));

                // Prevent initial click to prevent double toggle through focus + click
                if (includes(this.mode, 'click')) {
                    this._preventClick = true;
                }
            }
        },

        {

            name: `${pointerEnter} ${pointerLeave} focus blur`,

            filter() {
                return includes(this.mode, 'hover');
            },

            handler(e) {
                if (isTouch(e)) {
                    return;
                }

                const show = includes([pointerEnter, 'focus'], e.type);
                const expanded = attr(this.$el, 'aria-expanded');

                // Skip hide if still hovered or focused
                if (!show && (
                    e.type === pointerLeave && matches(this.$el, ':focus')
                    || e.type === 'blur' && matches(this.$el, ':hover')
                )) {
                    return;
                }

                // Skip if state does not change e.g. hover + focus received
                if (this._showState && show === (expanded !== this._showState)) {

                    // Ensure reset if state has changed through click
                    if (!show) {
                        this._showState = null;
                    }
                    return;
                }

                this._showState = show ? expanded : null;

                this.toggle(`toggle${show ? 'show' : 'hide'}`);
            }

        },

        {
            name: 'keydown',

            filter() {
                return includes(this.mode, 'click');
            },

            handler(e) {
                // Space
                if (e.keyCode === 32) {
                    e.preventDefault();
                    this.$el.click();
                }
            }
        },

        {

            name: 'click',

            filter() {
                return includes(this.mode, 'click');
            },

            handler(e) {

                if (this._preventClick) {
                    return this._preventClick = null;
                }

                let link;
                if (closest(e.target, 'a[href="#"], a[href=""]')
                    || (link = closest(e.target, 'a[href]')) && (
                        attr(this.$el, 'aria-expanded') !== 'true'
                        || link.hash && matches(this.target, link.hash)
                    )
                ) {
                    e.preventDefault();
                }

                this.toggle();
            }

        },

        {

            name: 'toggled',

            self: true,

            el() {
                return this.target;
            },

            handler(e, toggled) {
                if (e.target === this.target[0]) {
                    this.updateAria(toggled);
                }
            }
        }

    ],

    update: {

        read() {
            return includes(this.mode, 'media') && this.media
                ? {match: this.matchMedia}
                : false;
        },

        write({match}) {

            const toggled = this.isToggled(this.target);
            if (match ? !toggled : toggled) {
                this.toggle();
            }

        },

        events: ['resize']

    },

    methods: {

        toggle(type) {

            if (!trigger(this.target, type || 'toggle', [this])) {
                return;
            }

            if (!this.queued) {
                return this.toggleElement(this.target);
            }

            const leaving = this.target.filter(el => hasClass(el, this.clsLeave));

            if (leaving.length) {
                this.target.forEach(el => {
                    const isLeaving = includes(leaving, el);
                    this.toggleElement(el, isLeaving, isLeaving);
                });
                return;
            }

            const toggled = this.target.filter(this.isToggled);
            this.toggleElement(toggled, false).then(() =>
                this.toggleElement(this.target.filter(el =>
                    !includes(toggled, el)
                ), true)
            );

        },

        updateAria(toggled) {
            if (includes(this.mode, 'media')) {
                return;
            }

            attr(this.$el, 'aria-expanded', isBoolean(toggled)
                ? toggled
                : this.isToggled(this.target)
            );
        }

    }

};
