import * as util from 'uikit-util';
import VERSION from 'virtual:version';
import { init } from './state';

export default function App(options) {
    init(this, options);
}

App.util = util;
App.options = {};
App.version = VERSION;
