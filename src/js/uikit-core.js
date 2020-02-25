import UIkit from './api/index';
import Core from './core/core';
import boot from './api/boot';
import * as components from './core/index';
import {each} from './util/lang';

// register components
each(components, (component, name) =>
    UIkit.component(name, component)
);

// core functionality
UIkit.use(Core);

boot(UIkit);

export default UIkit;
