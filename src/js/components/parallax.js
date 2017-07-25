function plugin(UIkit) {

    if (plugin.installed) {
        return;
    }

    var {mixin, util} = UIkit;
    var {assign, clamp, Dimensions, getImage, isUndefined, scrolledOver, query} = util;

    var props = ['x', 'y', 'bgx', 'bgy', 'rotate', 'scale', 'color', 'backgroundColor', 'borderColor', 'opacity', 'blur', 'hue', 'grayscale', 'invert', 'saturate', 'sepia', 'fopacity'];

    mixin.parallax = {

        props: props.reduce((props, prop) => {
            props[prop] = 'list';
            return props;
        }, {
            easing: Number,
            media: 'media'
        }),

        defaults: props.reduce((defaults, prop) => {
            defaults[prop] = undefined;
            return defaults;
        }, {
            easing: 1,
            media: false
        }),

        computed: {

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

                        var attr = `background-position-${prop[2]}`;
                        props[prop].pos = this.$el.css(attr, '').css('background-position').split(' ')[prop[2] === 'x' ? 0 : 1]; // IE 11 can't read background-position-[x|y]

                        if (this.covers) {
                            assign(props[prop], {start: 0, end: start <= end ? diff : -diff});
                        }
                    }

                    return props;

                }, {});

            },

            bgProps() {
                return ['bgx', 'bgy'].filter(bg => bg in this.props);
            },

            covers() {
                return this.$el.css('backgroundSize', '').css('backgroundSize') === 'cover';
            }

        },

        disconnected() {
            delete this._image;
        },

        update: [

            {

                read() {

                    delete this._computeds.props;

                    this._active = !this.media || window.matchMedia(this.media).matches;

                    if (this._image) {
                        this._image.dimEl = {
                            width: this.$el[0].offsetWidth,
                            height: this.$el[0].offsetHeight
                        }
                    }

                    if (!isUndefined(this._image) || !this.covers || !this.bgProps.length) {
                        return;
                    }

                    var src = this.$el.css('backgroundImage').replace(/^none|url\(["']?(.+?)["']?\)$/, '$1');

                    if (!src) {
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

                    if (!this._image) {
                        return;
                    }

                    if (!this._active) {
                        this.$el.css({backgroundSize: '', backgroundRepeat: ''});
                        return;
                    }

                    var image = this._image,
                        dimEl = image.dimEl,
                        dim = Dimensions.cover(image, dimEl);

                    this.bgProps.forEach(prop => {

                        var {start, end, pos, diff} = this.props[prop],
                            attr = prop === 'bgy' ? 'height' : 'width',
                            span = dim[attr] - dimEl[attr];

                        if (!pos.match(/%$/)) {
                            return;
                        }

                        if (start >= end) {

                            if (span < diff) {
                                dimEl[attr] = dim[attr] + diff - span;
                                this.props[prop].pos = '0px';
                            } else {
                                pos = -1 * span / 100 * parseFloat(pos);
                                pos = clamp(pos, diff - span, 0);
                                this.props[prop].pos = `${pos}px`;
                            }

                        } else {

                            if (span < diff) {
                                dimEl[attr] = dim[attr] + diff - span;
                            } else if ((span / 100 * parseFloat(pos)) > diff) {
                                return;
                            }

                            this.props[prop].pos = `-${diff}px`;

                        }

                        dim = Dimensions.cover(image, dimEl);
                    });

                    this.$el.css({
                        backgroundSize: `${dim.width}px ${dim.height}px`,
                        backgroundRepeat: 'no-repeat'
                    });

                },

                events: ['load', 'resize']

            }

        ],

        methods: {

            reset() {
                Object.keys(this.getCss(0)).forEach(prop => this.$el.css(prop, ''));
            },

            getCss(percent) {

                var translated = false, props = this.props;
                return Object.keys(props).reduce((css, prop) => {

                    var values = props[prop],
                        value = getValue(values, percent);

                    switch (prop) {

                        // transforms
                        case 'x':
                        case 'y':

                            if (translated) {
                                break;
                            }

                            var [x, y] = ['x', 'y'].map(dir => prop === dir
                                ? value + values.unit
                                : props[dir]
                                    ? getValue(props[dir], percent) + props[dir].unit
                                    : 0
                            );

                            translated = css.transform += ` translate3d(${x}, ${y}, 0)`;
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
                            css[`background-position-${prop[2]}`] = `calc(${values.pos} + ${value + values.unit})`;
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

    };

    UIkit.component('parallax', {

        mixins: [mixin.parallax],

        props: {
            target: String,
            viewport: Number
        },

        defaults: {
            target: false,
            viewport: 1
        },

        computed: {

            target() {
                return this.$props.target && query(this.$props.target, this.$el) || this.$el;
            }

        },

        disconnected() {
            delete this._prev;
        },

        update: [

            {

                read() {
                    delete this._prev;
                }

            },

            {

                read() {

                    var percent = scrolledOver(this.target) / (this.viewport || 1);
                    this._percent = clamp(percent * (1 - (this.easing - this.easing * percent)));

                },

                write() {

                    if (!this._active) {
                        this.reset();
                        return;
                    }

                    if (this._prev !== this._percent) {
                        this.$el.css(this.getCss(this._percent));
                        this._prev = this._percent;
                    }

                },

                events: ['scroll', 'load', 'resize']
            }

        ]

    });

    function parseColor(color) {
        return color.split(/[(),]/g).slice(1, -1).concat(1).slice(0, 4).map(n => parseFloat(n));
    }

    function getValue(prop, percent) {
        return +(!isUndefined(prop.diff)
            ? prop.start + prop.diff * percent * (prop.start < prop.end ? 1 : -1)
            : +prop.end).toFixed(2);
    }

}

if (!BUNDLED && typeof window !== 'undefined' && window.UIkit) {
    window.UIkit.use(plugin);
}

export default plugin;
