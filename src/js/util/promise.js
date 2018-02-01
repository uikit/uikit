/* global setImmediate */
import {isFunction, isObject} from './lang';

/**
 * Promises/A+ polyfill v1.1.4 (https://github.com/bramstein/promis)
 */

const RESOLVED = 0;
const REJECTED = 1;
const PENDING = 2;

const async = 'setImmediate' in window ? setImmediate : setTimeout;

export default function Promise(executor) {

    this.state = PENDING;
    this.value = undefined;
    this.deferred = [];

    const promise = this;

    try {
        executor(function (x) {
            promise.resolve(x);
        }, function (r) {
            promise.reject(r);
        });
    } catch (e) {
        promise.reject(e);
    }
}

Promise.reject = function (r) {
    return new Promise(function (resolve, reject) {
        reject(r);
    });
};

Promise.resolve = function (x) {
    return new Promise(function (resolve, reject) {
        resolve(x);
    });
};

Promise.all = function all(iterable) {
    return new Promise(function (resolve, reject) {
        const result = [];
        let count = 0;

        if (iterable.length === 0) {
            resolve(result);
        }

        function resolver(i) {
            return function (x) {
                result[i] = x;
                count += 1;

                if (count === iterable.length) {
                    resolve(result);
                }
            };
        }

        for (let i = 0; i < iterable.length; i += 1) {
            Promise.resolve(iterable[i]).then(resolver(i), reject);
        }
    });
};

Promise.race = function race(iterable) {
    return new Promise(function (resolve, reject) {
        for (let i = 0; i < iterable.length; i += 1) {
            Promise.resolve(iterable[i]).then(resolve, reject);
        }
    });
};

const p = Promise.prototype;

p.resolve = function resolve(x) {
    const promise = this;

    if (promise.state === PENDING) {
        if (x === promise) {
            throw new TypeError('Promise settled with itself.');
        }

        let called = false;

        try {
            const then = x && x.then;

            if (x !== null && isObject(x) && isFunction(then)) {
                then.call(x, function (x) {
                    if (!called) {
                        promise.resolve(x);
                    }
                    called = true;

                }, function (r) {
                    if (!called) {
                        promise.reject(r);
                    }
                    called = true;
                });
                return;
            }
        } catch (e) {
            if (!called) {
                promise.reject(e);
            }
            return;
        }

        promise.state = RESOLVED;
        promise.value = x;
        promise.notify();
    }
};

p.reject = function reject(reason) {
    const promise = this;

    if (promise.state === PENDING) {
        if (reason === promise) {
            throw new TypeError('Promise settled with itself.');
        }

        promise.state = REJECTED;
        promise.value = reason;
        promise.notify();
    }
};

p.notify = function notify() {
    async(() => {
        if (this.state !== PENDING) {
            while (this.deferred.length) {
                const [onResolved, onRejected, resolve, reject] = this.deferred.shift();

                try {
                    if (this.state === RESOLVED) {
                        if (isFunction(onResolved)) {
                            resolve(onResolved.call(undefined, this.value));
                        } else {
                            resolve(this.value);
                        }
                    } else if (this.state === REJECTED) {
                        if (isFunction(onRejected)) {
                            resolve(onRejected.call(undefined, this.value));
                        } else {
                            reject(this.value);
                        }
                    }
                } catch (e) {
                    reject(e);
                }
            }
        }
    });
};

p.then = function then(onResolved, onRejected) {
    return new Promise((resolve, reject) => {
        this.deferred.push([onResolved, onRejected, resolve, reject]);
        this.notify();
    });
};

p.catch = function (onRejected) {
    return this.then(undefined, onRejected);
};
