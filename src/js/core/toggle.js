import {each, hasTouch, isWithin} from '../util/index';

export default function (UIkit) {

    UIkit.component('toggle', {

        mixins: [UIkit.mixin.toggable],

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
                if (component.doToggle) {
                    target = component;
                    return false;
                }
            });

            var mode = hasTouch ? 'click' : this.mode;
            
            if (target) {
                
                mode = this.mode || target.mode;

                target.target = this.$el;

                this.$el.on('click', e => {

                    if (!isWithin(e.target, this.target)) {
                        e.preventDefault();
                    }

                    target.doToggle(this.$el);

                });

                this.$el.attr('aria-expanded', false);

                if (mode === 'hover') {
                    this.$el.add(target.$el)
                        .on('mouseenter', () => target.show(this.$el))
                        .on('mouseleave', () => target.hide(this.$el));
                }

                target.$el
                    .on('beforeshow', () => this.$el.addClass(target.cls).attr('aria-expanded', 'true'))
                    .on('beforehide', () => this.$el.removeClass(target.cls).attr('aria-expanded', 'false').find('a, button').blur());
            } else {

                this.aria = this.cls === false;
                this.updateAria(this.target);

                this.$el.on('click', e => {
                    e.preventDefault();
                    this.toggleElement(this.target);
                });

            }
        }

    });

}
