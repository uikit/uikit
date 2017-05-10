function plugin(UIkit) {

    if (plugin.installed) {
        return;
    }

    var {$, has3D, Dimensions, on, promise, scrolledOver, query} = UIkit.util;

    var props = ['x', 'y', 'bg', 'bgx', 'bgy', 'rotate', 'scale', 'color', 'backgroundColor', 'borderColor', 'opacity', 'blur', 'hue', 'grayscale', 'invert', 'saturate', 'sepia', 'fopacity'];

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
                        $start = values[1] !== undefined ? values[0] : getStyleValue(this.$el, prop),
                        start = $start,
                        end = values[1] !== undefined ? values[1] : values[0],
                        unit = values.join('').indexOf('%') !== -1 ? '%' : 'px',
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

                    props[prop] = {start, end, diff, unit, $start};
                    return props;

                }, {});

            },

            bgProp() {
                return ['bg', 'bgx', 'bgy'].filter(bg => bg in this.props)[0];
            }

        },

        update: [

            {

                read() {

                    if (!this._bgImage && this.bgProp) {
                        this._bgImage = promise(resolve => {

                            var url = this.$el.css('backgroundImage').replace(/^url\(["']?/, '').replace(/["']?\)$/, ''),
                                isCover = this.$el.css('backgroundSize') === 'cover',
                                img = new Image();

                            on(img, 'load', () => resolve({width: img.naturalWidth, height: img.naturalHeight, cover: isCover}));
                            img.src = url;
                        });

                        this.$el.css({backgroundRepeat: 'no-repeat'});
                    }

                    if (this._bgImage) {

                        this._bgImage.then(image => {

                            if (!image.cover) {
                                return;
                            }

                            var ratio = image.width / image.height,
                                width = this.$el.outerWidth(),
                                height = this.$el.outerHeight(),
                                diff = this.props[this.bgProp].diff,
                                extra = this.props[this.bgProp].unit == '%' ? height * diff / 100 : diff,
                                size, dim;

                            height += (extra * (width/height < ratio ? 2 : 1));
                            width += Math.ceil(extra * ratio);

                            dim = Dimensions.cover(image, {width, height});
                            size = `${dim.width}px ${dim.height}px`;

                            this.$el.css({backgroundSize: size});
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
                case 'y':
                    var dir = prop.charAt(0).toUpperCase();
                    css.transform += ` translate${has3D
                        ? `3d(${dir === 'Y' ? '0,' : ''}${value}${values.unit}, ${dir === 'X' ? '0,' : ''} 0)`
                        : `${dir}(${value}${values.unit})`
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
                case 'bgy':
                case 'bgx':
                    var calc = [values.$start, value < 0 ? '-':'+', Math.abs(value)+values.unit].join(' ');
                    css[`backgroundPosition${prop =='bgx' ? 'X' : 'Y'}`] = `calc(${calc})`;
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

    function getStyleValue(element, prop) {

        var value = 0;

        switch(prop) {
            case 'scale':
                value = 1;
                break;
            case 'bg':
            case 'bgy':
                value = element.css('background-position-y') || '0px';
                break;
            case 'bgx':
                value = element.css('background-position-x') || '0px';
                break;
            default:
                value = element.css(prop);
        }

        value = value || 0;

        if (['bg','bgy','bgx'].indexOf(prop) > -1) {

            if (value === 0) {
                value = '0px';
            } else if (value == 'center') {
                value = '50%';
            } else if (value == 'top' || value == 'left') {
                value = '0px';
            }
        }

        return value;
    }

}

if (!BUNDLED && typeof window !== 'undefined' && window.UIkit) {
    window.UIkit.use(plugin);
}

export default plugin;
