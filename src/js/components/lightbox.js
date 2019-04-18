import LightboxPanel from './lightbox-panel';
import {$$, assign, data, findIndex, on, uniqueBy} from 'uikit-util';

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

        },

        items() {
            return uniqueBy(this.toggles.map(toItem), 'source');
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
                const src = data(e.current, 'href');
                this.show(findIndex(this.items, ({source}) => source === src));
            }

        }

    ],

    methods: {

        show(index) {

            this.panel = this.panel || this.$create('lightboxPanel', assign({}, this.$props, {items: this.items}));

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
