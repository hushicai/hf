define(
    function(require) {
        var UIEvent = require('./UIEvent');

        function FocusEvent(e) {
            UIEvent.call(this, e);
            this.eventType = 'FocusEvent';
            this.relatedTarget = this.relatedTarget || null;
        }

        require('../../util/index').inherit(FocusEvent, UIEvent);

        return FocusEvent
    }
);
