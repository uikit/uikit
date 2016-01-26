import $ from 'jquery';

export default function (UIkit) {

    UIkit.component('svg', {

        props: ['id', 'class', 'style', 'width', 'height', 'src'],

        ready() {

            $.get(this.src, doc => {

                var $svg = $(doc.documentElement);

                for (var prop in this.$options.props) {
                    if (prop !== 'src' && this[prop]) {
                        $svg.attr(prop, this[prop]);
                    }
                }

                if (this.width && !this.height) {
                    $svg.removeAttr('height');
                }

                if (this.height && !this.width) {
                    $svg.removeAttr('width');
                }

                this.$el.replaceWith($svg);

            });

        }

    });

}
