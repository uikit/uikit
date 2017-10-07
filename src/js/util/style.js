import { addClass, append, doc, docEl, each, hyphenate, isArray, isNumeric, isObject, isString, isUndefined, toNode, toNodes } from './index';

var cssNumber = {
    'animation-iteration-count': true,
    'column-count': true,
    'fill-opacity': true,
    'flex-grow': true,
    'flex-shrink': true,
    'font-weight': true,
    'line-height': true,
    'opacity': true,
    'order': true,
    'orphans': true,
    'widows': true,
    'z-index': true,
    'zoom': true
};

export function css(element, property, value) {

    return toNodes(element).map(element => {

        if (isString(property)) {

            property = propName(property);

            if (isUndefined(value)) {
                return getStyle(element, property);
            } else if (!value && value !== 0) {
                element.style.removeProperty(property);
            } else {
                element.style[property] = isNumeric(value) && !cssNumber[property] ? `${value}px` : value;
            }

        } else if (isArray(property)) {

            var styles = getStyles(element);

            return property.reduce((props, property) => {
                props[property] = propName(styles[property]);
                return props;
            }, {});

        } else if (isObject(property)) {
            each(property, (value, property) => css(element, property, value));
        }

        return element;

    })[0];

}

export function getStyles(element, pseudoElt) {
    element = toNode(element);
    return element.ownerDocument.defaultView.getComputedStyle(element, pseudoElt);
}

export function getStyle(element, property, pseudoElt) {
    return getStyles(element, pseudoElt)[property];
}

var vars = {};

export function getCssVar(name) {

    if (!(name in vars)) {

        /* usage in css:  .var-name:before { content:"xyz" } */

        var element = append(docEl, doc.createElement('div'));

        addClass(element, `var-${name}`);

        try {

            vars[name] = getStyle(element, 'content', ':before').replace(/^["'](.*)["']$/, '$1');
            vars[name] = JSON.parse(vars[name]);

        } catch (e) {}

        docEl.removeChild(element);

    }

    return vars[name];

}

var cssProps = {};

function propName(name) {

    var ret = cssProps[name];
    if (!ret) {
        ret = cssProps[name] = vendorPropName(name) || name;
    }
    return ret;
}

var cssPrefixes = ['webkit', 'moz', 'ms'],
    style = doc.createElement('div').style;

function vendorPropName(name) {

    name = hyphenate(name);

    if (name in style) {
        return name;
    }

    var i = cssPrefixes.length, prefixedName;

    while (i--) {
        prefixedName = `-${cssPrefixes[i]}${name}`;
        if (prefixedName in style) {
            return prefixedName;
        }
    }
}