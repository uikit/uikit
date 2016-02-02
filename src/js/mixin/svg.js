import $ from 'jquery';

var svgs = {};

export default {

    props: {id: String, class: String, style: String, width: Number, height: Number, ratio: Number},

    defaults: {ratio: 1},

    methods: {

        get(src) {
            if (!svgs[src]) {
                svgs[src] = $.get(src);
            }

            return svgs[src];
        },

        insert(svg) {

            svg = $(svg);

            this.width *= this.ratio;
            this.height *= this.ratio;

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

            return $(svg[0].outerHTML).replaceAll(this.$el);

        }

    }

};
