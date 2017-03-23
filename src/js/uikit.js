import boot from './api/boot';
import UIkit from './uikit-core';
import Lightbox from './components/lightbox';
import Notification from './components/notification';
import Sortable from './components/sortable';
import Tooltip from './components/tooltip';
import Upload from './components/upload';

UIkit.use(Lightbox);
UIkit.use(Notification);
UIkit.use(Sortable);
UIkit.use(Tooltip);
UIkit.use(Upload);

if (BUNDLED) {
    boot(UIkit);
}

export default UIkit;
