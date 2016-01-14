import util from './lib/util';
import $ from './lib/dom';
import support from './lib/support';
import component from './lib/component';
import eventize from './lib/eventize';


let UI = {};

// dom references
UI.$doc  = $(document);
UI.$win  = $(window);
UI.$html = $('html');

UI.util      = util;
UI.$         = $;
UI.support   = support;
UI.component = component(UI);

eventize(UI);

UI.on('updated.uk.dom', function(e) {
    UI.Utils.checkDisplay(e.target);
});

UI.one('beforeready.uk.dom', function() {
    UI.$body = $('body');
});

// add touch identifier class
UI.$html.addClass(UI.support.touch ? 'uk-touch' : 'uk-notouch');

// core components
require('./core/grid')(UI);




export default UI;
