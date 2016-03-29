import $ from 'jquery';
import {Animation, Transition} from '../util/index';

export default function (UIkit) {

    UIkit.mixin.toggable = {

        props: {
            cls: Boolean,
            animation: Boolean,
            duration: Number,
            transition: String
        },

        defaults: {
            cls: false,
            animation: false,
            duration: 200,
            transition: 'linear',
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

                var deferreds = [], toggled;

                $(targets).each((i, el) => {

                    el = $(el);

                    if (this.animation === true && animate !== false) {

                        var height = el[0].offsetHeight ? el.height() : 0;

                        Transition.stop(el);

                        toggled = this.isToggled(el);

                        if (!toggled) {
                            this.doToggle(el, true);
                        }

                        el.css('height', '');
                        var endHeight = el.height();

                        el.height(height);

                        if ((!toggled && show !== false) || show === true) {
                            deferreds.push(Transition.start(el, {
                                overflow: 'hidden',
                                height: endHeight,
                                'padding-bottom': '',
                                'margin-bottom': ''
                            }, Math.round(this.duration * (1 - height / endHeight)), this.transition));
                            this.doUpdate(el);

                        } else {
                            deferreds.push(Transition.start(el, {
                                overflow: 'hidden',
                                height: 0,
                                'padding-bottom': 0,
                                'margin-bottom': 0
                            }, Math.round(this.duration * (height / endHeight)), this.transition).then(() => {
                                this.doUpdate(el);
                                this.doToggle(el, false);
                            }));
                        }

                    } else if (this.animation && animate !== false) {

                        Animation.cancel(el);

                        toggled = this.isToggled(el);

                        if ((!toggled && show !== false) || show === true) {

                            this.doToggle(el, true);
                            deferreds.push(Animation.in(el, this.animation[0], this.duration));
                            this.doUpdate(el);

                        } else {

                            deferreds.push(Animation.out(el, this.animation[1], this.duration).then(() => {
                                this.doToggle(el, false);
                                this.doUpdate(el);
                            }));

                        }

                    } else {                        
                        toggled = this.isToggled(el);
                        this.doToggle(el, typeof show === 'boolean' ? show : !toggled);
                        this.doUpdate(el);
                        deferreds.push($.Deferred().resolve());
                    }
                });

                return $.when.apply(null, deferreds);
            },

            doToggle(el, toggled) {
                el = $(el);

                if (this.cls) {
                    el.toggleClass(this.cls, toggled)
                } else {
                    el.attr('hidden', !toggled);
                }
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
