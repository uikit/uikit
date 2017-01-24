import globalAPI from './global';
import internalAPI from './internal';
import instanceAPI from './instance';
import componentAPI from './component';
import * as util from '../util/index';

var UIkit = function (options) {
    this._init(options);
};

UIkit.util = util;
UIkit.data = '__uikit__';
UIkit.prefix = 'uk-';
UIkit.options = {};
UIkit.instances = {};
UIkit.elements = [];

globalAPI(UIkit);
internalAPI(UIkit);
instanceAPI(UIkit);
componentAPI(UIkit);

export default UIkit;
