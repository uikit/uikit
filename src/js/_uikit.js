import globalAPI from './api/global';
import internalAPI from './api/internal';

var UIkit = window.UIkit3 = function (options) {
    this._init(options);
};

UIkit.version = '3.0.0';
UIkit.options = {};

globalAPI(UIkit);
internalAPI(UIkit);

export default UIkit;
