import { $, html, toFloat, trigger } from 'uikit-util';
import Class from '../mixin/class';

const units = ['days', 'hours', 'minutes', 'seconds'];

export default {
    mixins: [Class],

    props: {
        date: String,
        clsWrapper: String,
        role: String,
        reload: Boolean,
    },

    data: {
        date: '',
        clsWrapper: '.uk-countdown-%unit%',
        role: 'timer',
        reload: false,
    },

    connected() {
        this.$el.role = this.role;
        this.date = toFloat(Date.parse(this.$props.date));
        this.started = this.end = false;
        this.start();
    },

    disconnected() {
        this.stop();
    },

    events: {
        name: 'visibilitychange',

        el: () => document,

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
                    if (this.reload && this.started) {
                        window.location.reload();
                    }
                }
            } else if (!this.timer) {
                this.started = true;
                this.timer = setInterval(this.update, 1000);
                trigger(this.$el, 'countdownstart');
            }

            for (const unit of units) {
                const el = $(this.clsWrapper.replace('%unit%', unit), this.$el);

                if (!el) {
                    continue;
                }

                let digits = Math.trunc(timespan[unit]).toString().padStart(2, '0');

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
