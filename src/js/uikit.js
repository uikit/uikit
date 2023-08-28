import { each } from 'uikit-util';
import * as components from './components/index';
import UIkit from './uikit-core';

each(components, (component, name) => UIkit.component(name, component));

export default UIkit;
