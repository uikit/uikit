import Class from '../mixin/class';
import { $, attr, html, toFloat, trigger } from 'uikit-util';

const units = ['days', 'hours', 'minutes', 'seconds'];

export default {
    mixins: [Class],

    props: {
        date: String,
        clsWrapper: String,
        role: String,
    },

    data: {
        date: '',
        clsWrapper: '.uk-countdown-%unit%',
        role: 'timer',
    },

    connected() {
        attr(this.$el, 'role', this.role);
        this.date = toFloat(Date.parse(this.$props.date));
        this.end = false;
        this.start();
    },

    disconnected() {
        this.stop();
    },

    events: {
        name: 'visibilitychange',

        el() {
            return document;
        },

        handler() {
            if (document.hidden) {
                this.stop();
            } else {
                this.start();
            }
        },
    },

    methods: {
        start() {
            this.stop();
            this.update();
            if (!this.timer) {
                trigger(this.$el, 'countdownstart');
                this.timer = setInterval(this.update, 1000);
            }
        },

        stop() {
            if (this.timer) {
                clearInterval(this.timer);
                trigger(this.$el, 'countdownstop');
                this.timer = null;
            }
        },

        update() {
            const timespan = getTimeSpan(this.date);

            if (!timespan.total) {
                this.stop();
                if (!this.end) {
                    trigger(this.$el, 'countdownend');
                    this.end = true;
                }
            }

            for (const unit of units) {
                const el = $(this.clsWrapper.replace('%unit%', unit), this.$el);

                if (!el) {
                    continue;
                }

                let digits = String(Math.trunc(timespan[unit]));

                digits = digits.length < 2 ? `0${digits}` : digits;

                if (el.textContent !== digits) {
                    digits = digits.split('');

                    if (digits.length !== el.children.length) {
                        html(el, digits.map(() => '<span></span>').join(''));
                    }

                    digits.forEach((digit, i) => (el.children[i].textContent = digit));
                }
            }
        },
    },
};

function getTimeSpan(date) {
    const total = Math.max(0, date - Date.now()) / 1000;

    return {
        total,
        seconds: total % 60,
        minutes: (total / 60) % 60,
        hours: (total / 60 / 60) % 24,
        days: total / 60 / 60 / 24,
    };
}
