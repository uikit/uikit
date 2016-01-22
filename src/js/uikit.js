import $ from 'jquery';
import UIkit, {util} from './api/index';

UIkit.version = '3.0.0';

UIkit.$doc  = $(document);
UIkit.$win  = $(window);
UIkit.$html = $('html');

// add touch identifier class
UIkit.$html.addClass(util.hasTouch ? 'uk-touch' : 'uk-notouch');

// core components
require('./core/grid')(UIkit);

export default UIkit;
