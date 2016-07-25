import $ from 'jquery';
import {Animation, extend, isString, Transition} from '../util/index';

export default {

    props: {
        cls: Boolean,
        animation: Boolean,
        duration: Number,
        origin: String,
        transition: String,
        queued: Boolean
    },

    defaults: {
        cls: false,
        animation: false,
        duration: 200,
        origin: false,
        transition: 'linear',
        queued: false
    },

    ready() {

        if (isString(this.animation)) {

            this.animation = this.animation.split(',');

            if (this.animation.length === 1) {
                this.animation[1] = this.animation[0];
            }

            this.animation = this.animation.map(animation => animation.trim());

        }

    },

    methods: {

        toggleElement(targets, show, animate) {

            var all = targets => $.when.apply($, targets.toArray().map(el => this._toggleElement(el, show, animate))),
                toggles, res, win = $(window), scroll = win.scrollTop();

            targets = $(targets);

            if (!this.queued) {
                return all(targets);
            }

            if (this.queued !== true) {
                toggles = targets.not(this.queued);
                this.queued = true;
                res = all(toggles);
                win.scrollTop(scroll);
                return res;
            }

            this.queued = targets.not(toggles = targets.filter((_, el) => this.isToggled(el)));

            return all(toggles).then(() => {
                if (this.queued !== true) {
                    res = all(this.queued);
                    this.queued = true;
                    win.scrollTop(scroll);
                    return res;
                }

            });
        },

        toggleNow(el, show) {
            return this.toggleElement(el, show, false);
        },

        _toggleElement(el, show, animate) {

            el = $(el);

            var toggled, deferred;

            Animation.cancel(el);

            toggled = typeof show === 'boolean' ? !show : this.isToggled(el);

            var event = $.Event(`before${toggled ? 'hide' : 'show'}`);
            el.trigger(event, [this]);

            if (event.result === false) {
                return;
            }

            if (this.animation === true && animate !== false) {

                var inProgress = Transition.inProgress(el),
                    inner = parseFloat(el.children().first().css('margin-top')) + parseFloat(el.children().last().css('margin-bottom')),
                    height = el[0].offsetHeight ? el.height() + (inProgress ? 0 : inner) : 0,
                    initProps = {
                        overflow: '',
                        height: '',
                        paddingTop: '',
                        paddingBottom: '',
                        marginTop: '',
                        marginBottom: ''
                    },
                    hideProps = {
                        overflow: 'hidden',
                        height: 0,
                        paddingTop: 0,
                        paddingBottom: 0,
                        marginTop: 0,
                        marginBottom: 0
                    };

                Transition.stop(el);

                toggled = this.isToggled(el);

                if (!toggled) {
                    this._toggle(el, true);
                }

                el.css('height', '');
                var endHeight = el.height() + inner;

                el.height(height);

                if ((!toggled && show !== false) || show === true) {

                    if (!inProgress) {
                        el.css(hideProps);
                    }

                    deferred = Transition.start(el, extend(initProps, {
                        overflow: 'hidden',
                        height: endHeight
                    }), Math.round(this.duration * (1 - height / endHeight)), this.transition);

                } else {

                    deferred = Transition
                        .start(el, hideProps, Math.round(this.duration * (height / endHeight)), this.transition)
                        .then(() => {
                            this._toggle(el, false);
                            el.css(initProps);
                        });

                }

            } else if (this.animation && animate !== false) {

                if ((!toggled && show !== false) || show === true) {

                    this._toggle(el, true);
                    deferred = Animation.in(el, this.animation[0], this.duration, this.origin);

                } else {
                    deferred = Animation
                        .out(el, this.animation[1], this.duration, this.origin)
                        .then(() => this._toggle(el, false));
                }

            } else {
                this._toggle(el, !toggled);
                deferred = $.Deferred().resolve();
            }

            el.trigger(toggled ? 'hide' : 'show', [this]);
            return deferred;
        },

        _toggle(el, toggled) {
            el = $(el);

            if (this.cls) {

                if (this.cls.indexOf(' ') != -1) {
                    el.toggleClass(this.cls);
                } else {
                    el.toggleClass(this.cls, toggled);
                }

            } else {
                el.attr('hidden', !toggled);
            }

            el.find('[autofocus]:visible').focus();

            this.updateAria(el);
            this.$update(null, el);
        },

        isToggled(el) {
            el = $(el);
            return this.cls ? el.hasClass(this.cls.split(' ')[0]) : !el.attr('hidden');
        },

        updateAria(el) {
            if (this.cls === false) {
                el.attr('aria-hidden', !this.isToggled(el));
            }
        }

    }

};
