import $ from 'jquery';

export default function (UIkit) {

    const DATA = UIkit.data;

    UIkit.prototype.$mount = function (el) {

        var name = this.$options.name;

        if (!el[DATA]) {
            el[DATA] = {};
            UIkit.elements.push(el);
        }

        if (el[DATA][name]) {
            console.warn('Component "' + name + '" is already mounted on element: ' + el);
        }

        el[DATA][name] = this;

        this.$el = $(el);

        this._initProps();
        this._callHook('ready');
    };

    UIkit.prototype.$update = function (e) {

        if (!e) {
            e = 'update';
        }

        if (typeof e === 'string') {
            var ev = document.createEvent('Event');
            ev.initEvent(e, true, false);
            e = ev;
        }

        UIkit.getComponents.forEach(component => {
            component._callUpdate(e);
        });
    };

    UIkit.prototype.$destroy = function () {

        this._callHook('destroy');

        delete UIkit.instances[this._uid];

        if (!this.$options.el) {
            return;
        }

        var el = this.$options.el;
        delete el[DATA][this.$options.name];

        if (!Object.keys(el[DATA]).length) {
            delete el[DATA];
            delete UIkit.elements[UIkit.elements.indexOf(el)];
        }

        this.$el.remove();
    };

}
