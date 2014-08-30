/**
 * @file 监听js数据变化
 * @author hushicai(bluthcy@gmail.com)
 */

// 参考：https://github.com/Polymer/observe-js

define(
    function(require) {
        var getGuid = require('../lang/getGuid');
        var inherit = require('../lang/inherit');
        var type = require('../lang/type');
        var object = require('../lang/object');
        // var extend = require('../lang/extend');

        // 是否支持es6的observe方法
        var hasObserve = typeof Object.observe === 'function' && typeof Array.observe === 'function';

        function diffIsEmpty(diff) {
            return object.isEmpty(diff.added) &&
                object.isEmpty(diff.removed) &&
                object.isEmpty(diff.changed);
        }

        var expectedRecordTypes = {
            'add': true,
            'update': true,
            'delete': true
        };

        function diffWidthChangeRecords(data, changeRecords) {
            var added = {};
            var removed = {};
            var changed = {};

            for (var i = 0; i < changeRecords.length; i++) {
                var record = changeRecords[i];
                var type = record.type;
                var name = record.name;

                if (!expectedRecordTypes[type]) {
                    continue;
                }

                if (type === 'update') {
                    changed[name] = data[name];
                }

                if (type === 'add') {
                    added[name] = data[name];
                }

                if (type === 'delete') {
                    removed[name] = undefined;
                }
            }

            return {
                added: added,
                removed: removed,
                changed: changed
            };
        }

        var observedObjectCache = [];

        function newObservedObject() {
            var observer;
            var data;
            var discardRecords = false;
            var first = true;

            function callback(records) {
                if (observer && observer.state === OPENED && !discardRecords) {
                    observer._check(records);
                }
            }

            return {
                open: function(obs) {
                    if (observer) {
                        throw Error('ObservedObject正在使用中');
                    }

                    if (!first) {
                        Object.deliverChangeRecords(callback);
                    }

                    observer = obs;
                    first = false;
                },
                observe: function(d) {
                    data = d;
                    if (type.isArray(data)) {
                        Array.observe(data, callback);
                    }
                    else if (type.isObject(data)) {
                        Object.observe(data, callback);
                    }
                    else {
                        throw new TypeError('数据类型错误');
                    }
                },
                deliver: function(discard) {
                    discardRecords = discard;
                    Object.deliverChangeRecords(callback);
                    discardRecords = false;
                },
                close: function() {
                    observer = undefined;
                    Object.unobserve(data, callback);
                    observedObjectCache.push(this);
                }
            };
        }

        function getObservedObject(observer, data) {
            var t = observedObjectCache.pop() || newObservedObject();
            t.open(observer);
            t.observe(data);
            return t;
        }


        // 状态
        var UNOPENED = 0;
        var OPENED = 1;
        // var CLOSED = 2;
        // var RESETTING = 3;

        function Observer() {
            this.state = UNOPENED;
            this.data = undefined;
            this.oldData = undefined;
            this.id = getGuid('Observer');

            this._callback = [];
            this._target = undefined;
            this._directObserver = undefined;
        }

        Observer.prototype = {
            constructor: Observer,
            open: function(callback, target) {
                if (this.state !== UNOPENED) {
                    throw new Error('Observer已经被打开！');
                }

                this.state = OPENED;

                this._callback = callback;
                this._target = target;
                this._connect();

                return this.data;
            },
            close: function() {

            },
            diliver: function() {

            },
            discard: function() {

            },
            _report: function(changes) {
                try {
                    this._callback.apply(this._target, changes);
                } catch (ex) {
                    Observer._errorThrownDuringCallback = true;
                    console.error('Exception caught during observer callback: ' + (ex.stack || ex));
                }
            }
        };

        function ObjectObserver(obj) {
            Observer.call(this);
            this.data = obj;
        }
        ObjectObserver.prototype = {
            constructor: ObjectObserver,
            _connect: function(callback) {
                if (hasObserve) {
                    this._directObserver = getObservedObject(this, this.data);
                } 
                // jshint ignore: start
                else { }
                // jshint ignore: end
            },
            _check: function(changeRecords, skipChanges) {
                var diff;
                var oldData;

                if (hasObserve) {
                    if (!changeRecords) {
                        return false;
                    }

                    diff = diffWidthChangeRecords(this.data, changeRecords);
                } 
                // jshint ignore: start
                else {
                    // oldData = this.oldObject_;
                    // diff = diffObjectFromOldObject(this.value_, this.oldObject_);
                }
                // jshint ignore: end

                if (diffIsEmpty(diff)) {
                    return false;
                }

                // jshint ignore: start
                if (!hasObserve) {
                    // this.oldObject_ = this.copyObject(this.value_);
                }
                // jshint ignore: end

                this._report([
                    diff.added || {},
                    diff.removed || {},
                    diff.changed || {},
                    function(property) {
                        return oldData[property];
                    }
                ]);

                return true;
            },
            _disconnect: function() {
                if (hasObserve) {
                    this._directObserver.close();
                    this._directObserver = undefined;
                } 
                // jshint ignore: start
                else {
                    // this.oldObject_ = undefined;
                }
                // jshint ignore: end
            }
        };

        inherit(ObjectObserver, Observer);

        function ArrayObserver(array) {
            ObjectObserver.call(this, array);
        }
        ArrayObserver.prototype = {
            constructor: ArrayObserver
        };
        inherit(ArrayObserver, ObjectObserver);

        return {
            ObjectObserver: ObjectObserver,
            ArrayObserver: ArrayObserver
        };
    }
);
