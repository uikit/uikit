import UIkit from '../api/index';
import { $, Animation, extend, promise, Transition } from '../util/index';

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

    methods: {

        toggleElement(targets, show, animate) {

            var queued = this.queued && !!this.animation[0], toggles, body = document.body, scroll = body.scrollTop,
                all = targets => promise.all(targets.toArray().map(el => this._toggleElement(el, show, animate))).then(null, () => {}),
                delay = targets => {
                    var def = all(targets);
                    queued = true;
                    body.scrollTop = scroll;
                    return def;
                };

            targets = $(targets);

            if (!queued || targets.length < 2) {
                return all(targets);
            }

            if (queued !== true) {
                return delay(targets.not(queued));
            }

            queued = targets.not(toggles = targets.filter((_, el) => this.isToggled(el)));

            return all(toggles).then(() => queued !== true && delay(queued));
        },

        toggleNow(targets, show) {
            return promise.all($(targets).toArray().map(el => this._toggleElement(el, show, false))).then(null, () => {});
        },

        isToggled(el) {
            el = $(el);
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

            var event = $.Event(`before${show ? 'show' : 'hide'}`);
            el.trigger(event, [this]);

            var delay = false;
            if (event.result === false) {
                return promise.reject();
            } else if (event.result && event.result.then) {
                delay = event.result;
            }

            var promise = (this.animation[0] === true && animate !== false
                ? this._toggleHeight
                : this.animation[0] && animate !== false
                    ? this._toggleAnimation
                    : this._toggleImmediate
            )(el, show);

            var handler = () => {
                el.trigger(show ? 'show' : 'hide', [this]);
                return promise.then(() => el.trigger(show ? 'shown' : 'hidden', [this]));
            };

            return delay ? delay.then(handler) : handler();
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

                el.css('height', '');
                endHeight = el.height() + (inProgress ? 0 : inner);
                el.height(height);

                return show
                    ? Transition.start(el, extend(this.initProps, {overflow: 'hidden', height: endHeight}), Math.round(this.duration * (1 - height / endHeight)), this.transition)
                    : Transition.start(el, this.hideProps, Math.round(this.duration * (height / endHeight)), this.transition).then(() => {
                            this._toggle(el, false);
                            el.css(this.initProps);
                        });

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
