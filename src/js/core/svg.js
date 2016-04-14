import {toJQuery} from '../util/index';

export default function (UIkit) {

    UIkit.component('svg', {

        mixins: [UIkit.mixin.svg],

        props: ['src'],

        defaults: {exclude: ['src']},

        ready() {

            this.$el.attr({hidden: true, id: ''});

            if (this.src.indexOf('#') !== -1) {

                var parts = this.src.split('#');

                if (parts.length < 2) {
                    return;
                }

                this.getIcon(parts[0], parts[1]).then((icon) => icon.insertAfter(this.$el));

            } else {

                this.get(this.src).then(doc => {

                    var svg = toJQuery(doc);

                    if (!svg) {
                        return;
                    }

                    this.addProps(svg).insertAfter(this.$el);
                });

            }

        }

    });

}
