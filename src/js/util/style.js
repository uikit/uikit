import {isIE} from './env';
import {append, remove} from './dom';
import {addClass} from './class';
import {each, hyphenate, isArray, isNumeric, isObject, isString, isUndefined, toNode, toNodes} from './lang';

const cssNumber = {
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

            const styles = getStyles(element);

            return property.reduce((props, property) => {
                props[property] = styles[propName(property)];
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

const vars = {};

export function getCssVar(name) {

    const docEl = document.documentElement;

    if (!isIE) {
        return getStyles(docEl).getPropertyValue(`--uk-${name}`);
    }

    if (!(name in vars)) {

        /* usage in css: .uk-name:before { content:"xyz" } */

        const element = append(docEl, document.createElement('div'));

        addClass(element, `uk-${name}`);

        vars[name] = getStyle(element, 'content', ':before').replace(/^["'](.*)["']$/, '$1');

        remove(element);

    }

    return vars[name];

}

const cssProps = {};

export function propName(name) {

    let ret = cssProps[name];
    if (!ret) {
        ret = cssProps[name] = vendorPropName(name) || name;
    }
    return ret;
}

const cssPrefixes = ['webkit', 'moz', 'ms'];
const {style} = document.createElement('_');

function vendorPropName(name) {

    name = hyphenate(name);

    if (name in style) {
        return name;
    }

    let i = cssPrefixes.length, prefixedName;

    while (i--) {
        prefixedName = `-${cssPrefixes[i]}-${name}`;
        if (prefixedName in style) {
            return prefixedName;
        }
    }
}
