import $ from 'jquery';
import {requestAnimationFrame} from '../util/index';

import Accordion from './accordion';
import Alert from './alert';
import Close from './close';
import Cover from './cover';
import Drop from './drop';
import Dropdown from './dropdown';
import Grid from './grid';
import HeightMatch from './height-match';
import HeightViewport from './height-viewport';
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
import Slidenav from './slidenav';
import Totop from './totop';
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

    // add uk-hover class on tap to support overlays on touch devices
    // Todo: Rework?
    (function(){

        var hoverset;
        var hovercls = 'uk-hover';
        var selector = '.uk-animation-toggle, .uk-transition-toggle, [uk-hover]';

        $('html').on('mouseenter touchstart MSPointerDown pointerdown', selector, function() {

            if (hoverset && hoverset.length) {
                $(`.${hovercls}`).removeClass(hovercls);
            }

            hoverset = $(this).addClass(hovercls);

        }).on('mouseleave touchend MSPointerUp pointerup', selector, function(e) {

            if (hoverset && hoverset.length) {
                hoverset.removeClass(hovercls);
            }
        });

    })();

    // core components
    UIkit.use(Accordion);
    UIkit.use(Alert);
    UIkit.use(Cover);
    UIkit.use(Drop);
    UIkit.use(Dropdown);
    UIkit.use(Margin);
    UIkit.use(Grid);
    UIkit.use(HeightMatch);
    UIkit.use(HeightViewport);
    UIkit.use(Svg);
    UIkit.use(Icon);
    UIkit.use(Close);
    UIkit.use(Slidenav);
    UIkit.use(Totop);
    UIkit.use(Modal);
    UIkit.use(Nav);
    UIkit.use(Navbar);
    UIkit.use(Offcanvas);
    UIkit.use(Responsive);
    UIkit.use(Scroll);
    UIkit.use(Scrollspy);
    UIkit.use(ScrollspyNav);
    UIkit.use(Sticky);
    UIkit.use(Switcher);
    UIkit.use(Tab);
    UIkit.use(Toggle);

}
