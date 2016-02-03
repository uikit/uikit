import $ from 'jquery';
import Alert from './alert';
import Cover from './cover';
import Grid from './grid';
import Icon from './icon';
import MarginWrap from './margin-wrap';
import MatchHeight from './match-height';
import Popover from './popover';
import Responsive from './responsive';
import Svg from './svg';
import Toggle from './toggle';
import {throttle} from '../util/index';

export default function (UIkit, _) {

    // add touch identifier class
    $('html').addClass(_.hasTouch ? 'uk-touch' : 'uk-notouch');

    $(window)
        .on('DOMContentLoaded', function() {
            UIkit.update('ready')}
        )
        .on('load', UIkit.update)
        .on('resize orientationchange', throttle(UIkit.update, 150));

    // core components
    UIkit.use(Alert);
    UIkit.use(Cover);
    UIkit.use(Grid);
    UIkit.use(Icon);
    UIkit.use(MarginWrap);
    UIkit.use(MatchHeight);
    UIkit.use(Popover);
    UIkit.use(Responsive);
    UIkit.use(Svg);
    UIkit.use(Toggle);

}
