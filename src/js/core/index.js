import { $, on, requestAnimationFrame } from '../util/index';

import Accordion from './accordion';
import Alert from './alert';
import Cover from './cover';
import Drop from './drop';
import Dropdown from './dropdown';
import FormCustom from './form-custom';
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

export default function (UIkit) {

    var scroll = window.pageYOffset, dir, ticking, resizing;

    $(window)
        .on('load', UIkit.update)
        .on('resize orientationchange', e => {
            if (!resizing) {
                requestAnimationFrame(() => {
                    UIkit.update(e);
                    resizing = false;
                });
                resizing = true;
            }
        })
        .on('scroll', e => {
            dir = scroll < window.pageYOffset;
            scroll = window.pageYOffset;
            if (!ticking) {
                requestAnimationFrame(() => {
                    e.dir = dir ? 'down' : 'up';
                    UIkit.update(e);
                    ticking = false;
                });
                ticking = true;
            }
        });

    var started = 0;
    on(document, 'animationstart', ({target}) => {
        if ($(target).css('animationName').lastIndexOf('uk-', 0) === 0) {
            document.body.style.overflowX = 'hidden';
            started++;
        }
    }, true);

    on(document, 'animationend', ({target}) => {
        if ($(target).css('animationName').lastIndexOf('uk-', 0) === 0 && !--started) {
            document.body.style.overflowX = '';
        }
    }, true);

    on(document.documentElement, 'webkitAnimationEnd', ({target}) => {
        if ((getComputedStyle(target) || {}).webkitFontSmoothing === 'antialiased') {
            target.style.webkitFontSmoothing = 'subpixel-antialiased';
            setTimeout(() => target.style.webkitFontSmoothing = '');
        }
    }, true);

    // core components
    UIkit.use(Accordion);
    UIkit.use(Alert);
    UIkit.use(Cover);
    UIkit.use(Drop);
    UIkit.use(Dropdown);
    UIkit.use(FormCustom);
    UIkit.use(HeightMatch);
    UIkit.use(HeightViewport);
    UIkit.use(Hover);
    UIkit.use(Margin);
    UIkit.use(Grid);
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
    UIkit.use(Toggle);

}
