import $ from 'jquery';
import Alert from './alert';
import Cover from './cover';
import Grid from './grid';
import Icon from './icon';
import MarginWrap from './margin-wrap';
import MatchHeight from './match-height';
import Responsive from './responsive';
import Svg from './svg';
import Toggle from './toggle';
import {debounce} from '../util/lang';

export default function (UIkit, _) {

    // add touch identifier class
    $('html').addClass(_.hasTouch ? 'uk-touch' : 'uk-notouch');

    // TODO debounce
    $(window).on('resize orientationchange', debounce(e => {
        for (var id in UIkit.instances) {
            UIkit.instances[id]._callUpdate(e);
        }
    }, 15));

    // core components
    UIkit.use(Alert);
    UIkit.use(Cover);
    UIkit.use(Grid);
    UIkit.use(Icon);
    UIkit.use(MarginWrap);
    UIkit.use(MatchHeight);
    UIkit.use(Responsive);
    UIkit.use(Svg);
    UIkit.use(Toggle);

}
