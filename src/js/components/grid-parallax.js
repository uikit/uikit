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

        computed: {

            items() {
                return (this.target ? this.$el.find(this.target) : this.$el.children()).toArray();
            },

            columns() {
                return this.rows && this.rows[0] && this.rows[0].length || 0;
            }

        },

        update: [

            {

                read() {
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

                write() {

                    var translate = scrolledOver(this.$el) * this.translate;

                    if (!this.rows || this.columns === 1 || !translate) {
                        this.items.forEach(item => item.style.transform = '');
                        return;
                    }

                    this.rows.forEach(row =>
                        row.forEach((el, i) =>
                            el.style.transform = `translateY(${i % 2 ? translate : translate / 8}px)`
                        )
                    );

                },

                events: ['scroll']
            }
        ]

    }));

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
