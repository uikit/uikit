import Class from '../mixin/class';
import {$, $$, css} from 'uikit-util';

export default {

    mixins: [Class],

    props: {
        height: String
    },

    data: {
        height: '300px',
        attrItem: 'uk-table-scrollable',
        tbody: null,
        ths: [],
        tds: [],
    },

    connected() {
        this.ths   = $$('thead tr:first-child th', this.$el);
        this.tbody = $('tbody', this.$el);
        this.tds   = $$('tr:first-child td', this.tbody);

        css(this.tbody, 'height', this.height);
        this.equilibrateHeader();
    },

    events: [
        {
            name: 'resize',
            el: window,
            handler() { this.equilibrateHeader(); }
        }

    ],

    methods: {

        equilibrateHeader() {
            this.tds.forEach((el, key) => {
                css(this.ths[key], 'width', css(el, 'width'));
            });
        }

    }

};