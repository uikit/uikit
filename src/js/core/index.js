import $ from 'jquery';
import Alert from './alert';
import Button from './button';
import ButtonCheckbox from './button-checkbox';
import ButtonRadio from './button-radio';
import Close from './close';
import Cover from './cover';
import Drop from './drop';
import Dropdown from './dropdown';
import Grid from './grid';
import Icon from './icon';
import MarginWrap from './margin-wrap';
import MatchHeight from './match-height';
import Responsive from './responsive';
import Scrollspy from './scrollspy';
import ScrollspyNav from './scrollspy-nav';
import SmoothScroll from './smooth-scroll';
import Svg from './svg';
import Toggle from './toggle';
import {throttle} from '../util/index';

export default function (UIkit, _) {

    // add touch identifier class
    $('html').addClass(_.hasTouch ? 'uk-touch' : 'uk-notouch');

    $(window)
        .on('DOMContentLoaded', () => UIkit.update('ready'))
        .on('load', UIkit.update)
        .on('resize orientationchange', throttle(UIkit.update, 50))
        .on('scroll', throttle(() => UIkit.update('scrolling'), 15));

    // core components
    UIkit.use(Alert);
    UIkit.use(Button);
    UIkit.use(ButtonCheckbox);
    UIkit.use(ButtonRadio);
    UIkit.use(Cover);
    UIkit.use(Drop);
    UIkit.use(Dropdown);
    UIkit.use(MarginWrap);
    UIkit.use(Grid);
    UIkit.use(Icon);
    UIkit.use(Close);
    UIkit.use(MatchHeight);
    UIkit.use(Responsive);
    UIkit.use(Scrollspy);
    UIkit.use(ScrollspyNav);
    UIkit.use(SmoothScroll);
    UIkit.use(Svg);
    UIkit.use(Toggle);

}
