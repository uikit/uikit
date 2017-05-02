import Class from './class';
import Modal from './modal';
import Position from './position';
import Togglable from './togglable';

export {Class, Modal, Position, Togglable}

export default function (UIkit) {

    UIkit.mixin.class = Class;
    UIkit.mixin.modal = Modal;
    UIkit.mixin.position = Position;
    UIkit.mixin.togglable = Togglable;

}
