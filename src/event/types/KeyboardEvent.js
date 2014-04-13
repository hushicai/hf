define(
    function(require) {
        // 常见键盘码
        var KeyCode = {
             /**
              * 左箭头
              *
              * @type {number}
              */
             LEFT: 37,

             /**
              * 上箭头
              *
              * @type {number}
              */
             UP: 38,

             /**
              * 右箭头
              *
              * @type {number}
              */
             RIGHT: 39,

             /**
              * 下箭头
              *
              * @type {number}
              */
             DOWN:40 
        };

        var UIEvent = require('./UIEvent');

        function KeyboardEvent(e) {
            UIEvent.call(this, e);

            this.eventType = 'KeyboardEvent';

            this.ctrlKey = this.ctrlKey || false;
            this.altKey = this.altKey || false;
            this.shiftKey = this.shiftKey || false;
            this.metaKey = this.metaKey || false;
            this.keyCode = this.keyCode || null;
            this.charCode = this.charCode || null;
            this.key = this.key || null;
            this.location = this.location || 0;
        }

        KeyboardEvent.prototype.initEvent = function(eo) {
            var params = [
                this.type,
                this.bubbles,
                this.cancelable,
                this.view,
                this.detail,
                this.key,
                this.location
            ];
            if (eo.initKeyboardEvent) {
                return eo.initKeyboardEvent.apply(eo, params);
            }
            else if(eo.initKeyEvent) {
                return eo.initKeyEvent.apply(eo, params);
            }

            return false;
        }

        KeyboardEvent.KeyCode = KeyCode;

        require('../../util/index').inherit(KeyboardEvent, UIEvent);

        return KeyboardEvent;
    }
);
