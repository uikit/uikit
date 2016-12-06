/**
 * Deferreds/A+ polyfill v1.1.4 (https://github.com/bramstein/promis)
 */

const RESOLVED = 0;
const REJECTED = 1;
const PENDING  = 2;

export function Deferred(executor) {

    this.state = PENDING;
    this.value = undefined;
    this.deferred = [];

    var promise = this;

    try {
        executor(function (x) {
            return promise.resolve(x);
        }, function (r) {
            return promise.reject(r);
        });
    } catch (e) {
        return promise.reject(e);
    }
}

Deferred.reject = function (r) {
    return new Deferred(function (resolve, reject) {
        reject(r);
    });
};

Deferred.resolve = function (x) {
    return new Deferred(function (resolve, reject) {
        resolve(x);
    });
};

Deferred.all = function all(iterable) {
    return new Deferred(function (resolve, reject) {
        var count = 0, result = [];

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

        for (var i = 0; i < iterable.length; i += 1) {
            Deferred.resolve(iterable[i]).then(resolver(i), reject);
        }
    });
};

Deferred.race = function race(iterable) {
    return new Deferred(function (resolve, reject) {
        for (var i = 0; i < iterable.length; i += 1) {
            Deferred.resolve(iterable[i]).then(resolve, reject);
        }
    });
};

var p = Deferred.prototype;

p.resolve = function resolve(x) {
    var promise = this;

    if (promise.state === PENDING) {
        if (x === promise) {
            throw new TypeError('Deferred settled with itself.');
        }

        var called = false;

        try {
            var then = x && x['then'];

            if (x !== null && typeof x === 'object' && typeof then === 'function') {
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

    return promise;
};

p.reject = function reject(reason) {
    var promise = this;

    if (promise.state === PENDING) {
        if (reason === promise) {
            throw new TypeError('Deferred settled with itself.');
        }

        promise.state = REJECTED;
        promise.value = reason;
        promise.notify();
    }

    return promise;
};

p.notify = function notify() {
    var promise = this;

    if (promise.state !== PENDING) {
        while (promise.deferred.length) {
            var deferred = promise.deferred.shift(),
                onResolved = deferred[0],
                onRejected = deferred[1],
                resolve = deferred[2],
                reject = deferred[3];

            try {
                if (promise.state === RESOLVED) {
                    if (typeof onResolved === 'function') {
                        resolve(onResolved.call(undefined, promise.value));
                    } else {
                        resolve(promise.value);
                    }
                } else if (promise.state === REJECTED) {
                    if (typeof onRejected === 'function') {
                        resolve(onRejected.call(undefined, promise.value));
                    } else {
                        reject(promise.value);
                    }
                }
            } catch (e) {
                reject(e);
            }
        }
    }
};

p.then = function then(onResolved, onRejected) {
    var promise = this;

    return new Deferred(function (resolve, reject) {
        promise.deferred.push([onResolved, onRejected, resolve, reject]);
        promise.notify();
    });
};

p.catch = function (onRejected) {
    return this.then(undefined, onRejected);
};
