import { each } from 'uikit-util';
import boot from './api/boot';
import UIkit from './api/index';
import * as components from './core/index';

// register components
each(components, (component, name) => UIkit.component(name, component));

boot(UIkit);

export default UIkit;
