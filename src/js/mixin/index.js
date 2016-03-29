import Mouse from './mouse';
import Position from './position';
import Svg from './svg';
import Toggable from './toggable';

export default function (UIkit, _) {

    UIkit.use(Mouse);
    UIkit.use(Position);
    UIkit.use(Svg);
    UIkit.use(Toggable);

}
