import { animationstart, fastdom, getStyle, on, toMs } from '../util/index';

import Accordion from './accordion';
import Alert from './alert';
import Cover from './cover';
import Drop from './drop';
import Dropdown from './dropdown';
import FormCustom from './form-custom';
import Gif from './gif';
import Grid from './grid';
import HeightMatch from './height-match';
import HeightViewport from './height-viewport';
import Hover from './hover';
import Icon from './icon';
import Margin from './margin';
import Modal from './modal';
import Nav from './nav';
import Navbar from './navbar';
import Offcanvas from './offcanvas';
import Responsive from './responsive';
import Scroll from './scroll';
import Scrollspy from './scrollspy';
import ScrollspyNav from './scrollspy-nav';
import Sticky from './sticky';
import Svg from './svg';
import Switcher from './switcher';
import Tab from './tab';
import Toggle from './toggle';
import Leader from './leader';
import Video from './video';

export default function (UIkit) {

    var scroll = 0, started = 0;

    on(window, 'load resize', UIkit.update);
    on(window, 'scroll', e => {
        e.dir = scroll < window.pageYOffset ? 'down' : 'up';
        scroll = window.pageYOffset;
        UIkit.update(e);
        fastdom.flush();
    });

    animationstart && on(document, animationstart, ({target}) => {
        if ((getStyle(target, 'animationName') || '').match(/^uk-.*(left|right)/)) {
            started++;
            document.body.style.overflowX = 'hidden';
            setTimeout(() => {
                if (!--started) {
                    document.body.style.overflowX = '';
                }
            }, toMs(getStyle(target, 'animationDuration')) + 100);
        }
    }, true);

    // core components
    UIkit.use(Toggle);
    UIkit.use(Accordion);
    UIkit.use(Alert);
    UIkit.use(Video);
    UIkit.use(Cover);
    UIkit.use(Drop);
    UIkit.use(Dropdown);
    UIkit.use(FormCustom);
    UIkit.use(HeightMatch);
    UIkit.use(HeightViewport);
    UIkit.use(Hover);
    UIkit.use(Margin);
    UIkit.use(Gif);
    UIkit.use(Grid);
    UIkit.use(Leader);
    UIkit.use(Modal);
    UIkit.use(Nav);
    UIkit.use(Navbar);
    UIkit.use(Offcanvas);
    UIkit.use(Responsive);
    UIkit.use(Scroll);
    UIkit.use(Scrollspy);
    UIkit.use(ScrollspyNav);
    UIkit.use(Sticky);
    UIkit.use(Svg);
    UIkit.use(Icon);
    UIkit.use(Switcher);
    UIkit.use(Tab);

}
