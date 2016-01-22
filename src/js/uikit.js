import UIkit from './api/index';
import coreComponents from './core/index';

UIkit.version = '3.0.0';

coreComponents(UIkit, UIkit.util);

export default UIkit;
module.exports = UIkit;
