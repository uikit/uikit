import UIkit from './uikit-core';
import * as components from './components/index';
import {each} from './util/lang';

each(components, (component, name) =>
    UIkit.component(name, component)
);

export default UIkit;
