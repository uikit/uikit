import $ from 'jquery';
import svgMixin from '../mixin/svg';

export default function (UIkit) {

    UIkit.component('svg', {

        mixins: [svgMixin],

        props: ['src'],

        ready() {

            if (this.src.indexOf('#') !== -1) {

                var parts = this.src.split('#');

                if (parts.length < 2) {
                    return;
                }

                this.getIcon(parts[0], parts[1]).then((icon) => { this.replace(icon); });

            } else {

                this.get(this.src).then(doc => {

                    if (!doc.documentElement || doc.documentElement.tagName.toLowerCase() !== 'svg') {
                        return;
                    }

                    this.replace($(doc.documentElement).clone());
                });

            }

        }

    });

}
