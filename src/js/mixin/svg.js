import $ from 'jquery';

var svgs = {};

export default {

    props: {id: String, class: String, style: String, width: Number, height: Number, ratio: Number},

    defaults: {ratio: 1, id: false, class: ''},

    methods: {

        get(src) {
            if (!svgs[src]) {
                svgs[src] = $.get(src);
            }

            return svgs[src];
        },

        getIcon(src, icon) {

            return this.get(src).then(doc => {

                var el = $('#' + icon, doc);

                if (!el) {
                    return;
                }

                el = el.clone();

                var dimensions = el.attr('viewBox');
                if (dimensions) {
                    dimensions = dimensions.split(' ');
                    this.width = this.width || dimensions[2];
                    this.height = this.height || dimensions[3];
                }

                return $('<div>').append(el).html().replace(/symbol/g, 'svg'); // IE workaround, el[0].outerHTML
            });

        },

        replace(svg) {
            this.$replace(this.setProperties(svg));
        },

        insert(svg) {
            this.$el.append(this.setProperties(svg));
        },

        setProperties(svg) {

            svg = $(svg);

            this.width *= this.ratio;
            this.height *= this.ratio;

            for (var prop in this.$options.props) {
                if (prop !== 'src' && this[prop]) {
                    svg.attr(prop, this[prop]);
                }
            }

            if (!this.id) {
                svg.removeAttr('id');
            }

            if (this.width && !this.height) {
                svg.removeAttr('height');
            }

            if (this.height && !this.width) {
                svg.removeAttr('width');
            }

            return svg;
        }

    }

};
