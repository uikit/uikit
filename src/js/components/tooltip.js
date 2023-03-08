import Container from '../mixin/container';
import Togglable from '../mixin/togglable';
import Position from '../mixin/position';
import {
    append,
    attr,
    flipPosition,
    hasAttr,
    includes,
    isFocusable,
    isTouch,
    matches,
    offset,
    on,
    once,
    overflowParents,
    pointerDown,
    pointerEnter,
    pointerLeave,
    remove,
    within,
} from 'uikit-util';
import { keyMap } from '../util/keys';
import { generateId } from '../api/instance';

export default {
    mixins: [Container, Togglable, Position],

    args: 'title',

    props: {
        delay: Number,
        title: String,
    },

    data: {
        pos: 'top',
        title: '',
        delay: 0,
        animation: ['uk-animation-scale-up'],
        duration: 100,
        cls: 'uk-active',
    },

    beforeConnect() {
        this.id = generateId(this);
        this._hasTitle = hasAttr(this.$el, 'title');
        attr(this.$el, {
            title: '',
            'aria-describedby': this.id,
        });
        makeFocusable(this.$el);
    },

    disconnected() {
        this.hide();

        if (!attr(this.$el, 'title')) {
            attr(this.$el, 'title', this._hasTitle ? this.title : null);
        }
    },

    methods: {
        show() {
            if (this.isToggled(this.tooltip || null) || !this.title) {
                return;
            }

            clearTimeout(this.showTimer);
            this.showTimer = setTimeout(this._show, this.delay);
        },

        async hide() {
            if (matches(this.$el, 'input:focus')) {
                return;
            }

            clearTimeout(this.showTimer);

            if (!this.isToggled(this.tooltip || null)) {
                return;
            }

            await this.toggleElement(this.tooltip, false, false);
            remove(this.tooltip);
            this.tooltip = null;
        },

        _show() {
            this.tooltip = append(
                this.container,
                `<div id="${this.id}" class="uk-${this.$options.name}" role="tooltip">
                    <div class="uk-${this.$options.name}-inner">${this.title}</div>
                 </div>`
            );

            on(this.tooltip, 'toggled', (e, toggled) => {
                if (!toggled) {
                    return;
                }

                const update = () => this.positionAt(this.tooltip, this.$el);
                update();

                const [dir, align] = getAlignment(this.tooltip, this.$el, this.pos);

                this.origin =
                    this.axis === 'y'
                        ? `${flipPosition(dir)}-${align}`
                        : `${align}-${flipPosition(dir)}`;

                const handlers = [
                    once(
                        document,
                        `keydown ${pointerDown}`,
                        this.hide,
                        false,
                        (e) =>
                            (e.type === pointerDown && !within(e.target, this.$el)) ||
                            (e.type === 'keydown' && e.keyCode === keyMap.ESC)
                    ),
                    on([document, ...overflowParents(this.$el)], 'scroll', update, {
                        passive: true,
                    }),
                ];
                once(this.tooltip, 'hide', () => handlers.forEach((handler) => handler()), {
                    self: true,
                });
            });

            this.toggleElement(this.tooltip, true);
        },
    },

    events: {
        focus: 'show',
        blur: 'hide',

        [`${pointerEnter} ${pointerLeave}`](e) {
            if (!isTouch(e)) {
                this[e.type === pointerEnter ? 'show' : 'hide']();
            }
        },

        // Clicking a button does not give it focus on all browsers and platforms
        // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#clicking_and_focus
        [pointerDown](e) {
            if (isTouch(e)) {
                this.show();
            }
        },
    },
};

function makeFocusable(el) {
    if (!isFocusable(el)) {
        attr(el, 'tabindex', '0');
    }
}

function getAlignment(el, target, [dir, align]) {
    const elOffset = offset(el);
    const targetOffset = offset(target);
    const properties = [
        ['left', 'right'],
        ['top', 'bottom'],
    ];

    for (const props of properties) {
        if (elOffset[props[0]] >= targetOffset[props[1]]) {
            dir = props[1];
            break;
        }
        if (elOffset[props[1]] <= targetOffset[props[0]]) {
            dir = props[0];
            break;
        }
    }

    const props = includes(properties[0], dir) ? properties[1] : properties[0];
    if (elOffset[props[0]] === targetOffset[props[0]]) {
        align = props[0];
    } else if (elOffset[props[1]] === targetOffset[props[1]]) {
        align = props[1];
    } else {
        align = 'center';
    }

    return [dir, align];
}
