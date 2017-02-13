import UIkit from './api/index';
import mixin from './mixin/index';
import core from './core/index';
import boot from './api/boot';

UIkit.version = '3.0.0';

mixin(UIkit);
core(UIkit);
boot(UIkit);

export default UIkit;
