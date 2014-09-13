/**
 * @file 异步执行
 * @author hushicai(bluthcy@gmail.com)
 */

// 用处：
// promise
// async

// 还可以做得更复杂
// 比如考虑MutationObserver

define(
    function(require) {
        var nextTick;

        if (typeof setImmediate === 'function') {
            nextTick = function(fn) {
                setImmediate(fn);
            };
        }
        else {
            nextTick = function(fn) {
                setTimeout(fn, 0);
            };
        }

        return nextTick;
    }
);
