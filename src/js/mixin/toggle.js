import $ from 'jquery';
import {Animation} from '../util/index';

export default function (UIkit) {

    UIkit.mixin.toggle = {

        props: {
            cls: Boolean,
            animation: String,
            duration: Number
        },

        defaults: {
            cls: false,
            animation: false,
            duration: 200,
            aria: true
        },

        ready() {

            if (typeof this.animation === 'string') {

                this.animation = this.animation.split(',');

                if (this.animation.length == 1) {
                    this.animation[1] = this.animation[0];
                }

                this.animation[0] = this.animation[0].trim();
                this.animation[1] = this.animation[1].trim();

            }

        },

        methods: {

            toggleState(targets, animate, show) {

                var deferreds = [];

                $(targets).each((i, el) => {

                    el = $(el);

                    var toggled = this.isToggled(el);

                    if (show === true && toggled || show === false && !toggled) {
                        return;
                    }

                    if (this.animation && animate !== false) {

                        Animation.cancel(el);

                        if (!this.isToggled(el)) {

                            this.doToggle(el, true);
                            deferreds.push(Animation.in(el, this.animation[0], this.duration).then(() => {
                                this.doUpdate(el);
                            }));

                        } else {

                            deferreds.push(Animation.out(el, this.animation[1], this.duration).then(() => {
                                this.doToggle(el, false);
                                this.doUpdate(el);
                            }));

                        }

                    } else {

                        this.doToggle(el, !toggled);
                        this.doUpdate(el);
                        deferreds.push($.Deferred().resolve());
                    }
                });

                return $.when.apply(null, deferreds);
            },

            doToggle(el, toggled) {
                el = $(el);
                el.toggleClass(this.cls, this.cls && toggled).attr('hidden', !this.cls && !toggled);
            },

            isToggled(el) {
                el = $(el);
                return this.cls ? el.hasClass(this.cls) : !el.attr('hidden');
            },

            doUpdate(el) {
                this.updateAria(el);
                this.$update(null, el);
            },

            updateAria(el) {
                if (this.aria) {
                    el.attr('aria-hidden', !this.isToggled(el));
                }
            }

        }

    };

};
