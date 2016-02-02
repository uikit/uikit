import $ from 'jquery';
import svgMixin from '../mixin/svg';

export default function (UIkit) {

    UIkit.component('icon', {

        mixins: [svgMixin],

        props: ['icon'],

        defaults: {
            cls: 'uk-icon'
        },

        ready() {

            if (!this.icon) {
                return;
            }

            var src = this.$el.css('background-image').slice(4, -1).replace(/"/g, '');

            this.get(src).then(doc => {

                var el = $('#'+this.icon, doc);

                if (!el) {
                    return;
                }

                var dimensions = el.attr('viewBox');
                if (dimensions) {
                    dimensions = dimensions.split(' ');
                    this.width = this.width || dimensions[2];
                    this.height = this.height || dimensions[3];
                }

                this.insert(`<svg class="${this.cls}"><use xlink:href="${src}#${this.icon}"/></svg>`)[0].classList.add('uk-icon');
            });

        }

    });

}
