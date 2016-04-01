import $ from 'jquery';
import {Animation, isString, Transition} from '../util/index';

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

            if (isString(this.animation)) {

                this.animation = this.animation.split(',');

                if (this.animation.length == 1) {
                    this.animation[1] = this.animation[0];
                }

                this.animation[0] = this.animation[0].trim();
                this.animation[1] = this.animation[1].trim();

            }

        },

        methods: {

            toggleElement(targets, show, animate) {

                var deferreds = [], toggled;

                $(targets).each((i, el) => {

                    el = $(el);

                    toggled = this.isToggled(el);

                    el.trigger(`before${toggled ? 'hide' : 'show'}`, [this]);

                    deferreds.push(this.animation === true && animate !== false
                        ? this.toggleTransition(el, show)
                        : this.animation && animate !== false
                            ? this.toggleAnimation(el, show)
                            : this.toggleNow(el, show)
                    );

                    el.trigger(toggled ? 'hide' : 'show', [this]);
                });

                return $.when.apply(null, deferreds);
            },

            toggleNow(el, show) {

                el = $(el);

                var toggled = this.isToggled(el);
                this._toggle(el, typeof show === 'boolean' ? show : !toggled);

                return $.Deferred().resolve();
            },

            toggleTransition(el, show) {

                el = $(el);

                var transition,
                    height = el[0].offsetHeight ? el.height() : 0,
                    hideProps = {
                        overflow: 'hidden',
                        height: 0,
                        'padding-top': 0,
                        'padding-bottom': 0,
                        'margin-top': 0,
                        'margin-bottom': 0
                    },
                    inProgress = Transition.inProgress(el);

                Transition.stop(el);

                var toggled = this.isToggled(el);

                if (!toggled) {
                    this._toggle(el, true);
                }

                el.css('height', '');
                var endHeight = el.height();

                el.height(height);

                if ((!toggled && show !== false) || show === true) {

                    if (!inProgress) {
                        el.css(hideProps);
                    }

                    transition = Transition.start(el, {
                        overflow: 'hidden',
                        height: endHeight,
                        'padding-top': '',
                        'padding-bottom': '',
                        'margin-top': '',
                        'margin-bottom': ''
                    }, Math.round(this.duration * (1 - height / endHeight)), this.transition);


                } else {
                    transition = Transition
                        .start(el, hideProps, Math.round(this.duration * (height / endHeight)), this.transition)
                        .then(() => this._toggle(el, false));
                }

                return transition;
            },

            toggleAnimation(el, show) {

                el = $(el);

                Animation.cancel(el);

                var animation, toggled = this.isToggled(el);

                if ((!toggled && show !== false) || show === true) {

                    this._toggle(el, true);
                    animation = Animation.in(el, this.animation[0], this.duration);

                } else {
                    animation = Animation
                        .out(el, this.animation[1], this.duration)
                        .then(() => this._toggle(el, false));
                }

                return animation;
            },

            _toggle(el, toggled) {
                el = $(el);

                if (this.cls) {
                    el.toggleClass(this.cls, toggled)
                } else {
                    el.attr('hidden', !toggled);
                }

                this.updateAria(el);
                this.$update(null, el);
            },

            isToggled(el) {
                el = $(el);
                return this.cls ? el.hasClass(this.cls) : !el.attr('hidden');
            },

            updateAria(el) {
                if (this.aria) {
                    el.attr('aria-hidden', !this.isToggled(el));
                }
            }

        }

    };

};
