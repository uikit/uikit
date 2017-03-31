import { $ } from '../util/index';

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

            elements() {
                return $(this.target, this.$el);
            }

        },

        update: {

            read() {

                var lastOffset = false;

                this.elements.css('minHeight', '');

                this.rows = !this.row
                    ? [this.match(this.elements)]
                    : this.elements.toArray().reduce((rows, el) => {

                        if (lastOffset !== el.offsetTop) {
                            rows.push([el]);
                        } else {
                            rows[rows.length - 1].push(el);
                        }

                        lastOffset = el.offsetTop;

                        return rows;

                    }, []).map(elements => this.match($(elements)));
            },

            write() {

                this.rows.forEach(({height, elements}) =>
                    elements && elements.each((_, el) =>
                        el.style.minHeight = `${height}px`
                    )
                );

            },

            events: ['resize']

        },

        methods: {

            match(elements) {

                if (elements.length < 2) {
                    return {};
                }

                var max = 0, heights = [];

                elements = elements
                    .each((_, el) => {

                        var $el, style, hidden;

                        if (el.offsetHeight === 0) {
                            $el = $(el);
                            style = $el.attr('style') || null;
                            hidden = $el.attr('hidden') || null;

                            $el.attr({
                                style: `${style};display:block !important;`,
                                hidden: null
                            });
                        }

                        max = Math.max(max, el.offsetHeight);
                        heights.push(el.offsetHeight);

                        if ($el) {
                            $el.attr({style, hidden});
                        }

                    })
                    .filter(i => heights[i] < max);

                return {height: max, elements};
            }
        }

    });

}
