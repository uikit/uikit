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
    pointerDown,
    pointerEnter,
    pointerLeave,
    queryAll,
    startsWith,
    trigger,
} from 'uikit-util';
import { lazyload } from '../api/observables';
import Media from '../mixin/media';
import Togglable from '../mixin/togglable';
import { keyMap } from '../util/keys';

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
                // Some browsers omit or misreport pointerType on click events.
                this._touch = isTouch(e);
            },
        },

        {
            name: `${pointerEnter} ${pointerLeave} focusin focusout`,

            filter: ({ mode }) => ['hover', 'focus'].some((m) => includes(mode, m)),

            handler(e) {
                const focus = startsWith(e.type, 'focus');
                const { mode, $el, target } = this;
                if (
                    !includes(mode, focus ? 'focus' : 'hover') ||
                    (focus && $el.contains(e.relatedTarget)) ||
                    $el.disabled ||
                    isTouch(e) ||
                    document.readyState === 'loading'
                ) {
                    return;
                }

                const leave = includes([pointerLeave, 'focusout'], e.type);
                const expanded = this.isToggled(target);
                if (leave) {
                    if (
                        !isBoolean(this._showState) ||
                        (includes(mode, focus ? 'hover' : 'focus') &&
                            matches($el, focus ? ':hover' : ':focus-within'))
                    ) {
                        return;
                    }

                    const initial = this._showState;
                    this._showState = null;
                    if (expanded !== initial) {
                        this.toggle('togglehide');
                    } else {
                        // Drops may have canceled a delayed hide on pointer re-entry.
                        trigger(target, 'togglehide', [this]);
                    }
                    return;
                }

                // Remember the state to restore when hover and focus end.
                this._showState ??= expanded;

                if (expanded === this._showState) {
                    this.toggle('toggleshow');
                }
            },
        },

        {
            name: 'keydown',

            // Focus effects follow focus state; explicit activation must be opted into.
            filter: (toggle) => isClickable(toggle) && !isTag(toggle.$el, 'input'),

            handler(e) {
                if (e.keyCode === keyMap.SPACE || e.keyCode === keyMap.ENTER) {
                    e.preventDefault();
                    this.$el.click();
                }
            },
        },

        {
            name: 'click',

            filter: isClickable,

            handler(e) {
                const touch = this._touch;
                this._touch = false;

                if (e.defaultPrevented) {
                    return;
                }

                const activate =
                    includes(this.mode, 'click') || e.detail === 0 || isTouch(e) || touch;
                if (activate && includes(this.mode, 'hover') && !this.$el.disabled) {
                    this._showState ??= this.isToggled(this.target);
                }

                const link = e.target.closest('a[href]');
                const isButtonLike =
                    isSameSiteAnchor(link) && (!link.hash || matches(this.target, link.hash));

                if (isButtonLike || (link && !this.isToggled(this.target))) {
                    e.preventDefault();
                }

                if (activate && (!link || e.defaultPrevented)) {
                    this.toggle();
                }
            },
        },

        {
            name: 'mediachange',

            filter: ({ mode }) => includes(mode, 'media'),

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

// Focus-only effects do not opt into explicit activation.
function isClickable({ mode }) {
    return includes(mode, 'click') || (includes(mode, 'hover') && !includes(mode, 'focus'));
}
