import $ from 'jquery';

var svgs = {};

export default {

    props: {id: String, class: String, style: String, width: Number, height: Number, ratio: Number},

    defaults: {ratio: 1, id: false, class: '', exclude: []},

    methods: {

        get(src) {
            if (!svgs[src]) {
                svgs[src] = $.get(src);
            }

            return svgs[src];
        },

        getIcon(src, icon) {

            return this.get(src).then(doc => {

                var el = $('#' + icon, doc), svg, dimensions;

                if (!el || !el.length) {
                    return $.Deferred().reject('Icon not found.');
                }

                el = el.clone();

                dimensions = el.attr('viewBox');
                if (dimensions) {
                    dimensions = dimensions.split(' ');
                    this.width = this.width || dimensions[2];
                    this.height = this.height || dimensions[3];
                }

                svg = $($('<div>').append(el).html().replace(/symbol/g, 'svg')); // IE workaround, el[0].outerHTML

                this.width *= this.ratio;
                this.height *= this.ratio;

                for (var prop in this.$options.props) {
                    if (this[prop] && this.exclude.indexOf(prop) === -1) {
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
            });

        }

    }

};
