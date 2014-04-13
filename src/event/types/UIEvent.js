define(
    function(require) {
        var Event = require('./Event');

        function UIEvent(e) {
            Event.call(this, e);

            this.eventType = 'UIEvent';

            this.view = null;
            this.detail = 0;
        }

        require('../../util/index').inherit(UIEvent, Event);

        return UIEvent;
    }
);
