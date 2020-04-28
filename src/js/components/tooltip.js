import Container from '../mixin/container';
import Togglable from '../mixin/togglable';
import Position from '../mixin/position';
import {append, attr, flipPosition, hasAttr, includes, isTouch, matches, on, pointerDown, pointerEnter, pointerLeave, pointerUp, remove, within} from 'uikit-util';

const actives = [];

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
        attr(this.$el, {title: '', 'aria-expanded': false});
    },

    disconnected() {
        this.hide();
        attr(this.$el, {title: this._hasTitle ? this.title : null, 'aria-expanded': null});
    },

    methods: {

        show() {

            if (this.isActive() || !this.title) {
                return;
            }

            actives.forEach(active => active.hide());
            actives.push(this);

            this._unbind = on(document, pointerUp, e => !within(e.target, this.$el) && this.hide());

            clearTimeout(this.showTimer);
            this.showTimer = setTimeout(this._show, this.delay);
        },

        hide() {

            if (!this.isActive() || matches(this.$el, 'input:focus')) {
                return;
            }

            this.toggleElement(this.tooltip, false, false).then(() => {

                actives.splice(actives.indexOf(this), 1);

                clearTimeout(this.showTimer);

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

            on(this.tooltip, 'toggled', () => {

                const toggled = this.isToggled(this.tooltip);

                attr(this.$el, 'aria-expanded', toggled);

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

        isActive() {
            return includes(actives, this);
        }

    },

    events: {

        focus: 'show',
        blur: 'hide',

        [`${pointerEnter} ${pointerLeave}`](e) {
            if (isTouch(e)) {
                return;
            }
            e.type === pointerEnter
                ? this.show()
                : this.hide();
        },

        [pointerDown](e) {
            if (!isTouch(e)) {
                return;
            }
            this.isActive()
                ? this.hide()
                : this.show();
        }

    }

};
