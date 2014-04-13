define(
    function(require) {
        var MouseEvent = require('./MouseEvent');

        function WheelEvent(e) {
            MouseEvent.call(this, e);

            this.eventType = 'WheelEvent';

            this.deltaMode = this.deltaMode || 0;
            this.deltaX = this.deltaX || 0;
            this.deltaY = this.deltaY || 0;
            this.deltaZ = this.deltaZ || 0;
        }

        require('../../util/index').inherit(WheelEvent, MouseEvent);

        return WheelEvent;
    }
);
