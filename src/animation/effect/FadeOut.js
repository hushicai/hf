/**
 * @file FadeOut
 * @author hushicai(bluthcy@gmail.com)
 */

define(
    function(require) {
        var inherit = require('../../lang/inherit');
        var extend = require('../../lang/extend');
        var AnimationInterval = require('../AnimationInterval');

        function FadeOut(input, timingInput) {
            AnimationInterval.call(this, timingInput);

            extend(this, input);

            this._startOpacity = null;
        }

        FadeOut.prototype = {
            constructor: FadeOut,

            step: function(t) {
                var animationTarget = this._target;

                if (!this._startOpacity) {
                    this._startOpacity = animationTarget.getPropertyValue('opacity');
                }

                var style = {};

                style.opacity = this._startOpacity + (this.opacity - this._startOpacity) * t;

                animationTarget.composite(style);
            }
        };

        inherit(FadeOut, AnimationInterval);

        return FadeOut;
    }
);
