import Class from '../mixin/class';
import { $, html } from 'uikit-util';

const units = ['days', 'hours', 'minutes', 'seconds'];

export default {
    mixins: [Class],

    props: {
        date: String,
        clsWrapper: String,
    },

    data: {
        date: '',
        clsWrapper: '.uk-countdown-%unit%',
    },

    connected() {
        this.date = Date.parse(this.$props.date);
        this.start();
    },

    disconnected() {
        this.stop();
    },

    events: [
        {
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
    ],

    methods: {
        start() {
            this.stop();
            this.update();
            this.timer = setInterval(this.update, 1000);
        },

        stop() {
            clearInterval(this.timer);
        },

        update() {
            const timespan = getTimeSpan(this.date);

            if (!this.date || timespan.total <= 0) {
                this.stop();

                timespan.days = timespan.hours = timespan.minutes = timespan.seconds = 0;
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
    const total = date - Date.now();

    return {
        total,
        seconds: (total / 1000) % 60,
        minutes: (total / 1000 / 60) % 60,
        hours: (total / 1000 / 60 / 60) % 24,
        days: total / 1000 / 60 / 60 / 24,
    };
}
