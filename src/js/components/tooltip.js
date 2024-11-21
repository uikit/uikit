import {
    append,
    attr,
    flipPosition,
    data as getData,
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
} from 'uikit-util';
import { generateId } from '../api/instance';
import { parseOptions } from '../api/options';
import Container from '../mixin/container';
import Position from '../mixin/position';
import Togglable from '../mixin/togglable';
import { keyMap } from '../util/keys';

export default {
    mixins: [Container, Togglable, Position],

    data: {
        pos: 'top',
        animation: ['uk-animation-scale-up'],
        duration: 100,
        cls: 'uk-active',
    },

    connected() {
        makeFocusable(this.$el);
    },

    disconnected() {
        this.hide();
    },

    methods: {
        show() {
            if (this.isToggled(this.tooltip || null)) {
                return;
            }

            const { delay = 0, title } = parseProps(this.$options);

            if (!title) {
                return;
            }

            const titleAttr = attr(this.$el, 'title');
            const off = on(this.$el, ['blur', pointerLeave], (e) => !isTouch(e) && this.hide());

            this.reset = () => {
                attr(this.$el, { title: titleAttr, 'aria-describedby': null });
                off();
            };

            const id = generateId(this);
            attr(this.$el, { title: null, 'aria-describedby': id });

            clearTimeout(this.showTimer);
            this.showTimer = setTimeout(() => this._show(title, id), delay);
        },

        async hide() {
            if (matches(this.$el, 'input:focus')) {
                return;
            }

            clearTimeout(this.showTimer);

            if (this.isToggled(this.tooltip || null)) {
                await this.toggleElement(this.tooltip, false, false);
            }

            this.reset?.();
            remove(this.tooltip);
            this.tooltip = null;
        },

        async _show(title, id) {
            this.tooltip = append(
                this.container,
                `<div id="${id}" class="uk-${this.$options.name}" role="tooltip">
                    <div class="uk-${this.$options.name}-inner">${title}</div>
                 </div>`,
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
                            (e.type === pointerDown && !this.$el.contains(e.target)) ||
                            (e.type === 'keydown' && e.keyCode === keyMap.ESC),
                    ),
                    on([document, ...overflowParents(this.$el)], 'scroll', update, {
                        passive: true,
                    }),
                ];
                once(this.tooltip, 'hide', () => handlers.forEach((handler) => handler()), {
                    self: true,
                });
            });

            if (!(await this.toggleElement(this.tooltip, true))) {
                this.hide();
            }
        },
    },

    events: {
        // Clicking a button does not give it focus on all browsers and platforms
        // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#clicking_and_focus
        [`focus ${pointerEnter} ${pointerDown}`](e) {
            if ((!isTouch(e) || e.type === pointerDown) && document.readyState !== 'loading') {
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
    align = props.find((prop) => elOffset[prop] === targetOffset[prop]) || 'center';

    return [dir, align];
}

function parseProps(options) {
    const { el, id, data } = options;
    return ['delay', 'title'].reduce((obj, key) => ({ [key]: getData(el, key), ...obj }), {
        ...parseOptions(getData(el, id), ['title']),
        ...data,
    });
}
