import Class from './class';
import Modal from './modal';
import Position from './position';
import Toggable from './toggable';

export {Class, Modal, Position, Toggable}

export default function (UIkit) {

    UIkit.mixin.class = Class;
    UIkit.mixin.modal = Modal;
    UIkit.mixin.position = Position;
    UIkit.mixin.toggable = Toggable;

}
