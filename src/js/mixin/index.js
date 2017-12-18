import Animator from './animator';
import Class from './class';
import Container from './container';
import Filter from './filter';
import Margin from './margin';
import Modal from './modal';
import Position from './position';
import Togglable from './togglable';

export { Animator, Class, Container, Margin, Modal, Position, Togglable, Filter };

export default function (UIkit) {

    UIkit.mixin.animator = Animator;
    UIkit.mixin.class = Class;
    UIkit.mixin.container = Container;
    UIkit.mixin.filter = Filter;
    UIkit.mixin.margin = Margin;
    UIkit.mixin.modal = Modal;
    UIkit.mixin.position = Position;
    UIkit.mixin.togglable = Togglable;

}
