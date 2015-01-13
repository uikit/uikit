/*!
  * A CSS LTR 2 RTL converter, part of UIkit and WARP framework.
  * http://getuikit.com/
  * http://www.yootheme.com/warp
  *
  * Based on R2 - a CSS LTR 2 RTL converter (https://github.com/ded/r2, Dustin Diaz, MIT License)
  */

(function() {

    if(!String.prototype.trim) {
        String.prototype.trim = function () {
            return this.replace(/^\s+|\s+$/g,'');
        };
    }

    if(!String.prototype.trimComma) {
        String.prototype.trimComma = function() {
            return this.replace(/^,+|,+$/g, '');
        };
    }

    if(!String.prototype.trimSemicolon) {
        String.prototype.trimSemicolon = function() {
            return this.replace(/^;+|;+$/g, '');
        };
    }

    var propertyMap = {
        'margin-left': 'margin-right',
        'margin-right': 'margin-left',

        'padding-left': 'padding-right',
        'padding-right': 'padding-left',

        'border-left': 'border-right',
        'border-right': 'border-left',

        'border-left-color': 'border-right-color',
        'border-right-color': 'border-left-color',
        'border-left-width': 'border-right-width',
        'border-right-width': 'border-left-width',
        'border-left-style': 'border-right-style',
        'border-right-style': 'border-left-style',

        'border-bottom-right-radius': 'border-bottom-left-radius',
        'border-bottom-left-radius': 'border-bottom-right-radius',

        'border-top-right-radius': 'border-top-left-radius',
        'border-top-left-radius': 'border-top-right-radius',

        'left': 'right',
        'right': 'left'
    };

    var valueMap = {
        'padding': quad,
        'margin': quad,
        'text-align': rtltr,
        'float': rtltr,
        'clear': rtltr,
        'direction': direction,
        'border-radius': quad_radius,
        'border-color': quad,
        'border-width': quad,
        'border-style': quad,
        'background-position': bgPosition,
        'box-shadow': boxShadow,
        'background': background,
        'background-image': backgroundImage,
        '-webkit-transform': transform,
        '-ms-transform': transform,
        'transform': transform,
        '-webkit-transition': transition,
        'transition': transition,
        'content': icons
    };


    var iconMap = {
        // .uk-icon-forward
        // .uk-icon-backward
        "\\f04e": "\\f04a",
        "\\f04a": "\\f04e",

        // .uk-icon-fast-forward
        // .uk-icon-fast-backward
        "\\f050": "\\f049",
        "\\f049": "\\f050",

        // .uk-icon-step-forward
        // .uk-icon-step-backward
        "\\f051": "\\f048",
        "\\f048": "\\f051",

        // .uk-icon-mail-forward
        // .uk-icon-share
        // .uk-icon-mail-reply
        // .uk-icon-reply
        "\\f064": "\\f112",
        "\\f112": "\\f064",

        // .uk-icon-rotate-left
        // .uk-icon-undo
        // .uk-icon-rotate-right
        // .uk-icon-repeat
        "\\f0e2": "\\f01e",
        "\\f01e": "\\f0e2",

        // .uk-icon-align-left
        // .uk-icon-align-right
        "\\f036": "\\f038",
        "\\f038": "\\f036",

        // .uk-icon-chevron-left
        // .uk-icon-chevron-right
        "\\f053": "\\f054",
        "\\f054": "\\f053",

        // .uk-icon-arrow-left
        // .uk-icon-arrow-right
        "\\f060": "\\f061",
        "\\f061": "\\f060",

        // .uk-icon-hand-o-left
        // .uk-icon-hand-o-right
        "\\f0a5": "\\f0a4",
        "\\f0a4": "\\f0a5",

        // .uk-icon-arrow-circle-left
        // .uk-icon-arrow-circle-right
        "\\f0a8": "\\f0a9",
        "\\f0a9": "\\f0a8",

        // .uk-icon-caret-left
        // .uk-icon-caret-right
        "\\f0d9": "\\f0da",
        "\\f0da": "\\f0d9",

        // .uk-icon-angle-double-left
        // .uk-icon-angle-double-right
        "\\f100": "\\f101",
        "\\f101": "\\f100",

        // .uk-icon-angle-left
        // .uk-icon-angle-right
        "\\f104": "\\f105",
        "\\f105": "\\f104",

        // .uk-icon-quote-left
        // .uk-icon-quote-right
        "\\f10d": "\\f10e",
        "\\f10e": "\\f10d",

        // .uk-icon-chevron-circle-left
        // .uk-icon-chevron-circle-right
        "\\f137": "\\f138",
        "\\f138": "\\f137",

        // .uk-icon-long-arrow-left
        // .uk-icon-long-arrow-right
        "\\f177": "\\f178",
        "\\f178": "\\f177",

        // .uk-icon-arrow-circle-o-left
        // .uk-icon-arrow-circle-o-right
        "\\f190": "\\f18e",
        "\\f18e": "\\f190",

        // .uk-icon-toggle-left
        // .uk-icon-caret-square-o-left
        // .uk-icon-toggle-right
        // .uk-icon-caret-square-o-right
        "\\f191": "\\f152",
        "\\f152": "\\f191"
    };

    function icons(v) {
        // skip if there is definitely no icon
        if (v.indexOf('\\f') === -1) {
            return v;
        }

        // check all possible icons
        for (var key in iconMap) {
            if(v.indexOf(key) > -1) {
                return v.replace(key, iconMap[key]);
            }
        }

        return v;
    }

    function quad(v, m) {
        // 1px 2px 3px 4px => 1px 4px 3px 2px
        if ((m = v.trim().split(/\s+/)) && m.length == 4) {
            return [m[0], m[3], m[2], m[1]].join(' ');
        }
        return v;
    }

    function quad_radius(v) {
        var m = v.trim().split(/\s+/);
        // 1px 2px 3px 4px => 1px 2px 4px 3px
        // since border-radius: top-left top-right bottom-right bottom-left
        // will be border-radius: top-right top-left bottom-left bottom-right
        if (m && m.length == 4) {
            return [m[1], m[0], m[3], m[2]].join(' ');
        } else if (m && m.length == 3) {
            // 5px 10px 20px => 10px 5px 10px 20px
            return [m[1], m[0], m[1], m[2]].join(' ');
        }
        return v;
    }

    function direction(v) {
        return v.match(/ltr/) ? 'rtl' : v.match(/rtl/) ? 'ltr' : v;
    }

    function bracketCommaSplit(str) {
        /* <prop1>(<args1>), <prop2>(<args2>) -> ["<prop1>(<args1>)", "<prop2>(<args2>)"]*/
        var parenthesisCount = 0,
            lastSplit = 0;
            arr = [];
        for(var i = 0; i<str.length; ++i) {
            var c = str[i];
            parenthesisCount += (c == '(' ? 1 : ( c == ')' ? -1 : 0));
            if ((c==',' && parenthesisCount===0) || i==str.length-1) {
                arr.push(str.substr(lastSplit, i-lastSplit+1).trim().trimComma().trim());
                lastSplit = i+1; // +1 to get rid of the comma
            }
        }
        return arr;
    }

    function rtltr(v) {
        if (v.match(/left/)) return 'right';
        if (v.match(/right/)) return 'left';
        return v;
    }

    function bgPosition(v) {
        if (v.match(/\bleft\b/)) {
            v = v.replace(/\bleft\b/, 'right');
        } else if (v.match(/\bright\b/)) {
            v = v.replace(/\bright\b/, 'left');
        }
        var m = v.trim().split(/\s+/);
        if (m && (m.length == 1) && v.match(/(\d+)([a-z]{2}|%)/)) {
            v = 'right ' + v;
        }
        if (m && m.length == 2 && m[0].match(/\d+%/)) {
            // 30% => 70% (100 - x)
            v = (100 - parseInt(m[0], 10)) + '% ' + m[1];
        }
        pxmatch = m[0].match(/(\-?\d+)px/);
        if(m && m.length == 2 && (pxmatch)) {
            var x = pxmatch[1];
            var minuxX = (x=='0' ? '0' : (parseInt(x, 10) < 0 ? x.substr(1)+'px' : '-'+x+'px'));
            v = minuxX + ' ' + m[1];
        }
        return v;
    }

    function boxShadow(v) {
        var shadowRtl = function(shadow) {
            // multiplies <left> offset with -1
            var found = false;
            var parts = shadow.split(" ");
            parts.forEach(function(el, i, arr) {
                if (!found && el.match(/\d/)) {
                    found = true;
                    arr[i] = (el[0] == "0" ? 0 : (el[0] == "-" ? el.substr(1) : "-"+el));
                }
            });
            return parts.join(" ");
        };

        v = bracketCommaSplit(v).map(shadowRtl).join(',');

        return v;
    }

    function backgroundImage(val) {
        var parseSingle = function(v) {
            if(v.substr(0,4) == "url(") {
                // don't mess with background image paths for now
                return v;
            }
            if (v.indexOf("gradient") != -1) {
                v = v.replace(/(left|right)/g, function($1) {
                    return $1 === 'left' ? 'right' : 'left';
                });
                v = v.replace(/(\d+deg)/, function(el) {
                    var num = parseInt(el.replace('deg', ''), 10);
                    return (180-num) + 'deg';
                });
            }
            return v;
        };
        return bracketCommaSplit(val).map(parseSingle).join(",");
    }

    function background(v) {
        // TODO: split several background layers (divided by comma)

        var parseSingle = function(v) {
            // background-image
            v = v.replace(/url\((.*?)\)|none|([^\s]*?gradient.*?\(.+\))/i, backgroundImage );

            // background-position
            v = v.replace(/\s(left|right|center|top|bottom|-?\d+([a-zA-Z]{2}|%?))\s(left|right|center|top|bottom|-?\d+([a-zA-Z]{2}|%?))[;\s]?/i, function(el) {
                var hadSemicolon = (el.indexOf(';') >= 0);
                el = el.trimSemicolon();
                return ' ' + bgPosition(el) + (hadSemicolon ? ';' : ' ');
            });

            return v;
        };

        return bracketCommaSplit(v).map(parseSingle).join(",");
    }

    function transform(v) {

        var negateValue = function(valString) {
            return (valString[0] == "0" ? 0 : (valString[0] == "-" ? valString.substr(1) : "-"+valString));
        }

        var matches,
            res = '';

        // translate, translateX, translate3D
        if(matches = v.match(/(translate(X|x|3D|3d)?)\(([^,\)]*)([^\)]*)\)/)) {
            var value     = matches[3].trim(),
                remainder = matches[4];
            res  = matches[1]+'('+negateValue(value)+(remainder ? remainder : '')+')';
            v = v.replace(matches[0], res);
        }

        // rotate
        if(matches = v.match(/rotate\(\s*(\d+)\s*deg\s*\)/)) {
            var angle    = parseInt(matches[1], 10),
                mirrored = 180-angle;
            res = ' rotate('+mirrored+'deg)';
            v = v.replace(matches[0], res);
        }

        return v;
    }

    function transition(v) {
        var parts = v.split(' ');
        parts = parts.map(function(part) { return propertyMap[part] || part; });
        return parts.join(' ');
    }

    function convert2RTL(css) {

        return css
            .trim()                                // give it a solid trimming to start
            .replace(/\/\*[\s\S]+?\*\//g, '')      // comments
            .replace(/[\n\r]/g, '')                // line breaks and carriage returns
            .replace(/\s*([:;,{}])\s*/g, '$1')     // space between selectors, declarations, properties and values
            .replace(/\s+/g, ' ')                  // replace multiple spaces with single spaces
            .replace(/([^;:\{\}]+?)\:([^;:\{\}]+?)([;}])/gi, function(el, prop, val, end) {
                var important = /!important/,
                    isImportant = val.match(important);

                if (!prop || !val) return '';

                prop = propertyMap[prop] || prop;
                val  = valueMap[prop] ? valueMap[prop](val) : val;

                if (!val.match(important) && isImportant) val += '!important';

                return prop + ':' + val + end;
            });
    }

    // AMD support
    if (typeof define === 'function' && define.amd) {
        define(function () { return convert2RTL; });
        // CommonJS and Node.js module support.
    } else if (typeof exports !== 'undefined') {
        // Support Node.js specific `module.exports` (which can be a function)
        if (typeof module != 'undefined' && module.exports) {
            exports = module.exports = convert2RTL;
        }
        // But always support CommonJS module 1.1.1 spec (`exports` cannot be a function)
        exports.convert2RTL = convert2RTL;
    } else {

        jQuery.rtl = jQuery.rtl || (function() {
            return {
                'convert2RTL': convert2RTL
            };
        })();
    }

})();
