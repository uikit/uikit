import {
    hyphenate,
    isArray,
    isNumber,
    isNumeric,
    isObject,
    isString,
    isUndefined,
    memoize,
    startsWith,
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

export function css(element, property, value, priority) {
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
                    priority,
                );
            }
        } else if (isArray(property)) {
            const props = {};
            for (const prop of property) {
                props[prop] = css(element, prop);
            }
            return props;
        } else if (isObject(property)) {
            for (const prop in property) {
                css(element, prop, property[prop], value);
            }
        }
    }
    return elements[0];
}

export function resetProps(element, props) {
    for (const prop in props) {
        css(element, prop, '');
    }
}

// https://drafts.csswg.org/cssom/#dom-cssstyledeclaration-setproperty
export const propName = memoize((name) => {
    if (startsWith(name, '--')) {
        return name;
    }

    name = hyphenate(name);

    const { style } = document.documentElement;

    if (name in style) {
        return name;
    }

    for (const prefix of ['webkit', 'moz']) {
        const prefixedName = `-${prefix}-${name}`;
        if (prefixedName in style) {
            return prefixedName;
        }
    }
});
