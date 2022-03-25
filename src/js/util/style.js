import {
    each,
    hyphenate,
    isArray,
    isNumber,
    isNumeric,
    isObject,
    isString,
    isUndefined,
    memoize,
    toNodes,
} from './lang';

const cssNumber = {
    'animation-iteration-count': true,
    'column-count': true,
    'fill-opacity': true,
    'flex-grow': true,
    'flex-shrink': true,
    'font-weight': true,
    'line-height': true,
    opacity: true,
    order: true,
    orphans: true,
    'stroke-dasharray': true,
    'stroke-dashoffset': true,
    widows: true,
    'z-index': true,
    zoom: true,
};

export function css(element, property, value, priority = '') {
    const elements = toNodes(element);
    for (const element of elements) {
        if (isString(property)) {
            property = propName(property);

            if (isUndefined(value)) {
                return getComputedStyle(element).getPropertyValue(property);
            } else {
                element.style.setProperty(
                    property,
                    isNumeric(value) && !cssNumber[property]
                        ? `${value}px`
                        : value || isNumber(value)
                        ? value
                        : '',
                    priority
                );
            }
        } else if (isArray(property)) {
            const props = {};
            for (const prop of property) {
                props[prop] = css(element, prop);
            }
            return props;
        } else if (isObject(property)) {
            priority = value;
            each(property, (value, property) => css(element, property, value, priority));
        }
    }
    return elements[0];
}

const propertyRe = /^\s*(["'])?(.*?)\1\s*$/;
export function getCssVar(name, element = document.documentElement) {
    return css(element, `--uk-${name}`).replace(propertyRe, '$2');
}

// https://drafts.csswg.org/cssom/#dom-cssstyledeclaration-setproperty
export const propName = memoize((name) => vendorPropName(name));

const cssPrefixes = ['webkit', 'moz'];

function vendorPropName(name) {
    if (name[0] === '-') {
        return name;
    }

    name = hyphenate(name);

    const { style } = document.documentElement;

    if (name in style) {
        return name;
    }

    let i = cssPrefixes.length,
        prefixedName;

    while (i--) {
        prefixedName = `-${cssPrefixes[i]}-${name}`;
        if (prefixedName in style) {
            return prefixedName;
        }
    }
}
