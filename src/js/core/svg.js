import svgMixin from '../mixin/svg';

export default function (UIkit) {

    UIkit.component('svg', {

        mixins: [svgMixin],

        props: ['src'],

        ready() {

            if (this.src.indexOf('#') !== -1) {

                this.insert(`<svg><use xlink:href="${this.src}"/></svg>`);

            } else {

                this.get(this.src).then(doc => {

                    if (!doc.documentElement || doc.documentElement.tagName.toLowerCase() !== 'svg') {
                        return;
                    }

                    this.replace(doc.documentElement);
                });

            }

        }

    });

}
