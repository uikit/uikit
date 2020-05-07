import UIkit from './api/index';
import Core from './core/core';
import boot from './api/boot';
import * as coreComponents from './core/index';
import * as components from './components/index';
import {each} from './util/lang';

// register components
each(coreComponents, register);
each(components, register);

// core functionality
UIkit.use(Core);

boot(UIkit);

export default UIkit;

function register(component, name) {
    UIkit.component(name, component);
}
