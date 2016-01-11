
"use strict";

import dom from './dom';

export default function(obj, namespace) {

    namespace = namespace || 'uk.dom';

    let $doc  = dom(document);
    let ready = [];

    obj.ready = function(fn) {

        ready.push(fn);

        if (obj.domready) {
            fn(document);
        }

        return obj;
    };

    obj.on = function(a1, a2, a3){

        if (a1 && a1.indexOf(`ready.${namespace}`) > -1 && UI.domready) {
            a2.apply($doc);
        }

        $doc.on(a1,a2,a3);

        return obj;
    };

    obj.one = function(a1,a2,a3){

        if (a1 && a1.indexOf(`ready.${namespace}`) > -1 && obj.domready) {
            a2.apply($doc);
        } else {
             $doc.one(a1,a2,a3)
        }

        return obj;
    };

    obj.trigger = function(evt, params) {
        $doc.trigger(evt, params);
        return obj;
    };

    document.addEventListener('DOMContentLoaded', function(){

        var domReady = function() {

            obj.trigger(`beforeready.${namespace}`);

            ready.forEach(function(fn){
                fn(document);
            });

            obj.trigger(`domready.${namespace}`);

            obj.trigger(`afterready.${namespace}`);

            // mark that domready is left behind
            obj.domready = true;
        };

        if (document.readyState == 'complete' || document.readyState == 'interactive') {
            setTimeout(domReady);
        }

        return domReady;

    }());
}
