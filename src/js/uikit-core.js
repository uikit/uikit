import UIkit from './api/index';
import core from './core/index';
import boot from './api/boot';

UIkit.version = VERSION;

core(UIkit);

if (!BUNDLED) {
    boot(UIkit);
}

export default UIkit;
