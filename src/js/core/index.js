import $ from 'jquery';
import Alert from './alert';
import Close from './close';
import Cover from './cover';
import Drop from './drop';
import Dropdown from './dropdown';
import Grid from './grid';
import HeightExpand from './height-expand';
import Icon from './icon';
import MarginWrap from './margin-wrap';
import MatchHeight from './match-height';
import Navbar from './navbar';
import Responsive from './responsive';
import Scrollspy from './scrollspy';
import ScrollspyNav from './scrollspy-nav';
import SmoothScroll from './smooth-scroll';
import Sticky from './sticky';
import Svg from './svg';
import Toggle from './toggle';
import {requestAnimationFrame} from '../util/index';

export default function (UIkit, _) {

    // add touch identifier class
    $('html').addClass(_.hasTouch ? 'uk-touch' : 'uk-notouch');

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

    // core components
    UIkit.use(Alert);
    UIkit.use(Cover);
    UIkit.use(Drop);
    UIkit.use(Dropdown);
    UIkit.use(MarginWrap);
    UIkit.use(Grid);
    UIkit.use(HeightExpand);
    UIkit.use(Icon);
    UIkit.use(Close);
    UIkit.use(MatchHeight);
    UIkit.use(Navbar);
    UIkit.use(Responsive);
    UIkit.use(Scrollspy);
    UIkit.use(ScrollspyNav);
    UIkit.use(SmoothScroll);
    UIkit.use(Sticky);
    UIkit.use(Svg);
    UIkit.use(Toggle);

}
