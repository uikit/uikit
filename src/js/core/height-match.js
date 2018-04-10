import {$$, attr, css, isUndefined, isVisible} from '../util/index';

export default function (UIkit) {

    UIkit.component('height-match', {

        args: 'target',

        props: {
            target: String,
            row: Boolean
        },

        defaults: {
            target: '> *',
            row: true
        },

        computed: {

            elements({target}, $el) {
                return $$(target, $el);
            },

            parentElements: function elements(ref, $el) {
                return $$('> *', $el);
            }

        },

        update: {

            read() {

                let lastOffset = false;

                css(this.elements, 'minHeight', '');

                const checkParents = this.target !== '> *';
                const elements = checkParents ? this.parentElements : this.elements;

                return {
                    rows: !this.row
                        ? [this.match(this.elements)]
                        : elements.reduce((rows, el, index) => {

                            if (lastOffset !== el.offsetTop) {
                                rows.push([checkParents ? this.elements[index] : el]);
                            } else {
                                rows[rows.length - 1].push(checkParents ? this.elements[index] : el);
                            }

                            lastOffset = el.offsetTop;

                            return rows;

                        }, []).map(elements => this.match(elements))
                };
            },

            write({rows}) {

                rows.forEach(({height, elements}) => css(elements, 'minHeight', height));

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

                        let style, hidden;

                        if (!isVisible(el)) {
                            style = attr(el, 'style');
                            hidden = attr(el, 'hidden');

                            attr(el, {
                                style: `${style || ''};display:block !important;`,
                                hidden: null
                            });
                        }

                        max = Math.max(max, el.offsetHeight);
                        heights.push(el.offsetHeight);

                        if (!isUndefined(style)) {
                            attr(el, {style, hidden});
                        }

                    });

                elements = elements.filter((el, i) => heights[i] < max);

                return {height: max, elements};
            }
        }

    });

}
