/**
 * @file getObservedObject
 * @author hushicai(bluthcy@gmail.com)
 */

define(
    function(require) {
        var type = require('../lang/type');
        var State = require('./State');
        var observedObjectCache = [];

        function newObservedObject() {
            var observer;
            var data;
            var isDiscardRecords = false;
            var isFirstTime = true;

            function callback(records) {
                if (observer && observer.state === State.opened && !isDiscardRecords) {
                    observer._check(records);
                }
            }

            return {
                open: function(obs) {
                    if (observer) {
                        return false;
                    }

                    // 缓冲记录
                    if (!isFirstTime) {
                        Object.deliverChangeRecords(callback);
                    }

                    observer = obs;
                    isFirstTime = false;
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
                // 刷新缓冲
                deliver: function(isDiscard) {
                    isDiscardRecords = isDiscard;
                    Object.deliverChangeRecords(callback);
                    isDiscardRecords = false;
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

        return getObservedObject;
    }
);
