import $ from 'jquery';

export default function (UIkit) {

    let $doc  = $(document);
    let ready = [];

    UIkit.ready = function(fn) {

        ready.push(fn);

        if (UIkit.domready) {
            fn(document);
        }

        return UIkit;
    };

    UIkit.on = function(a1, a2, a3){

        if (a1 && a1.indexOf('ready.uk.dom') > -1 && UI.domready) {
            a2.apply($doc);
        }

        $doc.on(a1,a2,a3);

        return UIkit;
    };

    UIkit.one = function(a1,a2,a3){

        if (a1 && a1.indexOf('ready.uk.dom') > -1 && UIkit.domready) {
            a2.apply($doc);
        } else {
             $doc.one(a1,a2,a3)
        }

        return UIkit;
    };

    UIkit.trigger = function(evt, params) {
        $doc.trigger(evt, params);
        return UIkit;
    };

    document.addEventListener('DOMContentLoaded', function(){

        let domReady = function() {

            UIkit.trigger('beforeready.uk.dom');

            ready.forEach(function(fn){
                fn(document);
            });

            UIkit.trigger('domready.uk.dom');

            UIkit.trigger('afterready.uk.dom');

            // mark that domready is left behind
            UIkit.domready = true;
        };

        if (document.readyState == 'complete' || document.readyState == 'interactive') {
            setTimeout(domReady);
        }

        return domReady;

    }());


};
