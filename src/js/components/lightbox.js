import LightboxPanel from './lightbox-panel';
import {$$, assign, data, index} from 'uikit-util';

export default {

    attrs: true,

    props: assign({toggle: String}, LightboxPanel.props),

    data: assign({toggle: 'a'}, Object.keys(LightboxPanel.props).reduce((data, key) => {
        data[key] = LightboxPanel.data[key];
        return data;
    }, {})),

    computed: {

        toggles({toggle}, $el) {
            return $$(toggle, $el);
        }

    },

    disconnected() {
        this._destroy();
    },

    events: [

        {

            name: 'click',

            delegate() {
                return `${this.toggle}:not(.uk-disabled)`;
            },

            handler(e) {
                e.preventDefault();
                e.current.blur();
                this.show(index(this.toggles, e.current));
            }

        }

    ],

    update(data) {

        data.toggles = data.toggles || this.toggles;

        if (this.panel && this.animation) {
            this.panel.$props.animation = this.animation;
            this.panel.$emit();
        }

        if (!this.panel || isEqualList(data.toggles, this.toggles)) {
            return;
        }

        data.toggles = this.toggles;
        this._destroy();
        this._init();

    },

    methods: {

        _init() {
            return this.panel = this.panel || this.$create('lightboxPanel', assign({}, this.$props, {
                items: this.toggles.reduce((items, el) => {
                    items.push(['href', 'caption', 'type', 'poster', 'alt'].reduce((obj, attr) => {
                        obj[attr === 'href' ? 'source' : attr] = data(el, attr);
                        return obj;
                    }, {}));
                    return items;
                }, [])
            }));
        },

        _destroy() {
            if (this.panel) {
                this.panel.$destroy(true);
                this.panel = null;
            }
        },

        show(index) {

            if (!this.panel) {
                this._init();
            }

            return this.panel.show(index);

        },

        hide() {

            return this.panel && this.panel.hide();

        }

    }

};

function isEqualList(listA, listB) {
    return listA.length === listB.length
        && listA.every((el, i) => el === listB[i]);
}
