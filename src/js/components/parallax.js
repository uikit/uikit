function plugin(UIkit) {

    if (plugin.installed) {
        return;
    }

    var { util } = UIkit;
    var { $, hyphenate, percentageInViewport } = util;

    var supports3d = 'transformOrigin' in document.documentElement.style;

    var props = {
        velocity: Number,
        target: String,
        viewport: Number,
        media: String
    };

    var defaults = {
        velocity: 1,
        target: false,
        viewport: 1,
        media: false
    };

    ['x','xp','y','yp','bg','bgp','rotate','scale','color','backgroundColor','borderColor','opacity','blur','hue','grayscale','invert','saturate','sepia','fopacity'].forEach(prop => {
        props[prop] = String;
        defaults[prop] = undefined;
    });

    UIkit.component('parallax', {

        props,
        defaults,
        attrs: true,

        connected() {

            this.base = this.target ? $(this.target) : this.$el;
            this.$$props = {};

            var reserved  = ['target','velocity','viewport','plugins','media'];
            var start, end, dir, diff, startend;

            var getStartValue = (prop) => {

                var value = 0;

                switch (prop) {
                    case 'scale':
                        value = 1;
                        break;
                    default:
                        value = this.$el.css(prop);
                }

                return (value || 0);
            };

            Object.keys(this.$props).forEach(prop => {

                if (reserved.indexOf(prop) !== -1) {
                    return;
                }

                startend = String(this.$props[prop]).split(',');
                prop = hyphenate(prop);

                if (prop.match(/color/i)) {

                    start = startend[1] ? startend[0] : getStartValue(prop),
                    end   = startend[1] ? startend[1] : startend[0];

                    if (!start) {
                        start = 'rgba(255,255,255,0)';
                    }

                } else {
                    start = parseFloat(startend[1] ? startend[0] : getStartValue(prop)),
                    end   = parseFloat(startend[1] ? startend[1] : startend[0]);
                    diff  = (start < end ? (end-start):(start-end));
                    dir   = (start < end ? 1:-1);
                }

                this.$$props[prop] = { start, end, dir, diff };
            });
        },

        methods: {

            process(percent) {

                var css = {transform:'', filter:''};
                var compercent = percent * (1 - (this.velocity - (this.velocity * percent)));

                var opts, val;

                if (compercent < 0) compercent = 0;
                if (compercent > 1) compercent = 1;

                if (this._percent !== undefined && this._percent == compercent) {
                    return;
                }

                Object.keys(this.$$props).forEach(prop => {

                    opts = this.$$props[prop];

                    if (percent === 0) {
                        val = opts.start;
                    } else if(percent === 1) {
                        val = opts.end;
                    } else if (opts.diff !== undefined) {
                        val = opts.start + (opts.diff * compercent * opts.dir);
                    }

                    if ((prop == 'bg' || prop == 'bgp') && !this._bgcover) {
                        this._bgcover = initBgImageParallax(this, prop, opts);
                    }

                    switch(prop) {

                        // transforms
                        case 'x':
                            css.transform += supports3d ? ` translate3d(${val}px, 0, 0)` : ` translateX(${val}px)`;
                            break;
                        case 'xp':
                            css.transform += supports3d ? ` translate3d(${val}%, 0, 0)` : ` translateX(${val}%)`;
                            break;
                        case 'y':
                            css.transform += supports3d ? ` translate3d(0, ${val}px, 0)` : ` translateY(${val}px)`;
                            break;
                        case 'yp':
                            css.transform += supports3d ? ` translate3d(0, ${val}%, 0)` : ` translateY(${val}%)`;
                            break;
                        case 'rotate':
                            css.transform += ` rotate(${val}deg)`;
                            break;
                        case 'scale':
                            css.transform += ` scale(${val})`;
                            break;

                        // bg image
                        case 'bg':
                            css['background-position'] = `50% ${val}px`;
                            break;
                        case 'bgp':
                            css['background-position'] = `50% ${val}%`;
                            break;

                        // color
                        case 'color':
                        case 'background-color':
                        case 'border-color':
                            css[prop] = calculateColor(parseColor(opts.start), parseColor(opts.end), compercent || 0);
                            break;

                        // CSS Filter
                        case 'blur':
                            css.filter += ` blur(${val}px)`;
                            break;
                        case 'hue':
                            css.filter += ` hue-rotate(${val}deg)`;
                            break;
                        case 'grayscale':
                            css.filter += ` grayscale(${val}%)`;
                            break;
                        case 'invert':
                            css.filter += ` invert(${val}%)`;
                            break;
                        case 'fopacity':
                            css.filter += ` opacity(${val}%)`;
                            break;
                        case 'saturate':
                            css.filter += ` saturate(${val}%)`;
                            break;
                        case 'sepia':
                            css.filter += ` sepia(${val}%)`;
                            break;

                        default:
                            css[prop] = val;
                            break;
                    }

                });

                if (css.filter) {
                    css['-webkit-filter'] = css.filter;
                }

                this.$el.css(css);
                this._percent = compercent;
            }
        },

        update: [

            {

                write() {

                    if (this.media) {

                        if (Number(this.media) && window.innerWidth < this.media) {
                            return;
                        } else if (typeof(this.media) == 'string' && window.matchMedia(this.media).matches) {
                            return;
                        }
                    }

                    var percent = percentageInViewport(this.base);

                    if (this.viewport !== false) {
                        percent = (this.viewport === 0) ? 1 : percent / this.viewport;
                    }

                    this.process(percent);
                },

                events: ['scroll', 'load', 'resize', 'orientationchange']
            }
        ]
    });

}

function initBgImageParallax(instance, prop, opts) {

    var img = new Image();
    var element = instance.$el.css({backgroundSize: 'cover',  backgroundRepeat: 'no-repeat'});
    var url = element.css('background-image').replace(/^url\(/g, '').replace(/\)$/g, '').replace(/("|')/g, '');

    img.onload = () => {

        var size  = { w:img.width, h:img.height };
        var ratio = img.width / img.height;
        var extra = (prop=='bg') ? opts.diff : (opts.diff/100) * h;
        var w = element.innerWidth() + extra;
        var h = element.innerHeight() + Math.ceil(extra * ratio);
        var width, height

        if (w-extra < size.w && h < size.h) {
            return element.css({backgroundSize: 'auto'});
        }

        // if element height < parent height (gap underneath)
        if ((w / ratio) < h) {

            width = Math.ceil(h * ratio);
            height = h;

            if (h > window.innerHeight) {
                width *= 1.2;
                height *= 1.2;
            }

        // element width < parent width (gap to right)
        } else {
            width  = w;
            height = Math.ceil(w / ratio);
        }

        element.css({backgroundSize: (`${width}px ${height}px`)}).data('bgsize', {w:width,h:height});
    };

    img.src = url;

    return img;
}

// Calculate an in-between color. Returns "#aabbcc"-like string.
function calculateColor(begin, end, pos) {
    var color = `rgba(${parseInt((begin[0] + pos * (end[0] - begin[0])), 10)},${parseInt((begin[1] + pos * (end[1] - begin[1])), 10)},${parseInt((begin[2] + pos * (end[2] - begin[2])), 10)},${begin && end ? parseFloat(begin[3] + pos * (end[3] - begin[3])) : 1}`;
    return `${color})`;
}

// Parse an CSS-syntax color. Outputs an array [r, g, b]
function parseColor(color) {

    var match, quadruplet;

    // Match #aabbcc
    if (match = /#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})/.exec(color)) {
        quadruplet = [parseInt(match[1], 16), parseInt(match[2], 16), parseInt(match[3], 16), 1];
    // Match #abc
    } else if (match = /#([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])/.exec(color)) {
        quadruplet = [parseInt(match[1], 16) * 17, parseInt(match[2], 16) * 17, parseInt(match[3], 16) * 17, 1];
    // Match rgb(n, n, n)
    } else if (match = /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(color)) {
        quadruplet = [parseInt(match[1]), parseInt(match[2]), parseInt(match[3]), 1];
    } else if (match = /rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9\.]*)\s*\)/.exec(color)) {
        quadruplet = [parseInt(match[1], 10), parseInt(match[2], 10), parseInt(match[3], 10),parseFloat(match[4])];
    // No browser returns rgb(n%, n%, n%), so little reason to support this format.
    } else {
        quadruplet = {
            black: [0,0,0,1],
            blue: [0,0,255,1],
            brown: [165,42,42,1],
            cyan: [0,255,255,1],
            fuchsia: [255,0,255,1],
            gold: [255,215,0,1],
            green: [0,128,0,1],
            indigo: [75,0,130,1],
            khaki: [240,230,140,1],
            lime: [0,255,0,1],
            magenta: [255,0,255,1],
            maroon: [128,0,0,1],
            navy: [0,0,128,1],
            olive: [128,128,0,1],
            orange: [255,165,0,1],
            pink: [255,192,203,1],
            purple: [128,0,128,1],
            violet: [128,0,128,1],
            red: [255,0,0,1],
            silver: [192,192,192,1],
            white: [255,255,255,1],
            yellow: [255,255,0,1],
            transparent: [255,255,255,0]
        }[color] || [255,255,255,0];
    }

    return quadruplet;
}

if (!BUNDLED && typeof window !== 'undefined' && window.UIkit) {
    window.UIkit.use(plugin);
}

export default plugin;
