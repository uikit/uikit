import $ from 'jquery';

var svgs = {};

export default {

    props: ['id', 'class', 'style', 'width', 'height'],

    methods: {

        get(src) {
            if (!svgs[src]) {
                svgs[src] = $.get(src);
            }

            return svgs[src];
        },

        insert(svg) {

            svg = $(svg);

            for (var prop in this.$options.props) {
                if (prop !== 'src' && this[prop]) {
                    svg.attr(prop, this[prop]);
                }
            }

            if (this.width && !this.height) {
                svg.removeAttr('height');
            }

            if (this.height && !this.width) {
                svg.removeAttr('width');
            }

            this.$el.replaceWith(svg[0].outerHTML);

        }

    }

};
