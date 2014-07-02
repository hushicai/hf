define(
    function(require) {
        var Event = require('./Event');

        function InputEvent(e) {
            Event.call(this, e);

            this.data = this.data || '';
        }

        require('../../util/index').inherit(InputEvent, Event);

        return InputEvent;
    }
);
