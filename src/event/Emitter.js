/**
 * @file 自定义事件包装类
 * @author hushicai02
 */

define(
    function(require) {
        function EventEmitter() {
            this.events = {};
        }

        EventEmitter.prototype.on = function(type, listener) {
            var events = this.events[type] = this.events[type] || [];

            events.push(listener);

            return this;
        };

        EventEmitter.prototype.off = function(type, listener) {
            if (type === '*') {
                this.events = {};
            } 
            else if(listener) {
                var list = this.events[type];
                if (!list) {
                    return this;
                }
                var len = list.length;
                for(var i = len - 1; i >= 0; i--) {
                    if (listener === list[i]) {
                        list.splice(i, 1);
                        break;
                    }
                }
            } else {
                delete this.events[type];
            }

            return this;
        };

        EventEmitter.prototype.emit = function(type) {
            var list = this.events[type];
            if (!list) {
                return this;
            }
            // nodejs对一些特殊的情况进行了优化
            // 比如只有一个参数、两个参数、三个参数时，直接调用，这样会比较快
            // nodejs中也不使用slice方法，而是使用new Array复制一遍
            // 咱这就没必要了，凑合
            var temp = list.slice();
            var args = [].slice.call(arguments, 1);
            for(var i = list.length - 1; i >=0; i--) {
                temp[i].apply(this, args);
            }

            return this;
        };

        return EventEmitter;
    }
);
