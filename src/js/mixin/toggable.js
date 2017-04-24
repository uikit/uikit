import UIkit from '../api/index';
import { $, Animation, Event, extend, promise, requestAnimationFrame, Transition } from '../util/index';

export default {

    props: {
        cls: Boolean,
        animation: 'list',
        duration: Number,
        origin: String,
        transition: String,
        queued: Boolean
    },

    defaults: {
        cls: false,
        animation: [false],
        duration: 200,
        origin: false,
        transition: 'linear',
        queued: false,

        initProps: {
            overflow: '',
            height: '',
            paddingTop: '',
            paddingBottom: '',
            marginTop: '',
            marginBottom: ''
        },

        hideProps: {
            overflow: 'hidden',
            height: 0,
            paddingTop: 0,
            paddingBottom: 0,
            marginTop: 0,
            marginBottom: 0
        }

    },

    computed: {

        hasAnimation() {
            return !!this.animation[0];
        },

        hasTransition() {
            return this.hasAnimation && this.animation[0] === true;
        }

    },

    methods: {

        toggleElement(targets, show, animate) {

            var toggles, body = document.body, scroll = body.scrollTop,
                all = targets => promise.all(targets.toArray().map(el => this._toggleElement(el, show, animate))).then(null, () => {}),
                delay = targets => {
                    var def = all(targets);
                    this._queued = null;
                    body.scrollTop = scroll;
                    return def;
                };

            targets = $(targets);

            if (!this.hasAnimation || !this.queued || targets.length < 2) {
                return all(targets);
            }

            if (this._queued) {
                return delay(targets.not(this._queued));
            }

            this._queued = targets.not(toggles = targets.filter((_, el) => this.isToggled(el)));

            return all(toggles).then(() => this._queued && delay(this._queued));
        },

        toggleNow(targets, show) {
            return promise.all($(targets).toArray().map(el => this._toggleElement(el, show, false))).then(null, () => {});
        },

        isToggled(el) {
            el = el && $(el) || this.$el;
            return this.cls ? el.hasClass(this.cls.split(' ')[0]) : !el.attr('hidden');
        },

        updateAria(el) {
            if (this.cls === false) {
                el.attr('aria-hidden', !this.isToggled(el));
            }
        },

        _toggleElement(el, show, animate) {

            el = $(el);

            if (Animation.inProgress(el)) {
                return Animation.cancel(el).then(() => this._toggleElement(el, show, animate));
            }

            show = typeof show === 'boolean' ? show : !this.isToggled(el);

            var event = Event(`before${show ? 'show' : 'hide'}`);
            el.trigger(event, [this]);

            if (event.result === false) {
                return promise.reject();
            }

            var def = (animate === false || !this.hasAnimation
                ? this._toggleImmediate
                : this.hasTransition
                    ? this._toggleHeight
                    : this._toggleAnimation
            )(el, show);

            el.trigger(show ? 'show' : 'hide', [this]);
            return def.then(() => el.trigger(show ? 'shown' : 'hidden', [this]));
        },

        _toggle(el, toggled) {

            el = $(el);

            if (this.cls) {
                el.toggleClass(this.cls, ~this.cls.indexOf(' ') ? undefined : toggled);
            } else {
                el.attr('hidden', !toggled);
            }

            el.find('[autofocus]:visible').focus();

            this.updateAria(el);
            UIkit.update(null, el);
        },

        _toggleImmediate(el, show) {
            this._toggle(el, show);
            return promise.resolve();
        },

        _toggleHeight(el, show) {

            var inProgress = Transition.inProgress(el),
                inner = parseFloat(el.children().first().css('margin-top')) + parseFloat(el.children().last().css('margin-bottom')),
                height = el[0].offsetHeight ? el.height() + (inProgress ? 0 : inner) : 0,
                endHeight;

            return Transition.cancel(el).then(() => {

                if (!this.isToggled(el)) {
                    this._toggle(el, true);
                }

                el.height('');

                return promise(resolve =>
                    // Allow for child components to update first
                    requestAnimationFrame(() => {

                        endHeight = el.height() + (inProgress ? 0 : inner);
                        el.height(height);

                        (show
                            ? Transition.start(el, extend(this.initProps, {overflow: 'hidden', height: endHeight}), Math.round(this.duration * (1 - height / endHeight)), this.transition)
                            : Transition.start(el, this.hideProps, Math.round(this.duration * (height / endHeight)), this.transition).then(() => {
                                this._toggle(el, false);
                                el.css(this.initProps);
                            })).then(resolve);

                    })
                );

            });

        },

        _toggleAnimation(el, show) {

            if (show) {
                this._toggle(el, true);
                return Animation.in(el, this.animation[0], this.duration, this.origin);
            }

            return Animation.out(el, this.animation[1] || this.animation[0], this.duration, this.origin).then(() => this._toggle(el, false));
        }

    }

};
