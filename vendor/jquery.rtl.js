/*!
  * A CSS LTR 2 RTL converter, part of UIkit and WARP framework.
  * http://getuikit.com/
  * http://www.yootheme.com/warp
  *
  * Based on R2 - a CSS LTR 2 RTL converter (https://github.com/ded/r2, Dustin Diaz, MIT License)
  */

(function($) {

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
        'transition': transition
    };

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
            var value     = $.trim(matches[3]),
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

    $.rtl = $.rtl || (function() {
        return {
            'convert2RTL': convert2RTL
        };
    })();

})(jQuery);