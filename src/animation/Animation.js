/**
 * @file Animation
 * @author hushicai(bluthcy@gmail.com)
 */

// 一般化的动画类

define(
    function(require) {
        var inherit = require('../lang/inherit');
        var helper = require('./helper');
        var AnimationInterval = require('./AnimationInterval');
        var AnimationEffect = require('./AnimationEffect');
        var KeyframeEffect = require('./KeyframeEffect');
        var AnimationPlayer = require('./AnimationPlayer');

        function interpretAnimationEffect(animationEffect, target) {
            if (typeof animationEffect === 'function') {
                return {
                    sample: animationEffect
                };
            }
            else if (animationEffect instanceof AnimationEffect) {
                return animationEffect;
            }
            else {
                return new KeyframeEffect(animationEffect);
            }
            return null;
        }

        /**
         * 动画
         * 
         * @constructor
         */
        function Animation(target, animationEffect, timingInput) {
            AnimationInterval.call(this, timingInput);

            this.effect = interpretAnimationEffect(animationEffect, target);
            this.target = target;
        }

        Animation.prototype = {
            constructor: Animation,

            _sample: function() {
                if (helper.isDefinedAndNotNull(this.effect)) {
                    this.effect.sample(this.target, this._timeFraction, this.currentIteration);
                }
            },

            _getInEffect: function(items) {
                if (this._timeFraction !== null) {
                    items.push(this);
                }
            }
        };

        inherit(Animation, AnimationInterval);

        return Animation;
    }
);
