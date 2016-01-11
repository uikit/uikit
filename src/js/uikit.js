import util from './lib/util';
import dom from './lib/dom';
import support from './lib/support';
import component from './lib/component';


let UI = {};

UI.util      = util;
UI.dom       = dom;
UI.support   = support;
UI.component = component(UI);

export default UI;
