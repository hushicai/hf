define(
    function(require) {
        var util = require('../util/index');
        var MouseEvent = require('./types/MouseEvent');
        var KeyboardEvent = require('./types/KeyboardEvent');
        var FocusEvent = require('./types/FocusEvent');
        var HTMLEvent = require('./types/HTMLEvent');
        var InputEvent = require('./types/InputEvent');
        var WheelEvent = require('./types/WheelEvent');

        // TODO: bubbles、cancelable配置

        var keyboardEvents = [
            'keydown',
            'keyup',
            'keypress'
        ];
        var mouseEvents = [
            'click',
            'dbclick',
            'mousedown',
            'mousemove',
            'mouseover',
            'mouseout'
        ];
        var focusEvents = [
            'focusin',
            'focusout',
            'focus',
            'blur'
        ];
        var wheelEvents = [
            'wheel'
        ];
        var inputEvents = [
            'beforeinput',
            'input'
        ];
        var htmlEvents = [
            'abort',
            'change',
            'error',
            'load',
            'reset',
            'resize',
            'scroll',
            'select',
            'submit',
            'unload'
        ];

        var factory = {};
        util.each(keyboardEvents, function(v, i) {
            factory[v] = KeyboardEvent;
        });
        util.each(mouseEvents, function(v, i) {
            factory[v] = MouseEvent;
        });
        util.each(focusEvents, function(v, i) {
            factory[v] = FocusEvent;
        });
        util.each(wheelEvents, function(v, i) {
            factory[v] = WheelEvent;
        });
        util.each(inputEvents, function(v, i) {
            factory[v] = InputEvent;
        });
        util.each(htmlEvents, function(v, i) {
            factory[v] = HTMLEvent;
        });

        return {
            createEvent: function(e) {
                var ev;
                if (e && e.type) {
                    ev = e;
                }
                else {
                    ev = {
                        type: e
                    };
                }
                ev = new factory[ev.type](ev);

                return ev.createDomEvent();
            }
        };
    }
);
