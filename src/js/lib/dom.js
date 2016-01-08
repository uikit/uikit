"use strict";

// small DOM pimping
NodeList.prototype.forEach = NodeList.prototype.forEach || Array.prototype.forEach;

let $ = window.jQuery;

$.$doc  = $(document);
$.$win  = $(window);
$.$html = $('html');

$.watch = function(el, fn, config) {
    let observer = new MutationObserver(fn);
    observer.observe(el, config || { attributes: true, childList: true, characterData: true });
    return observer;
};

$.register = function(name, def) {
    document.registerElement(name, { prototype: Object.assign(Object.create(HTMLElement.prototype), def || {}) });
};

module.exports = $;
