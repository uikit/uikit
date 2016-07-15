import UIkit from './api/index';
import mixin from './mixin/index';
import core from './core/index';

UIkit.version = '3.0.0';

mixin(UIkit);
core(UIkit);

export default UIkit;

if (typeof module !== 'undefined') {
    module.exports = UIkit;
}
