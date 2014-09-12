/**
 * @file promise/A+的实现
 * @author hushicai(bluthcy@gmail.com)
 */

define(
    function(require) {
        /**
         * 状态
         * 
         * @type {Object}
         */
        var State = {
            PENDING: 0,
            FULFILLED: 1,
            REJECTED: 2
        };

        /**
         * 异步执行
         * 
         * @inner
         */
        var setImmediate = require('../nextTick/index');

        /**
         * 状态转移
         * 
         * @inner
         */
        function transition(promise, state, value) {
            if (promise.state === state // 状态相同不能转移
                || promise.state !== State.PENDING // `pending`状态的`promise`才能转移
                || (state !== State.FULFILLED && state !== State.REJECTED) // 只能向`fulfilled`或`rejected`转移
            ) {
                return false;
            }

            promise.state = state;
            promise.value = value;

            tryFlush(promise);
        }

        /**
         * 解决
         * #2.3
         * 
         * @inner
         */
        function resolve(promise, x) {
            // #2.3.1
            if (promise === x) {
                return transition(promise, State.REJECTED, new TypeError());
            } 

            // #2.3.2
            if (x && x.constructor === Promise) {
                x.then(function(value) {
                    transition(promise, State.FULFILLED, value);
                }, function(reason) {
                    transition(promise, State.REJECTED, reason);
                });
            }
            // #2.3.3
            else if(x && (typeof x === 'object' || typeof x === 'function')) {
                try {
                    var then = x.then;
                    
                    if (typeof then === 'function') {
                        then.call(x, function(v) {
                            transition(promise, State.FULFILLED, v);
                        }, function(r) {
                            transition(promise, State.REJECTED, r);
                        });
                    }
                    else {
                        transition(promise, State.FULFILLED, x);
                    }
                }
                catch (ex) {
                    transition(promise, State.REJECTED, ex);
                }
            }
            // #2.3.4
            else {
                transition(promise, State.FULFILLED, x);
            }
        }

        /**
         * 执行
         * 
         * @inner
         */
        function tryFlush(promise) {
            if (promise.state === State.PENDING) {
                return;
            }

            function flush() {
                while (promise._queue.length) {
                    var obj = promise._queue.shift();
                    var callback = promise.state === State.FULFILLED
                        ? obj.fulfill
                        : obj.reject;

                    if (typeof callback === 'function') {
                        try {
                            var value = callback(promise.value);
                            resolve(obj.forkedPromise, value);
                        }
                        catch (ex) {
                            transition(obj.forkedPromise, State.REJECTED, ex);
                        }
                    }
                    else {
                        transition(obj.forkedPromise, promise.state, promise.value);
                    }
                }
            }

            setImmediate(flush);
        }

        /**
         * Promise类
         * 
         * @constructor
         */
        function Promise(fn) {
            if (typeof fn !== 'function') {
                throw new TypeError('Promise should be called with a function argument.');
            }

            if (!(this instanceof Promise)) {
                throw new TypeError('Promise should be called with `new`.');
            }

            this.state = State.PENDING;
            this.value = null;

            this._queue = [];
            
            var self = this;

            try {
                fn(function(value) {
                    transition(self, State.FULFILLED, value);
                }, function(reason) {
                    transition(self, State.REJECTED, reason);
                });
            }
            catch(ex) {
                transition(self, State.REJECTED, ex);
            }
        }

        /**
         * 核心方法`then`
         * 
         * @public
         * @return {Promise} 
         */
        Promise.prototype.then = function(onFulfilled, onRejected) {
            var forkedPromise = new Promise(function() {});

            this._queue.push({
                fulfill: onFulfilled,
                reject: onRejected,
                forkedPromise: forkedPromise
            });

            return forkedPromise;
        };

        /**
         * 捕获异常
         * 
         * @public
         * @return {Promise}
         */
        Promise.prototype.catch = function(onRejected) {
            return this.then(null, onRejected);
        };

        Promise.resovled = function() {};

        Promise.rejected = function() {};

        return Promise;
    }
);

/* vim: set ft=javascript ts=4 sw=4 sts=4 tw=120 fdm=indent: */
