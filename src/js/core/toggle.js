import {
    hasAttr,
    hasClass,
    includes,
    isBoolean,
    isFocusable,
    isSameSiteAnchor,
    isTag,
    isTouch,
    matches,
    once,
    pointerDown,
    pointerEnter,
    pointerLeave,
    queryAll,
    trigger,
} from 'uikit-util';
import { lazyload } from '../api/observables';
import Media from '../mixin/media';
import Togglable from '../mixin/togglable';

const KEY_ENTER = 13;
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
        target: {
            get: ({ target }, $el) => {
                target = queryAll(target || $el.hash, $el);
                return target.length ? target : [$el];
            },
            observe: ({ target }) => target,
        },
    },

    connected() {
        if (!includes(this.mode, 'media')) {
            if (!isFocusable(this.$el)) {
                this.$el.tabIndex = 0;
            }
            if (!this.cls && isTag(this.$el, 'a')) {
                this.$el.role = 'button';
            }
        }
    },

    observe: lazyload({ targets: ({ target }) => target }),

    events: [
        {
            name: pointerDown,

            filter: ({ mode }) => includes(mode, 'hover'),

            handler(e) {
                this._preventClick = null;

                if (!isTouch(e) || isBoolean(this._showState) || this.$el.disabled) {
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
                    (e) => !this.$el.contains(e.target),
                );

                // Prevent initial click to prevent double toggle through focus + click
                if (includes(this.mode, 'click')) {
                    this._preventClick = true;
                }
            },
        },

        {
            name: `${pointerEnter} ${pointerLeave} focus blur`,

            filter: ({ mode }) => includes(mode, 'hover'),

            handler(e) {
                if (isTouch(e) || this.$el.disabled || document.readyState === 'loading') {
                    return;
                }

                const show = includes([pointerEnter, 'focus'], e.type);
                const expanded = this.isToggled(this.target);

                // Skip hide if still hovered or focused
                if (
                    !show &&
                    (!isBoolean(this._showState) ||
                        (e.type === pointerLeave && matches(this.$el, ':focus')) ||
                        (e.type === 'blur' && matches(this.$el, ':hover')))
                ) {
                    // Reset showState if already hidden
                    if (expanded === this._showState) {
                        this._showState = null;
                    }
                    return;
                }

                // Skip show if state does not change e.g. hover + focus received
                if (show && isBoolean(this._showState) && expanded !== this._showState) {
                    return;
                }

                this._showState = show ? expanded : null;

                this.toggle(`toggle${show ? 'show' : 'hide'}`);
            },
        },

        {
            name: 'keydown',

            filter: ({ $el, mode }) => includes(mode, 'click') && !isTag($el, 'input'),

            handler(e) {
                if (e.keyCode === KEY_SPACE || e.keyCode === KEY_ENTER) {
                    e.preventDefault();
                    this.$el.click();
                }
            },
        },

        {
            name: 'click',

            filter: ({ mode }) => ['click', 'hover'].some((m) => includes(mode, m)),

            handler(e) {
                if (e.defaultPrevented) {
                    return;
                }

                const link = e.target.closest('a[href]');
                const isButtonLike =
                    isSameSiteAnchor(link) && (!link.hash || matches(this.target, link.hash));

                if (this._preventClick || isButtonLike || (link && !this.isToggled(this.target))) {
                    e.preventDefault();
                }

                if (
                    !this._preventClick &&
                    includes(this.mode, 'click') &&
                    (!link || isButtonLike || e.defaultPrevented)
                ) {
                    this.toggle();
                }
            },
        },

        {
            name: 'mediachange',

            filter: ({ mode }) => includes(mode, 'media'),

            el: ({ target }) => target,

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
                this.$el.ariaExpanded = !this.isToggled(this.target);
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
            if (await this.toggleElement(toggled, false)) {
                await this.toggleElement(
                    this.target.filter((el) => !includes(toggled, el)),
                    true,
                );
            }
        },
    },
};
