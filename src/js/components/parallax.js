function plugin(UIkit) {

    if (plugin.installed) {
        return;
    }

    var {$, clamp, Dimensions, getImage, isUndefined, scrolledOver, query} = UIkit.util;

    var props = ['x', 'y', 'bgx', 'bgy', 'rotate', 'scale', 'color', 'backgroundColor', 'borderColor', 'opacity', 'blur', 'hue', 'grayscale', 'invert', 'saturate', 'sepia', 'fopacity'];

    UIkit.component('parallax', {

        props: props.reduce((props, prop) => {
            props[prop] = 'list';
            return props;
        }, {
            easing: Number,
            target: String,
            viewport: Number,
            media: 'media'
        }),

        defaults: props.reduce((defaults, prop) => {
            defaults[prop] = undefined;
            return defaults;
        }, {
            easing: 1,
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

                    if (isUndefined(this.$props[prop])) {
                        return props;
                    }

                    var isColor = prop.match(/color/i),
                        isCssProp = isColor || prop === 'opacity',
                        values = this.$props[prop];

                    if (isCssProp) {
                        this.$el.css(prop, '');
                    }

                    var start = (!isUndefined(values[1])
                                ? values[0]
                                : prop === 'scale'
                                    ? 1
                                    : isCssProp
                                        ? this.$el.css(prop)
                                        : 0) || 0,
                        end = isUndefined(values[1]) ? values[0] : values[1],
                        unit = ~values.join('').indexOf('%') ? '%' : 'px',
                        diff;

                    if (isColor) {

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

                    props[prop] = {start, end, diff, unit};

                    if (prop.match(/^bg/)) {
                        if (this.covers) {
                            props[prop].end = start <= end ? diff : -diff;
                            props[prop].start = 0;
                        } else {
                            props[prop].pos = this.$el.css(`background-position-${prop[2]}`);
                        }
                    }

                    return props;

                }, {});

            },

            bgProps() {
                return ['bgx', 'bgy'].filter(bg => bg in this.props);
            },

            covers() {
                var size = this.$el.css('backgroundSize');
                return ~['contain', 'cover'].indexOf(size) ? size : false;
            }

        },

        disconnected() {
            this._image = undefined;
        },

        update: [

            {

                read() {

                    if (this._image) {
                        this._image.dimEl = {
                            width: this.$el[0].offsetWidth,
                            height: this.$el[0].offsetHeight
                        }
                    }

                    if (!isUndefined(this._image) || !this.bgProps.length) {
                        return;
                    }

                    var src = this.$el.css('backgroundImage').replace(/^none|url\(["']?(.+?)["']?\)$/, '$1');

                    if (!src || !this.covers) {
                        return;
                    }

                    this._image = false;

                    getImage(src).then(img => {
                        this._image = {
                            width: img.naturalWidth,
                            height: img.naturalHeight
                        };

                        this.$emit();
                    });

                },

                write() {

                    if (this._image) {

                        if (!this.media || window.matchMedia(this.media).matches) {

                            var image = this._image, {dimEl} = image;

                            this.bgProps.forEach(prop => dimEl[prop === 'bgy' ? 'height' : 'width'] += this.props[prop].diff);

                            var dim = this.covers === 'cover'
                                ? Dimensions.cover(image, dimEl)
                                : Dimensions.fit(image, dimEl);

                            this.$el.css({
                                backgroundSize: `${dim.width}px ${dim.height}px`,
                                backgroundRepeat: 'no-repeat'
                            });

                        } else {
                            this.$el.css({backgroundSize: '', backgroundRepeat: ''});
                        }

                    }

                },

                events: ['load', 'resize']

            },

            {

                write() {

                    if (this.media && !window.matchMedia(this.media).matches) {
                        this._prev = undefined;
                        Object.keys(getCss(this.props, 0)).forEach(prop => this.$el.css(prop, ''));
                        return;
                    }

                    var percent = scrolledOver(this.target) / (this.viewport || 1);

                    percent = clamp(percent * (1 - (this.easing - this.easing * percent)));

                    if (this._prev === percent) {
                        return;
                    }

                    this.$el.css(getCss(this.props, percent, this.covers));
                    this._prev = percent;

                },

                events: ['scroll', 'load', 'resize']
            }
        ]
    });

    function parseColor(color) {
        return color.split(/[(),]/g).slice(1, -1).concat(1).slice(0, 4).map(n => parseFloat(n));
    }

    function getCss(props, percent, covers) {

        return Object.keys(props).reduce((css, prop) => {

            var values = props[prop],
                value = !isUndefined(values.diff)
                    ? values.start + values.diff * percent * (values.start < values.end ? 1 : -1)
                    : values.end;

            switch (prop) {

                // transforms
                case 'x':
                case 'y':
                    css.transform += ` translate${prop}(${value + values.unit})`;
                    break;
                case 'rotate':
                    css.transform += ` rotate(${value}deg)`;
                    break;
                case 'scale':
                    css.transform += ` scale(${value})`;
                    break;

                // bg image
                case 'bgy':
                case 'bgx':
                    css[`background-position-${prop[2]}`] = `calc(${
                        !covers
                            ? values.pos
                            : values.start < values.end 
                                ? '100%' 
                                : '0%'
                    } + ${value + values.unit})`;
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

}

if (!BUNDLED && typeof window !== 'undefined' && window.UIkit) {
    window.UIkit.use(plugin);
}

export default plugin;
