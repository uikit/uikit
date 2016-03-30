import {isWithin, each} from '../util/index';

export default function (UIkit) {

    UIkit.component('toggler', {

        props: {
            href: 'jQuery',
            target: 'jQuery',
            mode: String
        },

        defaults: {
            href: false,
            target: false,
            mode: false
        },

        ready() {

            this.target = this.target || this.href;

            if (!this.target) {
                return;
            }

            var target, targets = UIkit.getComponents(this.target[0]);

            each(targets, (i, component) => {
                if (component.isToggled) {
                    target = component;
                    return false;
                }
            });

            if (!target) {
                return;
            }

            var mode = this.mode || target.mode;

            target.target = this.$el;

            this.$el.on('click', e => {

                if (!isWithin(e.target, this.target)) {
                    e.preventDefault();
                }

                if (target.isToggled(target.$el)) {
                    target.hide(true, this.$el);
                } else {
                    target.show(true, this.$el);
                }

            });

            this.$el.attr('aria-expanded', false);

            if (mode === 'hover') {

                this.$el
                    .on('mouseenter', () => target.show(false, this.$el))
                    .on('mouseleave', () => target.hide(false, this.$el));

                target
                    .on('mouseenter', () => target.show(false, this.$el))
                    .on('mouseleave', () => target.hide(false, this.$el));
            }

            target.$el
                .on('beforeshow', () => this.$el.addClass(target.cls).attr('aria-expanded', 'true'))
                .on('beforehide', () => this.$el.removeClass(target.cls).attr('aria-expanded', 'false').find('a, button').blur());
        }

    });

}
