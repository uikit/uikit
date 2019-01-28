import {toFloat} from './lang';
import {on} from './event';
import {isInView} from './dimensions';

export const IntersectionObserver = 'IntersectionObserver' in window
    ? window.IntersectionObserver
    : class IntersectionObserverClass {

        constructor(callback, {rootMargin = '0 0'} = {}) {

            this.targets = [];

            const [offsetTop, offsetLeft] = (rootMargin || '0 0').split(' ').map(toFloat);

            this.offsetTop = offsetTop;
            this.offsetLeft = offsetLeft;

            let pending;
            this.apply = () => {

                if (pending) {
                    return;
                }

                pending = requestAnimationFrame(() => setTimeout(() => {
                    const records = this.takeRecords();

                    if (records.length) {
                        callback(records, this);
                    }

                    pending = false;
                }));

            };

            this.off = on(window, 'scroll resize load', this.apply, {passive: true, capture: true});

        }

        takeRecords() {
            return this.targets.filter(entry => {

                const inView = isInView(entry.target, this.offsetTop, this.offsetLeft);

                if (entry.isIntersecting === null || inView ^ entry.isIntersecting) {
                    entry.isIntersecting = inView;
                    return true;
                }

            });
        }

        observe(target) {
            this.targets.push({
                target,
                isIntersecting: null
            });
            this.apply();
        }

        disconnect() {
            this.targets = [];
            this.off();
        }

    };
