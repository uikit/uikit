import UIkit from './api/index';
import mixin from './mixin/index';
import core from './core/index';
import boot from './api/boot';

UIkit.version = VERSION;

mixin(UIkit);
core(UIkit);

if (!BUNDLED) {
    boot(UIkit);
}

export default UIkit;
