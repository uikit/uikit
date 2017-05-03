function plugin(UIkit) {

    if (plugin.installed) {
        return;
    }

    var {$, has3D, Dimensions, on, promise, scrolledOver, query} = UIkit.util;

    var props = ['x', 'xp', 'y', 'yp', 'bg', 'bgp', 'rotate', 'scale', 'color', 'backgroundColor', 'borderColor', 'opacity', 'blur', 'hue', 'grayscale', 'invert', 'saturate', 'sepia', 'fopacity'];

    UIkit.component('parallax', {

        props: props.reduce((props, prop) => {
            props[prop] = 'list';
            return props;
        }, {
            velocity: Number,
            target: String,
            viewport: Number,
            media: 'media'
        }),

        defaults: props.reduce((defaults, prop) => {
            defaults[prop] = undefined;
            return defaults;
        }, {
            velocity: 1,
            target: false,
            viewport: 1,
            media: false
        }),

        computed: {

            target() {
                return this.$props.target && query(this.$props.target, this.$el) || this.$el;
            },

            props() {

                return props.reduce((props, prop) => {

                    if (!(prop in this.$props)) {
                        return props;
                    }

                    var values = this.$props[prop],
                        start = (values[1] !== undefined
                            ? values[0]
                            : prop === 'scale'
                                ? 1
                                : this.$el.css(prop)) || 0,
                        end = values[1] !== undefined ? values[1] : values[0],
                        diff;

                    if (prop.match(/color/i)) {

                        var color = this.$el[0].style.color;
                        this.$el[0].style.color = start;
                        start = parseColor(this.$el.css('color'));
                        this.$el[0].style.color = end;
                        end = parseColor(this.$el.css('color'));
                        this.$el[0].style.color = color;

                    } else {
                        start = parseFloat(start);
                        end = parseFloat(end);
                        diff = Math.abs(start - end);
                    }

                    props[prop] = {start, end, diff};
                    return props;

                }, {});

            },

            bgProp() {
                return ['bg', 'bgp'].filter(bg => bg in this.props)[0];
            }

        },

        update: [

            {

                read() {

                    if (!this._bgImage && this.bgProp) {
                        this._bgImage = promise(resolve => {

                            var url = this.$el.css('background-image').replace(/^url\(["']?/, '').replace(/["']?\)$/, ''),
                                isCover = this.$el.css('background-size') === 'cover',
                                img = new Image();

                            on(img, 'load', () => resolve({width: img.naturalWidth, height: img.naturalHeight, cover: isCover}));
                            img.src = url;
                        });

                        this.$el.css({backgroundSize: 'cover', backgroundRepeat: 'no-repeat'});
                    }

                    if (this._bgImage) {

                        this._bgImage.then(image => {

                            var ratio = image.width / image.height,
                                width = this.$el.innerWidth(),
                                height = this.$el.innerHeight(),
                                diff = this.props[this.bgProp].diff,
                                extra = this.bgProp === 'bg' ? diff : height * diff / 100,
                                size;

                            height += extra;
                            width += Math.ceil(extra * ratio);

                            if (width - extra < image.width && height < image.height) {
                                size = image.cover ? 'cover' : 'auto';
                            } else {
                                var dim = Dimensions.cover(image, {width, height});
                                size = `${dim.width}px ${dim.height}px`;
                            }

                            this.$el.css('background-size', size);

                        });

                    }

                },

                events: ['load', 'resize', 'orientationchange']

            },

            {

                write() {

                    if (this.media && window.matchMedia(this.media).matches) {
                        return;
                    }

                    var percent = scrolledOver(this.target);

                    if (this.viewport !== false) {
                        percent = this.viewport === 0 ? 1 : percent / this.viewport;
                    }

                    percent = percent * (1 - (this.velocity - this.velocity * percent));
                    percent = percent < 0 ? 0 : percent > 1 ? 1 : percent;

                    if (this._prev === percent) {
                        return;
                    }

                    this.$el.css(getCss(this.props, percent));
                    this._prev = percent;

                },

                events: ['scroll', 'load', 'resize', 'orientationchange']
            }
        ]
    });

    function parseColor(color) {
        return color.split(/\(|\)|,/g).slice(1, -1).concat(1).slice(0, 4).map(n => parseFloat(n));
    }

    function getCss(props, percent) {

        return Object.keys(props).reduce((css, prop) => {

            var values = props[prop],
                value = percent === 0
                ? values.start
                : percent === 1
                    ? values.end
                    : values.diff !== undefined
                        ? values.start + values.diff * percent * (values.start < values.end ? 1 : -1)
                        : values.end;

            switch (prop) {

                // transforms
                case 'x':
                case 'xp':
                case 'y':
                case 'yp':
                    var dir = prop.charAt(0).toUpperCase();
                    css.transform += ` translate${has3D
                        ? `3d(${dir === 'Y' ? '0,' : ''}${value}${getUnit(prop)}, ${dir === 'X' ? '0,' : ''} 0)`
                        : `${dir}(${value}${getUnit(prop)})`
                    }`;
                    break;
                case 'rotate':
                    css.transform += ` rotate(${value}deg)`;
                    break;
                case 'scale':
                    css.transform += ` scale(${value})`;
                    break;

                // bg image
                case 'bg':
                case 'bgp':
                    css.backgroundPosition = `50% ${value}${getUnit(prop)}`;
                    break;

                // color
                case 'color':
                case 'backgroundColor':
                case 'borderColor':
                    css[prop] = `rgba(${
                        values.start.map((value, i) => {
                            value = value + percent * (values.end[i] - value);
                            return i === 3 ? parseFloat(value) : parseInt(value, 10);
                        }).join(',')
                    })`;
                    break;

                // CSS Filter
                case 'blur':
                    css.filter += ` blur(${value}px)`;
                    break;
                case 'hue':
                    css.filter += ` hue-rotate(${value}deg)`;
                    break;
                case 'fopacity':
                    css.filter += ` opacity(${value}%)`;
                    break;
                case 'grayscale':
                case 'invert':
                case 'saturate':
                case 'sepia':
                    css.filter += ` ${prop}(${value}%)`;
                    break;

                default:
                    css[prop] = value;
            }

            return css;

        }, {transform: '', filter: ''});

    }

    function getUnit(prop) {
        return prop.slice(-1) === 'p' ? '%' : 'px';
    }

}

if (!BUNDLED && typeof window !== 'undefined' && window.UIkit) {
    window.UIkit.use(plugin);
}

export default plugin;
