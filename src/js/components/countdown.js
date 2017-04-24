function plugin(UIkit) {

    if (plugin.installed) {
        return;
    }

    var {util, mixin} = UIkit;
    var {$} = util;

    UIkit.component('countdown', {

        mixins: [mixin.class],

        args: 'date',

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
        },

        methods: {

            start() {

                this.stop();

                if (this.date && this.units.length) {
                    this.update();
                    this.timer = setInterval(this.update, 1000);
                }

            },

            stop() {

                if (this.timer) {
                    clearInterval(this.timer);
                    this.timer = null;
                }

            },

            update(){

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
                        this[unit].html(digits.split('').map(digit => `<span>${digit}</span>`).join(''));
                    }

                });

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
