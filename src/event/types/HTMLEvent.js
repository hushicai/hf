define(
    function(require) {
        var Event = require('./Event');

        function HTMLEvent(e) {
            Event.call(this, e);
        }

        require('../../util/index').inherit(HTMLEvent, Event);

        return HTMLEvent;
    }
);
