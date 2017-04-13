function plugin(UIkit) {

    if (plugin.installed) {
        return;
    }

    var { util, mixin } = UIkit;
    var {$, doc, toJQuery} = util;

    UIkit.component('countdown', {

        attrs: true,

        mixins: [mixin.class],

        props: {
            endtime: String
        },

        defaults: {
            endtime: ''
        },

        connected() {

            this.$el.html(`<span class="uk-countdown-days">00</span><span class="uk-countdown-colon">:</span><span class="uk-countdown-hours">00</span><span class="uk-countdown-colon">:</span><span class="uk-countdown-minutes">00</span><span class="uk-countdown-colon">:</span><span class="uk-countdown-seconds">00</span>`);

            this.days = this.$el.find('.uk-countdown-days');
            this.hours = this.$el.find('.uk-countdown-hours');
            this.minutes = this.$el.find('.uk-countdown-minutes');
            this.seconds = this.$el.find('.uk-countdown-seconds');

            this.update();
            this.start();
        },

        disconnected() {
            this.stop();
            this.$el.html('');
        },

        methods: {

            start() {

                this.stop();

                if (!this.endtime) {
                    return;
                }

                this.timer = setInterval(() => this.update(), 100);
            },

            stop() {

                if (this.timer) {
                    clearInterval(this.timer);
                }
            },

            update(){

                var t = this.getDifference();

                if (t.total <= 0){
                    t.total = t.days = t.hours = t.minutes = t.seconds = 0;
                }

                ['days','hours','minutes','seconds'].forEach(item => {

                    if (Number(this[item].text()) !== Number(t[item])) {
                        this[item].text(('00'+t[item]).slice(-2));
                    }
                });

                if (t.total <= 0){
                    this.stop();
                }
            },

            getDifference() {

                  var total = Date.parse(this.endtime) - Date.parse(new Date());
                  var seconds = Math.floor((total/1000) % 60);
                  var minutes = Math.floor((total/1000/60) % 60);
                  var hours = Math.floor((total/(1000*60*60)) % 24);
                  var days = Math.floor(total/(1000*60*60*24));

                  return {total, days, hours,  minutes, seconds};
            }
        }

    });

}

if (!BUNDLED && typeof window !== 'undefined' && window.UIkit) {
    window.UIkit.use(plugin);
}

export default plugin;
