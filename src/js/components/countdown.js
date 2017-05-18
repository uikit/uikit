function plugin(UIkit) {

    if (plugin.installed) {
        return;
    }

    UIkit.component('countdown', {

        mixins: [UIkit.mixin.class],

        attrs: true,

        props: {
            date: String,
            clsWrapper: String
        },

        defaults: {
            date: '',
            clsWrapper: '.uk-countdown-%unit%'
        },

        computed: {

            date() {
                return Date.parse(this.$props.date);
            },

            days() {
                return this.$el.find(this.clsWrapper.replace('%unit%', 'days'));
            },

            hours() {
                return this.$el.find(this.clsWrapper.replace('%unit%', 'hours'));
            },

            minutes() {
                return this.$el.find(this.clsWrapper.replace('%unit%', 'minutes'));
            },

            seconds() {
                return this.$el.find(this.clsWrapper.replace('%unit%', 'seconds'));
            },

            units() {
                return ['days', 'hours', 'minutes', 'seconds'].filter(unit => this[unit].length);
            }

        },

        connected() {
            this.start();
        },

        disconnected() {
            this.stop();
            this.units.forEach(unit => this[unit].empty());
        },

        update: {

            write() {

                var timespan = getTimeSpan(this.date);

                if (timespan.total <= 0) {

                    this.stop();

                    timespan.days
                        = timespan.hours
                        = timespan.minutes
                        = timespan.seconds
                        = 0;
                }

                this.units.forEach(unit => {

                    var digits = String(Math.floor(timespan[unit]));

                    digits = digits.length < 2 ? `0${digits}` : digits;

                    if (this[unit].text() !== digits) {
                        var el = this[unit];
                        digits = digits.split('');

                        if (digits.length !== el.children().length) {
                            el.empty().append(digits.map(() => '<span></span>').join(''));
                        }

                        digits.forEach((digit, i) => el[0].childNodes[i].innerText = digit);
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

    });

    function getTimeSpan(date) {

        var total = date - Date.now();

        return {
            total,
            seconds: total / 1000 % 60,
            minutes: total / 1000 / 60 % 60,
            hours: total / 1000 / 60 / 60 % 24,
            days: total / 1000 / 60 / 60 / 24
        };
    }

}

if (!BUNDLED && typeof window !== 'undefined' && window.UIkit) {
    window.UIkit.use(plugin);
}

export default plugin;
