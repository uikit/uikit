import bootAPI from './boot';
import globalAPI from './global';
import internalAPI from './internal';
import componentAPI from './component';
import eventAPI from './event';

var UIkit = function (options) {
    this._init(options);
};

UIkit.options = {};

bootAPI(UIkit);
globalAPI(UIkit);
internalAPI(UIkit);
componentAPI(UIkit);
eventAPI(UIkit);

export default UIkit;
