function plugin(UIkit) {

    if (plugin.installed) {
        return;
    }

    var { util } = UIkit;
    var { $ } = util;

    var supports3d = 'transformOrigin' in document.documentElement.style;

    UIkit.component('grid-parallax', {

        props: {
            target: String,
            translate: Number,
            smooth: Number
        },

        defaults: {
            target    : false,
            translate : 150,
            smooth    : 150
        },

        connected() {
            this.initItems();
        },

        methods: {

            initItems: function() {

                var smooth = this.smooth;

                this.items = (this.target ? this.$el.find(this.target) : this.$el.children()).each(function(){
                    $(this).css({
                        transition: `transform ${smooth}ms linear`,
                        transform: ''
                    });
                });

                return this;
            }
        },

        update: [

            {

                write() {

                    var columns  = getColumnsCount(this.$el);
                    var margin = '';

                    if (columns > 1) {
                         margin = this.translate + parseInt(this.$el.css('margin-bottom'));
                    }

                    this.$el.css('margin-bottom', margin);
                },

                events: ['load', 'resize', 'orientationchange']
            },

            {

                write() {

                    var percent = percentageInViewport(this.$el);
                    var columns = getColumnsCount(this.$el);
                    var mods = [(columns-1)];


                    if (columns == 1 || !percent) {
                        this.items.css('transform', '');
                        return;
                    }

                    while (mods.length < columns) {

                       if (!(mods[mods.length-1] - 2)) {
                           break;
                       }

                       mods.push(mods[mods.length-1] - 2);
                    }

                    var percentTranslate = percent * this.translate, translate;

                    this.items.each(function(index) {
                        translate = mods.indexOf((index+1) % columns) != -1 ? percentTranslate : percentTranslate / 8;
                        $(this).css('transform', supports3d ? `translate3d(0, ${translate}px, 0)` : `translateY(${translate}px)`);
                    });
                },

                events: ['scroll']
            }
        ]

    });

}

function getColumnsCount(element) {

    var children = element.children();
    var first = children.filter(':visible:first');
    var top = first[0].offsetTop + first.outerHeight();

    for (var column=0;column<children.length;column++) {

        if (children[column].offsetTop >= top)  {
            break;
        }
    }

    return column || 1;
}

function percentageInViewport(element) {

    var top = element.offset().top;
    var height = element.outerHeight();
    var scrolltop = $(window).scrollTop();
    var wh = window.innerHeight;

    var distance, percentage, percent;

    if (top > (scrolltop + wh)) {
        percent = 0;
    } else if ((top + height) < scrolltop) {
        percent = 1;
    } else {

        if ((top + height) < wh) {
            percent = (scrolltop < wh ? scrolltop : scrolltop - wh) / (top+height);
        } else {

            distance   = (scrolltop + wh) - top;
            percentage = Math.round(distance / ((wh + height) / 100));
            percent    = percentage/100;
        }

        if (top < wh) {
            percent = percent * scrolltop / ((top + height) - wh);
        }
    }

    return percent > 1 ? 1:percent;
}


if (!BUNDLED && typeof window !== 'undefined' && window.UIkit) {
    window.UIkit.use(plugin);
}

export default plugin;
