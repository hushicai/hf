/**
 * @file AnimationInstant
 * @author hushicai(bluthcy@gmail.com)
 */

// 立即执行

define(
    function(require) {
        var bind = require('../lang/bind');
        var inherit = require('../lang/inherit');
        var AnimationTime = require('./AnimationTime');

        function AnimationInstant(fn, context) {
            AnimationTime.call(this);

            this._callback = bind(fn, context || this);
        }

        AnimationInstant.prototype = {
            constructor: AnimationInstant,

            update: function(deltaTime) {
                this._timeFraction = 1;
                this.step(1);
                return 1;
            },

            step: function(t) {
                return this._callback(t);
            },

            isEnded: function() {
                return true;
            }
        };

        inherit(AnimationInstant, AnimationTime);

        return AnimationInstant;
    }
);
