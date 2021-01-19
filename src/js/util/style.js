import {isIE} from './env';
import {append, remove} from './dom';
import {addClass} from './class';
import {cacheFunction, each, hyphenate, isArray, isNumber, isNumeric, isObject, isString, isUndefined, toNodes, toWindow} from './lang';

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
    'stroke-dasharray': true,
    'stroke-dashoffset': true,
    'widows': true,
    'z-index': true,
    'zoom': true
};

export function css(element, property, value, priority = '') {

    return toNodes(element).map(element => {

        if (isString(property)) {

            property = propName(property);

            if (isUndefined(value)) {
                return getStyle(element, property);
            } else if (!value && !isNumber(value)) {
                element.style.removeProperty(property);
            } else {
                element.style.setProperty(property, isNumeric(value) && !cssNumber[property] ? `${value}px` : value, priority);
            }

        } else if (isArray(property)) {

            const styles = getStyles(element);

            return property.reduce((props, property) => {
                props[property] = styles[propName(property)];
                return props;
            }, {});

        } else if (isObject(property)) {
            priority = value;
            each(property, (value, property) => css(element, property, value, priority));
        }

        return element;

    })[0];

}

function getStyles(element, pseudoElt) {
    return toWindow(element).getComputedStyle(element, pseudoElt);
}

function getStyle(element, property, pseudoElt) {
    return getStyles(element, pseudoElt)[property];
}

const parseCssVar = cacheFunction(name => {
    /* usage in css: .uk-name:before { content:"xyz" } */

    const element = append(document.documentElement, document.createElement('div'));

    addClass(element, `uk-${name}`);

    name = getStyle(element, 'content', ':before').replace(/^["'](.*)["']$/, '$1');

    remove(element);

    return name;
});

export function getCssVar(name) {
    return !isIE
        ? getStyles(document.documentElement).getPropertyValue(`--uk-${name}`)
        : parseCssVar(name);
}

// https://drafts.csswg.org/cssom/#dom-cssstyledeclaration-setproperty
export const propName = cacheFunction(name => vendorPropName(name));

const cssPrefixes = ['webkit', 'moz', 'ms'];

function vendorPropName(name) {

    name = hyphenate(name);

    const {style} = document.documentElement;

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
