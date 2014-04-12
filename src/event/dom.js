/**
 * @file dom事件
 * @author hushicai02
 */

define(
    function(require) {
        var EventWrapper = require('./EventWrapper');

        return {
            on: function(element, type, fn) {
                var realListener = function(e) {
                    e = new EventWrapper(e);
                    return fn(e);
                }
                if (element.addEventListener) {
                    element.addEventListener(type, realListener, false);
                } 
                else if(element.attachEvent) {
                    element.attachEvent('on' + type, realListener);
                }

                return element;
            },
            un: function() {},
            once: function() {}
        };
    }
);
