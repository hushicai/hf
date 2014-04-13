define(
    function(require) {
        var util = require('../../util/index');
        var UIEvent = require('./UIEvent');

        var Button = {
            LEFT: 0,
            MIDDLE: 1,
            RIGHT: 2
        };

        function MouseEvent(e) {
            UIEvent.call(this, e);

            this.eventType = 'MouseEvents';

            this.screenX = this.screenX || 0;
            this.screenY = this.screenY || 0;
            this.clientX = this.clientX || 0;
            this.clientY = this.clientY || 0;
            this.pageX = this.pageX || 0;
            this.pageY = this.pageY || 0;
            this.ctrlKey = this.ctrlKey || false;
            this.shiftKey = this.shiftKey || false;
            this.altKey = this.altKey || false;
            this.metaKey = this.metaKey || false;
            this.button = this.button || Button.LEFT;
            this.relatedTarget = this.relatedTarget || null;
        }

        MouseEvent.prototype.initEvent = function(eo) {
            if (eo.initMouseEvent) {
                return eo.initMouseEvent(
                    this.type,
                    this.bubbles,
                    this.cancelable,
                    this.view,
                    this.detail,
                    this.screenX,
                    this.screenY,
                    this.clientX,
                    this.clientY,
                    this.ctrlKey,
                    this.altKey,
                    this.shiftKey,
                    this.metaKey,
                    this.button,
                    this.relatedTarget
                );
            }

            return false;
        }

        util.inherit(MouseEvent, UIEvent);

        return MouseEvent;
    }
);
