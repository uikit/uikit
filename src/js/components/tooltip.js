import Container from '../mixin/container';
import Togglable from '../mixin/togglable';
import Position from '../mixin/position';
import {append, attr, flipPosition, hasAttr, isInput, isTouch, matches, on, once, pointerDown, pointerEnter, pointerLeave, remove, within} from 'uikit-util';

export default {

    mixins: [Container, Togglable, Position],

    args: 'title',

    props: {
        delay: Number,
        title: String
    },

    data: {
        pos: 'top',
        title: '',
        delay: 0,
        animation: ['uk-animation-scale-up'],
        duration: 100,
        cls: 'uk-active',
        clsPos: 'uk-tooltip'
    },

    beforeConnect() {
        this._hasTitle = hasAttr(this.$el, 'title');
        attr(this.$el, 'title', '');
        this.updateAria(false);
        makeFocusable(this.$el);
    },

    disconnected() {
        this.hide();
        attr(this.$el, 'title', this._hasTitle ? this.title : null);
    },

    methods: {

        show() {

            if (this.isToggled(this.tooltip) || !this.title) {
                return;
            }

            this._unbind = once(document, `show keydown ${pointerDown}`, this.hide, false, e =>
                e.type === pointerDown && !within(e.target, this.$el)
                || e.type === 'keydown' && e.keyCode === 27
                || e.type === 'show' && e.detail[0] !== this && e.detail[0].$name === this.$name
            );

            clearTimeout(this.showTimer);
            this.showTimer = setTimeout(this._show, this.delay);
        },

        hide() {

            if (matches(this.$el, 'input:focus')) {
                return;
            }

            clearTimeout(this.showTimer);

            if (!this.isToggled(this.tooltip)) {
                return;
            }

            this.toggleElement(this.tooltip, false, false).then(() => {
                this.tooltip = remove(this.tooltip);
                this._unbind();
            });
        },

        _show() {

            this.tooltip = append(this.container,
                `<div class="${this.clsPos}">
                    <div class="${this.clsPos}-inner">${this.title}</div>
                 </div>`
            );

            on(this.tooltip, 'toggled', (e, toggled) => {

                this.updateAria(toggled);

                if (!toggled) {
                    return;
                }

                this.positionAt(this.tooltip, this.$el);

                this.origin = this.getAxis() === 'y'
                    ? `${flipPosition(this.dir)}-${this.align}`
                    : `${this.align}-${flipPosition(this.dir)}`;
            });

            this.toggleElement(this.tooltip, true);

        },

        updateAria(toggled) {
            attr(this.$el, 'aria-expanded', toggled);
        }

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
        }

    }

};

function makeFocusable(el) {
    if (!isFocusable(el)) {
        attr(el, 'tabindex', '0');
    }
}

function isFocusable(el) {
    return isInput(el) || matches(el, 'a,button') || hasAttr(el, 'tabindex');
}
