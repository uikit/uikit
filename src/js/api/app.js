import { init } from './state';
import * as util from 'uikit-util';

const App = function (options) {
    init(this, options);
};

App.util = util;
App.options = {};
App.version = VERSION;

export default App;
