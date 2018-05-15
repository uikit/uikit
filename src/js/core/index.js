import Accordion from './accordion';
import Alert from './alert';
import Core from './core';
import Cover from './cover';
import Drop from './drop';
import Dropdown from './dropdown';
import FormCustom from './form-custom';
import Gif from './gif';
import Grid from './grid';
import HeightMatch from './height-match';
import HeightViewport from './height-viewport';
import Icon, {IconComponent, Slidenav, Search, Close, Spinner} from './icon';
import Img from './img';
import Leader from './leader';
import Margin from './margin';
import Modal from './modal';
import Nav from './nav';
import Navbar from './navbar';
import Offcanvas from './offcanvas';
import OverflowAuto from './overflow-auto';
import Responsive from './responsive';
import Scroll from './scroll';
import Scrollspy from './scrollspy';
import ScrollspyNav from './scrollspy-nav';
import Sticky from './sticky';
import Svg from './svg';
import Switcher from './switcher';
import Tab from './tab';
import Toggle from './toggle';
import Video from './video';

export default function (UIkit) {

    // core components
    UIkit.component('accordion', Accordion);
    UIkit.component('alert', Alert);
    UIkit.component('cover', Cover);
    UIkit.component('drop', Drop);
    UIkit.component('dropdown', Dropdown);
    UIkit.component('formCustom', FormCustom);
    UIkit.component('gif', Gif);
    UIkit.component('grid', Grid);
    UIkit.component('heightMatch', HeightMatch);
    UIkit.component('heightViewport', HeightViewport);
    UIkit.component('icon', Icon);
    UIkit.component('img', Img);
    UIkit.component('leader', Leader);
    UIkit.component('margin', Margin);
    UIkit.component('modal', Modal);
    UIkit.component('nav', Nav);
    UIkit.component('navbar', Navbar);
    UIkit.component('offcanvas', Offcanvas);
    UIkit.component('overflowAuto', OverflowAuto);
    UIkit.component('responsive', Responsive);
    UIkit.component('scroll', Scroll);
    UIkit.component('scrollspy', Scrollspy);
    UIkit.component('scrollspyNav', ScrollspyNav);
    UIkit.component('sticky', Sticky);
    UIkit.component('svg', Svg);
    UIkit.component('switcher', Switcher);
    UIkit.component('tab', Tab);
    UIkit.component('toggle', Toggle);
    UIkit.component('video', Video);

    // Icon components
    UIkit.component('close', Close);
    UIkit.component('marker', IconComponent);
    UIkit.component('navbarToggleIcon', IconComponent);
    UIkit.component('overlayIcon', IconComponent);
    UIkit.component('paginationNext', IconComponent);
    UIkit.component('paginationPrevious', IconComponent);
    UIkit.component('searchIcon', Search);
    UIkit.component('slidenavNext', Slidenav);
    UIkit.component('slidenavPrevious', Slidenav);
    UIkit.component('spinner', Spinner);
    UIkit.component('totop', IconComponent);

    // core functionality
    UIkit.use(Core);

}
