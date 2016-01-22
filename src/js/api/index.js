import bootAPI from './boot';
import globalAPI from './global';
import internalAPI from './internal';
import componentAPI from './component';
import * as util from '../util/index';

var UIkit = function (options) {
    this._init(options);
};

UIkit.util = util;
UIkit.options = {};

globalAPI(UIkit);
internalAPI(UIkit);
componentAPI(UIkit);
bootAPI(UIkit);

export default UIkit;
