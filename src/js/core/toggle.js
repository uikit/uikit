import Media from '../mixin/media';
import Togglable from '../mixin/togglable';
import { lazyload } from '../api/observables';
import {
    attr,
    closest,
    hasAttr,
    hasClass,
    includes,
    isFocusable,
    isTag,
    isTouch,
    matches,
    once,
    pointerDown,
    pointerEnter,
    pointerLeave,
    queryAll,
    trigger,
    within,
} from 'uikit-util';

const KEY_SPACE = 32;

export default {
    mixins: [Media, Togglable],

    args: 'target',

    props: {
        href: String,
        target: null,
        mode: 'list',
        queued: Boolean,
    },

    data: {
        href: false,
        target: false,
        mode: 'click',
        queued: true,
    },

    computed: {
        target({ href, target }, $el) {
            target = queryAll(target || href, $el);
            return (target.length && target) || [$el];
        },
    },

    connected() {
        if (!includes(this.mode, 'media')) {
            if (!isFocusable(this.$el)) {
                attr(this.$el, 'tabindex', '0');
            }
            if (!this.cls && isTag(this.$el, 'a')) {
                attr(this.$el, 'role', 'button');
            }
        }
    },

    observe: lazyload({ target: ({ target }) => target }),

    events: [
        {
            name: pointerDown,

            filter() {
                return includes(this.mode, 'hover');
            },

            handler(e) {
                this._preventClick = null;

                if (!isTouch(e) || this._showState || this.$el.disabled) {
                    return;
                }

                // Clicking a button does not give it focus on all browsers and platforms
                // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#clicking_and_focus
                trigger(this.$el, 'focus');
                once(
                    document,
                    pointerDown,
                    () => trigger(this.$el, 'blur'),
                    true,
                    (e) => !within(e.target, this.$el)
                );

                // Prevent initial click to prevent double toggle through focus + click
                if (includes(this.mode, 'click')) {
                    this._preventClick = true;
                }
            },
        },

        {
            name: `${pointerEnter} ${pointerLeave} focus blur`,

            filter() {
                return includes(this.mode, 'hover');
            },

            handler(e) {
                if (isTouch(e) || this.$el.disabled) {
                    return;
                }

                const show = includes([pointerEnter, 'focus'], e.type);
                const expanded = this.isToggled(this.target);

                // Skip hide if still hovered or focused
                if (
                    !show &&
                    ((e.type === pointerLeave && matches(this.$el, ':focus')) ||
                        (e.type === 'blur' && matches(this.$el, ':hover')))
                ) {
                    return;
                }

                // Skip if state does not change e.g. hover + focus received
                if (this._showState && show && expanded !== this._showState) {
                    // Ensure reset if state has changed through click
                    if (!show) {
                        this._showState = null;
                    }
                    return;
                }

                this._showState = show ? expanded : null;

                this.toggle(`toggle${show ? 'show' : 'hide'}`);
            },
        },

        {
            name: 'keydown',

            filter() {
                return includes(this.mode, 'click') && !isTag(this.$el, 'input');
            },

            handler(e) {
                if (e.keyCode === KEY_SPACE) {
                    e.preventDefault();
                    this.$el.click();
                }
            },
        },

        {
            name: 'click',

            filter() {
                return ['click', 'hover'].some((mode) => includes(this.mode, mode));
            },

            handler(e) {
                let link;
                if (
                    this._preventClick ||
                    closest(e.target, 'a[href="#"], a[href=""]') ||
                    ((link = closest(e.target, 'a[href]')) &&
                        (!this.isToggled(this.target) ||
                            (link.hash && matches(this.target, link.hash))))
                ) {
                    e.preventDefault();
                }

                if (!this._preventClick && includes(this.mode, 'click')) {
                    this.toggle();
                }
            },
        },

        {
            name: 'mediachange',

            filter() {
                return includes(this.mode, 'media');
            },

            el() {
                return this.target;
            },

            handler(e, mediaObj) {
                if (mediaObj.matches ^ this.isToggled(this.target)) {
                    this.toggle();
                }
            },
        },
    ],

    methods: {
        async toggle(type) {
            if (!trigger(this.target, type || 'toggle', [this])) {
                return;
            }

            if (hasAttr(this.$el, 'aria-expanded')) {
                attr(this.$el, 'aria-expanded', !this.isToggled(this.target));
            }

            if (!this.queued) {
                return this.toggleElement(this.target);
            }

            const leaving = this.target.filter((el) => hasClass(el, this.clsLeave));

            if (leaving.length) {
                for (const el of this.target) {
                    const isLeaving = includes(leaving, el);
                    this.toggleElement(el, isLeaving, isLeaving);
                }
                return;
            }

            const toggled = this.target.filter(this.isToggled);
            await this.toggleElement(toggled, false);
            await this.toggleElement(
                this.target.filter((el) => !includes(toggled, el)),
                true
            );
        },
    },
};
