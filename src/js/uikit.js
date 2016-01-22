import $ from 'jquery';
import UIkit from './api/index';
import supports from './supports/index';
import * as util from './util/index';

UIkit.version = '3.0.0';
UIkit.supports = supports;
UIkit.util     = util;

UIkit.$doc  = $(document);
UIkit.$win  = $(window);
UIkit.$html = $('html');

// add touch identifier class
UIkit.$html.addClass(UIkit.supports.touch ? 'uk-touch' : 'uk-notouch');

// core components
require('./core/grid')(UIkit);

export default UIkit;
