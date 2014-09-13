/**
 * @file Motion
 * @author hushicai(bluthcy@gmail.com)
 */

define(
    function(require) {
        var inherit = require('../lang/inherit');
        var extend = require('../lang/extend');
        var AnimationInterval = require('./AnimationInterval');

        function Motion(motionInput, timingInput) {
            AnimationInterval.call(this, timingInput);

            extend(this, motionInput);
        }

        Motion.prototype = {
            constructor: Motion,

            /**
             * 计算样式
             * 
             * @public
             */
            step: function(animationTarget) {
                return animationTarget;
            }
        };

        inherit(Motion, AnimationInterval);

        return Motion;
    }
);
