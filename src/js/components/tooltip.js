import Container from '../mixin/container';
import Togglable from '../mixin/togglable';
import Position from '../mixin/position';
import {append, attr, flipPosition, hasAttr, includes, isTouch, isVisible, matches, on, pointerDown, pointerEnter, pointerLeave, remove, within} from 'uikit-util';

const actives = [];

export default {

    attrs: true,

    args: 'title',

    mixins: [Container, Togglable, Position],

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

            if (includes(actives, this)) {
                return;
            }

            actives.forEach(active => active.hide());
            actives.push(this);

            this._unbind = on(document, 'click', e => !within(e.target, this.$el) && this.hide());

            clearTimeout(this.showTimer);

            this.tooltip = append(this.container, `<div class="${this.clsPos}" aria-hidden><div class="${this.clsPos}-inner">${this.title}</div></div>`);

            attr(this.$el, 'aria-expanded', true);

            this.positionAt(this.tooltip, this.$el);

            this.origin = this.getAxis() === 'y' ? `${flipPosition(this.dir)}-${this.align}` : `${this.align}-${flipPosition(this.dir)}`;

            this.showTimer = setTimeout(() => {

                this.toggleElement(this.tooltip, true);

                this.hideTimer = setInterval(() => {

                    if (!isVisible(this.$el)) {
                        this.hide();
                    }

                }, 150);

            }, this.delay);
        },

        hide() {

            const index = actives.indexOf(this);

            if (!~index || matches(this.$el, 'input') && this.$el === document.activeElement) {
                return;
            }

            actives.splice(index, 1);

            clearTimeout(this.showTimer);
            clearInterval(this.hideTimer);
            attr(this.$el, 'aria-expanded', false);
            this.toggleElement(this.tooltip, false);
            this.tooltip && remove(this.tooltip);
            this.tooltip = false;
            this._unbind();

        }

    },

    events: {

        [`focus ${pointerEnter} ${pointerDown}`](e) {
            if (e.type !== pointerDown || !isTouch(e)) {
                this.show();
            }
        },

        blur: 'hide',

        [pointerLeave](e) {
            if (!isTouch(e)) {
                this.hide();
            }
        }

    }

};
