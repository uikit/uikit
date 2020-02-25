import LightboxPanel from './lightbox-panel';
import {$$, assign, data, findIndex, isElement, on, uniqueBy} from 'uikit-util';

export default {

    install,

    props: {toggle: String},

    data: {toggle: 'a'},

    computed: {

        toggles: {

            get({toggle}, $el) {
                return $$(toggle, $el);
            },

            watch() {
                this.hide();
            }

        }

    },

    disconnected() {
        this.hide();
    },

    events: [

        {

            name: 'click',

            delegate() {
                return `${this.toggle}:not(.uk-disabled)`;
            },

            handler(e) {
                e.preventDefault();
                this.show(e.current);
            }

        }

    ],

    methods: {

        show(index) {

            const items = uniqueBy(this.toggles.map(toItem), 'source');

            if (isElement(index)) {
                const {source} = toItem(index);
                index = findIndex(items, ({source: src}) => source === src);
            }

            this.panel = this.panel || this.$create('lightboxPanel', assign({}, this.$props, {items}));

            on(this.panel.$el, 'hidden', () => this.panel = false);

            return this.panel.show(index);

        },

        hide() {

            return this.panel && this.panel.hide();

        }

    }

};

function install(UIkit, Lightbox) {

    if (!UIkit.lightboxPanel) {
        UIkit.component('lightboxPanel', LightboxPanel);
    }

    assign(
        Lightbox.props,
        UIkit.component('lightboxPanel').options.props
    );

}

function toItem(el) {
    return ['href', 'caption', 'type', 'poster', 'alt'].reduce((obj, attr) => {
        obj[attr === 'href' ? 'source' : attr] = data(el, attr);
        return obj;
    }, {});
}
