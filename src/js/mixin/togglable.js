import UIkit from '../api/index';
import { $, $trigger, Animation, assign, Event, fastdom, isBoolean, isUndefined, noop, promise, Transition } from '../util/index';

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
            return promise(resolve => {

                targets = $(targets).toArray();

                var all = targets => promise.all(targets.map(el => this._toggleElement(el, show, animate))),
                    toggled = targets.filter(el => this.isToggled(el)),
                    untoggled = targets.filter(el => !~toggled.indexOf(el)),
                    p;

                if (!this.queued || !isUndefined(animate) || !isUndefined(show) || !this.hasAnimation || targets.length < 2) {

                    p = all(untoggled.concat(toggled));

                } else {

                    var body = document.body,
                        scroll = body.scrollTop,
                        el = toggled[0],
                        inProgress = Animation.inProgress(el) && this.$hasClass(el, 'uk-animation-leave')
                            || Transition.inProgress(el) && el.style.height === '0px';

                    p = all(toggled);

                    if (!inProgress) {
                        p = p.then(() => {
                            var p = all(untoggled);
                            body.scrollTop = scroll;
                            return p;
                        });
                    }

                }

                p.then(resolve, noop);

            });
        },

        toggleNow(targets, show) {
            return promise(resolve => promise.all($(targets).toArray().map(el => this._toggleElement(el, show, false))).then(resolve, noop));
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

            show = isBoolean(show)
                ? show
                : Animation.inProgress(el)
                    ? this.$hasClass(el, 'uk-animation-leave')
                    : Transition.inProgress(el)
                        ? el[0].style.height === '0px'
                        : !this.isToggled(el);

            if ($trigger(el, `before${show ? 'show' : 'hide'}`, [this]).result === false) {
                return promise.reject();
            }

            var def = (animate === false || !this.hasAnimation
                ? this._toggleImmediate
                : this.hasTransition
                    ? this._toggleHeight
                    : this._toggleAnimation
            )(el, show);

            var e = Event(show ? 'show' : 'hide');
            e.preventDefault(); // workaround for Prototype and MooTools: it keeps jQuery from calling show or hide on the Element itself
            $trigger(el, e, [this]);

            return def.then(() => {
                $trigger(el, show ? 'shown' : 'hidden', [this]);
                UIkit.update(null, el);
            });
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

            var children = el.children(),
                inProgress = Transition.inProgress(el),
                inner = children.length ? parseFloat(children.first().css('margin-top')) + parseFloat(children.last().css('margin-bottom')) : 0,
                height = el[0].offsetHeight ? el.height() + (inProgress ? 0 : inner) : 0,
                endHeight;

            Transition.cancel(el);

            if (!this.isToggled(el)) {
                this._toggle(el, true);
            }

            el.height('');

            // Update child components first
            fastdom.flush();

            endHeight = el.height() + (inProgress ? 0 : inner);
            el.height(height);

            return (show
                ? Transition.start(el, assign({}, this.initProps, {overflow: 'hidden', height: endHeight}), Math.round(this.duration * (1 - height / endHeight)), this.transition)
                : Transition.start(el, this.hideProps, Math.round(this.duration * (height / endHeight)), this.transition).then(() => this._toggle(el, false))
            ).then(() => el.css(this.initProps));

        },

        _toggleAnimation(el, show) {

            if (Animation.inProgress(el)) {
                return Animation.cancel(el).then(() => {

                    if (Animation.inProgress(el)) {
                        return promise.resolve().then(() => this._toggleAnimation(el, show));
                    }

                    return this._toggleAnimation(el, show);
                });
            }

            if (show) {
                this._toggle(el, true);
                return Animation.in(el, this.animation[0], this.duration, this.origin);
            }

            return Animation.out(el, this.animation[1] || this.animation[0], this.duration, this.origin).then(() => this._toggle(el, false));
        }

    }

};
