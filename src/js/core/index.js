import $ from 'jquery';
import Grid from './grid';

export default function (UIkit, _) {

    // add touch identifier class
    $('html').addClass(_.hasTouch ? 'uk-touch' : 'uk-notouch');

    // core components
    UIkit.use(Grid);

}
