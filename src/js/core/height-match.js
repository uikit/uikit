import {getRows} from './margin';
import {$$, css, offset} from 'uikit-util';

export default {

    args: 'target',

    props: {
        target: String,
        row: Boolean
    },

    data: {
        target: '> *',
        row: true
    },

    computed: {

        elements({target}, $el) {
            return $$(target, $el);
        }

    },

    update: {

        read() {

            css(this.elements, {
                minHeight: '',
                boxSizing: ''
            });

            return {
                rows: !this.row
                    ? [this.match(this.elements)]
                    : getRows(this.elements).map(elements => this.match(elements))
            };
        },

        write({rows}) {

            rows.forEach(({height, elements}) => css(elements, {
                minHeight: height,
                boxSizing: 'border-box'
            }));

        },

        events: ['load', 'resize']

    },

    methods: {

        match(elements) {

            if (elements.length < 2) {
                return {};
            }

            const heights = [];
            let max = 0;

            elements
                .forEach(el => {
                    const {height} = offset(el);
                    max = Math.max(max, height);
                    heights.push(height);
                });

            elements = elements.filter((el, i) => heights[i] < max);

            return {height: max, elements};
        }
    }

};
