function plugin(UIkit) {

    if (plugin.installed) {
        return;
    }

    var {scrolledOver} = UIkit.util;

    UIkit.component('grid-parallax', UIkit.components.grid.extend({

        props: {
            target: String,
            translate: Number
        },

        defaults: {
            target: false,
            translate: 150
        },

        init() {
            this.$addClass('uk-grid');
        },

        disconnected() {
            this.reset();
            this.$el.css('margin-bottom', '');
        },

        computed: {

            translate() {
                return Math.abs(this.$props.translate);
            },

            items() {
                return (this.target ? this.$el.find(this.target) : this.$el.children()).toArray();
            }

        },

        update: [

            {

                read() {
                    this.columns = this.rows && this.rows[0] && this.rows[0].length || 0;
                    this.rows = this.rows && this.rows.map(elements => sortBy(elements, 'offsetLeft'));
                },

                write() {
                    this.$el
                        .css('margin-bottom', '')
                        .css('margin-bottom', this.columns > 1 ? this.translate + parseFloat(this.$el.css('margin-bottom')) : '');
                },

                events: ['load', 'resize']
            },

            {

                read() {

                    this.scrolled = scrolledOver(this.$el) * this.translate;

                },

                write() {

                    if (!this.rows || this.columns === 1 || !this.scrolled) {
                        return this.reset();
                    }

                    this.rows.forEach(row =>
                        row.forEach((el, i) =>
                            el.style.transform = `translateY(${i % 2 ? this.scrolled : this.scrolled / 8}px)`
                        )
                    );

                },

                events: ['scroll', 'load', 'resize']
            }
        ],

        methods: {

            reset() {
                this.items.forEach(item => item.style.transform = '');
            }

        }

    }));

    UIkit.component('grid-parallax').options.update.unshift({

        read() {
            this.reset();
        },

        events: ['load', 'resize']

    });

    function sortBy(collection, prop) {
        return collection.sort((a,b) =>
            a[prop] > b[prop]
                ? 1
                : b[prop] > a[prop]
                    ? -1
                    : 0
        )
    }

}



if (!BUNDLED && typeof window !== 'undefined' && window.UIkit) {
    window.UIkit.use(plugin);
}

export default plugin;
