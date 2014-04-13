/**
 * @file dom事件
 * @author hushicai02
 */

define(
    function(require) {
        var util = require('../util/index');
        var factory = require('./factory');
        var EventArgs = require('./EventArgs');

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
            var guid = util.getGuid();
            element.guid = guid;
            emitter[guid] = this;
        }

        DomEventEmitter.prototype.on = function(type, listener) {
            type = type.replace(/^on/i, '').toLowerCase();
            var element = this.element;
            var eventHandle = this.eventHandle;

            if (!eventHandle) {
                eventHandle = this.eventHandle = createEventHandle(this);
            }

            if (element.addEventListener) {
                element.addEventListener(type, eventHandle, false);
            } 
            else if(element.attachEvent) {
                element.attachEvent('on' + type, eventHandle);
            }

            var events = this.events[type] = this.events[type] || [];
            events.push(listener);

            return this;
        }

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

                    var element = this.element;
                    var eventHandle = this.eventHandle;
                    if (element.removeEventListener) {
                        element.removeEventListener(type, eventHandle ,false);
                    }
                    else if(element.detachEvent) {
                        element.detachEvent(type, eventHandle);
                    }
                }
            }

            return this;
        }

        DomEventEmitter.prototype.trigger = function(type, options) {
            type = type.replace(/^on/i, "");
            var ev = {
                type: type
            };
            util.extend(ev, options);

            ev = factory.createEvent(ev);
            var element = this.element;

            if (element.dispatchEvent) {
                element.dispatchEvent(ev);
            }
            else if(element.fireEvent) {
                element.fireEvent('on' + type, ev);
            }
        };

        DomEventEmitter.prototype.destroy = function() {
            this.off('*');
            delete this.element;
        }

        return DomEventEmitter;
    }
);
