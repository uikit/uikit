import { getStyle, fastdom, on, requestAnimationFrame, win } from '../util/index';

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
import Spinner from './spinner';
import Sticky from './sticky';
import Svg from './svg';
import Switcher from './switcher';
import Tab from './tab';
import Toggle from './toggle';

export default function (UIkit) {

    var scroll = null, dir, ticking, resizing;

    win
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

            if (scroll === null) {
                scroll = window.pageYOffset;
            }

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
        fastdom.measure(() => {
            if (hasAnimation(target)) {
                fastdom.mutate(() => {
                    document.body.style.overflowX = 'hidden';
                    started++;
                });
            }
        });
    }, true);

    on(document, 'animationend', ({target}) => {
        fastdom.measure(() => {
            if (hasAnimation(target) && !--started) {
                fastdom.mutate(() => document.body.style.overflowX = '')
            }
        });
    }, true);

    on(document.documentElement, 'webkitAnimationEnd', ({target}) => {
        fastdom.measure(() => {
            if (getStyle(target, 'webkitFontSmoothing') === 'antialiased') {
                fastdom.mutate(() => {
                    target.style.webkitFontSmoothing = 'subpixel-antialiased';
                    setTimeout(() => target.style.webkitFontSmoothing = '');
                })
            }
        });
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
    UIkit.use(Gif);
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
    UIkit.use(Spinner);
    UIkit.use(Switcher);
    UIkit.use(Tab);
    UIkit.use(Toggle);

    function hasAnimation(target) {
        return (getStyle(target, 'animationName') || '').lastIndexOf('uk-', 0) === 0;
    }
}
