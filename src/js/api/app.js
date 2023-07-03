import * as util from 'uikit-util';
import { init } from './state';

const App = function (options) {
    init(this, options);
};

App.util = util;
App.options = {};
App.version = VERSION;

export default App;
