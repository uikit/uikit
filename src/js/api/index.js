import globalAPI from './global';
import hooksAPI from './hooks';
import stateAPI from './state';
import instanceAPI from './instance';
import componentAPI from './component';
import * as util from 'uikit-util';

const UIkit = function (options) {
    this._init(options);
};

UIkit.util = util;
UIkit.data = '__uikit__';
UIkit.prefix = 'uk-';
UIkit.options = {};

globalAPI(UIkit);
hooksAPI(UIkit);
stateAPI(UIkit);
componentAPI(UIkit);
instanceAPI(UIkit);

export default UIkit;
