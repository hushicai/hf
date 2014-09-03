/**
 * @file dom事件包装类
 * @author hushicai02
 */

define(
    function(require) {
        var getGuid = require('../lang/getGuid');

        /**
         * 事件对象
         * 
         * @constructor
         */
        function EventArgs(e) {
            this.originEvent = e;

            for(var k in e) {
                var item = e[k];
                if (typeof item !== 'function') {
                    this[k] = item;
                }
            }

            this.target = this.target || this.srcElement;
            this.which = this.which || this.keyCode;
        }
        EventArgs.prototype.stopPropagation = function() {

        };
        EventArgs.prototype.preventDefault = function() {};

        // jQuery的事件实现方式比较牛逼
        // 对于每一个元素，都使用同一个事件监听器，在该事件监听器中，对事件进行dispatch
        // 这样做，我觉得有以下好处：
        //   1、方便对事件进行优先级控制
        //   2、方便事件的添加和删除
        //   3、方便控制事件回调函数的上下文
        //   4、不需要再区分HTMLEvents、MouseEvents等等
        //   ...

        function createEventHandle(de) {
            return function(e) {
                var ev = new EventArgs(e);

                // 分派事件
                var type = ev.type;
                var handlers = de.events[type] || [];

                var args = [].slice.call(arguments, 1);
                args.unshift(ev);

                for(var i = handlers.length - 1; i >= 0; i--) {
                    handlers[i].apply(de.element, args);
                }
            };
        }

        var emitter = {};

        function getEmitter(guid) {
            return emitter[guid];
        }

        // 将dom元素包装起来，方便对listeners进行管理
        function DomEventEmitter(element) {
            if (element.guid) {
                return getEmitter(element.guid);
            }

            this.element = element;
            this.events = {};
            this.eventHandle = null;

            // 挂载一个guid
            var guid = getGuid();
            element.guid = guid;
            emitter[guid] = this;
        }

        DomEventEmitter.prototype.on = function(type, listener) {
            type = type.replace(/^on/i, '');
            var eventHandle = this.eventHandle;

            if (!eventHandle) {
                eventHandle = this.eventHandle = createEventHandle(this);
            }

            this.constructor.addEventListener(this.element, type, eventHandle);

            var events = this.events[type] = this.events[type] || [];
            events.push(listener);

            return this;
        };

        DomEventEmitter.prototype.off = function(type, listener) {
            if (type === '*') {
                for(var k in this.events) {
                    this.off(k);
                }
            }
            else {
                var list = this.events[type] || [];
                for(var i = list.length - 1; i >=0; i--) {
                    if (!listener || listener === list[i]) {
                        list.splice(i, 1);

                        if (listener) {
                            break;
                        }
                    }
                }

                // 如果该类型事件已经没有处理器了，则移除该事件类型的事件监听
                if (this.events[type] && list.length === 0) {
                    delete this.events[type];

                    this.constructor.removeEventListener(this.element, type, this.eventHandle);
                }
            }

            return this;
        };

        DomEventEmitter.prototype.trigger = function(type, options) {
            type = type.replace(/^on/i, '');

            // 简单地来吧
            // jquery就是这么触发的
            try {
                // 触发`click`等可以直接调用的事件
                this.element[type]();
            }
            catch (ex) {
                // 一些特殊的事件无法程序自动trigger
                // 真正要触发各种事件的话
                // 得处理好多中事件类型，比如HTMLEvents、MouseEvents等
                // 之前写了，但感觉比较乱，所以删了
            }
        };

        DomEventEmitter.prototype.dispose = function() {
            this.off('*');
            delete this.element;
        };

        // 添加事件监听
        DomEventEmitter.addEventListener = function(element, type, listener) {
            if (element.addEventListener) {
                element.addEventListener(type, listener, false);
            } 
            else if(element.attachEvent) {
                element.attachEvent('on' + type, listener);
            }

            return this;
        };
        // 移除事件监听
        DomEventEmitter.removeEventListener = function(element, type, listener) {
            if (element.removeEventListener) {
                element.removeEventListener(type, listener ,false);
            }
            else if(element.detachEvent) {
                element.detachEvent(type, listener);
            }

            return this;
        };

        return DomEventEmitter;
    }
);
