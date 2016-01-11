"use strict";

// small DOM pimping
NodeList.prototype.forEach = NodeList.prototype.forEach || Array.prototype.forEach;

let $ = window.jQuery;

$.$doc  = $(document);
$.$win  = $(window);
$.$html = $('html');

$.observe = function(el, fn, config) {
    let observer = new MutationObserver(fn);
    observer.observe(el, config || { childList: true, subtree: true });
    return observer;
};

export default $;
