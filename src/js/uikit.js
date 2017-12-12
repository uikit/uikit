import boot from './api/boot';
import UIkit from './uikit-core';
import Countdown from './components/countdown';
import GridParallax from './components/grid-parallax';
import Lightbox from './components/lightbox';
import Notification from './components/notification';
import Parallax from './components/parallax';
import Slider from './components/slider';
import Slideshow from './components/slideshow';
import Sortable from './components/sortable';
import Tooltip from './components/tooltip';
import Upload from './components/upload';

UIkit.use(Countdown);
UIkit.use(GridParallax);
UIkit.use(Lightbox);
UIkit.use(Notification);
UIkit.use(Parallax);
UIkit.use(Slider);
UIkit.use(Slideshow);
UIkit.use(Sortable);
UIkit.use(Tooltip);
UIkit.use(Upload);

if (BUNDLED) {
    boot(UIkit);
}

export default UIkit;
