import Cls from './class';
import Modal from './modal';
import Mouse from './mouse';
import Position from './position';
import Toggable from './toggable';

export default function (UIkit, _) {

    UIkit.use(Cls);
    UIkit.use(Mouse);
    UIkit.use(Position);
    UIkit.use(Toggable);
    UIkit.use(Modal);

}
