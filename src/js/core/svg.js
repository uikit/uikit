import {toJQuery} from '../util/index';

export default function (UIkit) {

    UIkit.component('svg', {

        mixins: [UIkit.mixin.svg],

        props: ['src'],

        defaults: {exclude: ['src']},

        ready() {

            if (this.src.indexOf('#') !== -1) {

                var parts = this.src.split('#');

                if (parts.length < 2) {
                    return;
                }

                this.getIcon(parts[0], parts[1]).then(this.$replace.bind(this));

            } else {

                this.get(this.src).then(doc => {

                    var svg = toJQuery(doc);

                    if (!svg) {
                        return;
                    }

                    this.$replace(this.addProps(svg));
                });

            }

        }

    });

}
