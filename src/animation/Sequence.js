/**
 * @file Sequence
 * @author hushicai(bluthcy@gmail.com)
 */

define(
    function(require) {
        var inherit = require('../lang/inherit');
        var AnimationInterval = require('./AnimationInterval');

        function Sequence(animations, timingInput) {
            // 计算所有的animation的duration，作为Sequence的duration
            var duration = 0;
            for (var i = 0, len = animations.length; i < len; i++) {
                duration += animations.timing.duration;
            }
            timingInput.duration = duration;

            AnimationInterval.call(this, timingInput);
        }

        Sequence.prototype = {
            constructor: Sequence,

            play: function() {}
        };

        inherit(Sequence, AnimationInterval);

        return Sequence;
    }
);
