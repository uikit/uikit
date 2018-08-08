import Class from '../mixin/class';
import {$, empty, html} from 'uikit-util';

export default {

    mixins: [Class],

    props: {
        date: String,
        clsWrapper: String
    },

    data: {
        date: '',
        clsWrapper: '.uk-countdown-%unit%'
    },

    computed: {

        date({date}) {
            return Date.parse(date);
        },

        days({clsWrapper}, $el) {
            return $(clsWrapper.replace('%unit%', 'days'), $el);
        },

        hours({clsWrapper}, $el) {
            return $(clsWrapper.replace('%unit%', 'hours'), $el);
        },

        minutes({clsWrapper}, $el) {
            return $(clsWrapper.replace('%unit%', 'minutes'), $el);
        },

        seconds({clsWrapper}, $el) {
            return $(clsWrapper.replace('%unit%', 'seconds'), $el);
        },

        units() {
            return ['days', 'hours', 'minutes', 'seconds'].filter(unit => this[unit]);
        }

    },

    connected() {
        this.start();
    },

    disconnected() {
        this.stop();
        this.units.forEach(unit => empty(this[unit]));
    },

    events: [

        {

            name: 'visibilitychange',

            el: document,

            handler() {
                if (document.hidden) {
                    this.stop();
                } else {
                    this.start();
                }
            }

        }

    ],

    update: {

        write() {

            const timespan = getTimeSpan(this.date);

            if (timespan.total <= 0) {

                this.stop();

                timespan.days
                    = timespan.hours
                    = timespan.minutes
                    = timespan.seconds
                    = 0;
            }

            this.units.forEach(unit => {

                let digits = String(Math.floor(timespan[unit]));

                digits = digits.length < 2 ? `0${digits}` : digits;

                const el = this[unit];
                if (el.textContent !== digits) {
                    digits = digits.split('');

                    if (digits.length !== el.children.length) {
                        html(el, digits.map(() => '<span></span>').join(''));
                    }

                    digits.forEach((digit, i) => el.children[i].textContent = digit);
                }

            });

        }

    },

    methods: {

        start() {

            this.stop();

            if (this.date && this.units.length) {
                this.$emit();
                this.timer = setInterval(() => this.$emit(), 1000);
            }

        },

        stop() {

            if (this.timer) {
                clearInterval(this.timer);
                this.timer = null;
            }

        }

    }

};

function getTimeSpan(date) {

    const total = date - Date.now();

    return {
        total,
        seconds: total / 1000 % 60,
        minutes: total / 1000 / 60 % 60,
        hours: total / 1000 / 60 / 60 % 24,
        days: total / 1000 / 60 / 60 / 24
    };
}
