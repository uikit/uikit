
// small DOM pimping
NodeList.prototype.forEach = NodeList.prototype.forEach || Array.prototype.forEach;

let $DOM = window.jQuery;

$DOM.watch = function(el, fn, config) {
    let observer = new MutationObserver(fn);
    observer.observe(el, config || { attributes: true, childList: true, characterData: true });
    return observer;
};

module.exports = $DOM;
