function plugin(UIkit) {

    if (plugin.installed) {
        return;
    }

    var {mixin, util} = UIkit;
    var {assign, clamp, css, Dimensions, each, getImage, includes, isNumber, isUndefined, scrolledOver, toFloat, query, win} = util;

    var props = ['x', 'y', 'bgx', 'bgy', 'rotate', 'scale', 'color', 'backgroundColor', 'borderColor', 'opacity', 'blur', 'hue', 'grayscale', 'invert', 'saturate', 'sepia', 'fopacity'];

    mixin.parallax = {

        props: props.reduce((props, prop) => {
            props[prop] = 'list';
            return props;
        }, {
            media: 'media'
        }),

        defaults: props.reduce((defaults, prop) => {
            defaults[prop] = undefined;
            return defaults;
        }, {
            media: false
        }),

        computed: {

            props(properties, $el) {

                return props.reduce((props, prop) => {

                    if (isUndefined(properties[prop])) {
                        return props;
                    }

                    var isColor = prop.match(/color/i),
                        isCssProp = isColor || prop === 'opacity',
                        steps = properties[prop].slice(0),
                        pos, diff;

                    if (isCssProp) {
                        css($el, prop, '');
                    }

                    if (steps.length < 2) {
                        steps.unshift((prop === 'scale'
                            ? 1
                            : isCssProp
                                ? css($el, prop)
                                : 0) || 0);
                    }

                    var unit = includes(steps.join(''), '%') ? '%' : 'px';

                    if (isColor) {

                        var color = $el.style.color;
                        steps = steps.map(step => parseColor($el, step));
                        $el.style.color = color;

                    } else {

                        steps = steps.map(toFloat);

                    }

                    if (prop.match(/^bg/)) {

                        if (this.covers) {

                            var min = Math.min(...steps),
                                max = Math.max(...steps);

                            steps = steps.map(step => step - min);
                            diff = max - min;
                            pos = `${-1 * Math.max(...steps)}px`;

                        } else {

                            css($el, `background-position-${prop[2]}`, '');
                            pos = css($el, 'backgroundPosition').split(' ')[prop[2] === 'x' ? 0 : 1]; // IE 11 can't read background-position-[x|y]

                        }
                    }

                    props[prop] = {steps, unit, pos, diff};

                    return props;

                }, {});

            },

            bgProps() {
                return ['bgx', 'bgy'].filter(bg => bg in this.props);
            },

            covers(_, $el) {
                return css($el.style.backgroundSize !== '' ? css($el, 'backgroundSize', '') : $el, 'backgroundSize') === 'cover';
            }

        },

        disconnected() {
            delete this._image;
        },

        update: [

            {

                read() {

                    delete this._computeds.props;

                    this._active = !this.media || win.matchMedia(this.media).matches;

                    if (this._image) {
                        this._image.dimEl = {
                            width: this.$el.offsetWidth,
                            height: this.$el.offsetHeight
                        }
                    }

                    if (!isUndefined(this._image) || !this.covers || !this.bgProps.length) {
                        return;
                    }

                    var src = css(this.$el, 'backgroundImage').replace(/^none|url\(["']?(.+?)["']?\)$/, '$1');

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
                        css(this.$el, {backgroundSize: '', backgroundRepeat: ''});
                        return;
                    }

                    var image = this._image,
                        dimEl = image.dimEl,
                        dim = Dimensions.cover(image, dimEl);

                    this.bgProps.forEach(prop => {

                        var {diff} = this.props[prop],
                            attr = prop === 'bgy' ? 'height' : 'width',
                            span = dim[attr] - dimEl[attr];

                        if (span < diff) {
                            dimEl[attr] = dim[attr] + diff - span;
                        }

                        dim = Dimensions.cover(image, dimEl);
                    });

                    css(this.$el, {
                        backgroundSize: `${dim.width}px ${dim.height}px`,
                        backgroundRepeat: 'no-repeat'
                    });

                },

                events: ['load', 'resize']

            }

        ],

        methods: {

            reset() {
                each(this.getCss(0), (_, prop) => css(this.$el, prop, ''));
            },

            getCss(percent) {

                var translated = false,
                    props = this.props;

                return Object.keys(props).reduce((css, prop) => {

                    var {steps, unit, pos} = props[prop],
                        value = getValue(steps, percent);

                    switch (prop) {

                        // transforms
                        case 'x':
                        case 'y':

                            if (translated) {
                                break;
                            }

                            var [x, y] = ['x', 'y'].map(dir => prop === dir
                                ? value + unit
                                : props[dir]
                                    ? getValue(props[dir].steps, percent) + props[dir].unit
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
                            css[`background-position-${prop[2]}`] = `calc(${pos} + ${value + unit})`;
                            break;

                        // color
                        case 'color':
                        case 'backgroundColor':
                        case 'borderColor':

                            var [start, end, p] = getStep(steps, percent);

                            css[prop] = `rgba(${
                                start.map((value, i) => {
                                    value = value + p * (end[i] - value);
                                    return i === 3 ? toFloat(value) : parseInt(value, 10);
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
            viewport: Number,
            easing: Number,
        },

        defaults: {
            target: false,
            viewport: 1,
            easing: 1,
        },

        computed: {

            target({target}, $el) {
                return target && query(target, $el) || $el;
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

                    this._percent = ease(scrolledOver(this.target) / (this.viewport || 1), this.easing);

                },

                write() {

                    if (!this._active) {
                        this.reset();
                        return;
                    }

                    if (this._prev !== this._percent) {
                        css(this.$el, this.getCss(this._percent));
                        this._prev = this._percent;
                    }

                },

                events: ['scroll', 'load', 'resize']
            }

        ]

    });

    function ease(percent, easing) {
        return clamp(percent * (1 - (easing - easing * percent)))
    }

    function parseColor(el, color) {
        return css(css(el, 'color', color), 'color').split(/[(),]/g).slice(1, -1).concat(1).slice(0, 4).map(n => toFloat(n));
    }

    function getStep(steps, percent) {
        var count = steps.length - 1,
            index = Math.min(Math.floor(count * percent), count - 1),
            step = steps.slice(index, index + 2);

        step.push(percent === 1 ? 1 : percent % (1 / count) * count);

        return step;
    }

    function getValue(steps, percent) {
        var [start, end, p] = getStep(steps, percent);
        return (isNumber(start)
            ? start + Math.abs(start - end) * p * (start < end ? 1 : -1)
            : +end
        ).toFixed(2);
    }

}

if (!BUNDLED && typeof window !== 'undefined' && window.UIkit) {
    window.UIkit.use(plugin);
}

export default plugin;
