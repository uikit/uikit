import UIkit from './api/index';
import boot from './api/boot';
import * as components from './core/index';
import { each } from 'uikit-util';

// register components
each(components, (component, name) => UIkit.component(name, component));

boot(UIkit);

export default UIkit;
