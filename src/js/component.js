import Component from 'component';
import name from 'virtual:name';

if (typeof window !== 'undefined' && window.UIkit) {
    window.UIkit.component(name, Component);
}

export default Component;
