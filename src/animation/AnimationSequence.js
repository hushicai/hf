/**
 * @file AnimationSequence
 * @author hushicai(bluthcy@gmail.com)
 */

define(
    function(require) {
        var inherit = require('../lang/inherit');
        var AnimationInterval = require('./AnimationInterval');

        function AnimationSequence(animations, timingInput) {
            timingInput = timingInput || {};
            // 计算所有的animation的duration，作为AnimationSequence的duration
            var duration = 0;
            for (var i = 0, len = animations.length; i < len; i++) {
                duration += animations[i].getInterval();
            }
            timingInput.duration = duration;

            // 父类
            AnimationInterval.call(this, timingInput);

            // 计算分割点
            var split = [];
            var temp = 0;
            for (var i = 0, len = animations.length; i < len; i++) {
                var animation = animations[i];
                temp += animation.getInterval();
                split.push({
                    t: temp / duration,
                    index: i
                });
            }

            this._split = split;
            this._animations = animations;
            this._currentAnimation = null;
        }

        AnimationSequence.prototype = {
            constructor: AnimationSequence,

            updateTime: function(deltaTime) {
                this.superClass.prototype.updateTime.call(this, deltaTime);

                this._previousAnimation = this._currentAnimation;

                var t = this._timeFraction;
                var idx;
                for (var i = 0, len = this._split.length; i < len; i++) {
                    if (t <= this._split[i].t) {
                        idx = i;
                        break;
                    }
                }
                var split = this._split[idx];
                this._currentAnimation = this._animations[split.index];

                if (this._previousAnimation && this._currentAnimation !== this._previousAnimation) {
                    this._previousAnimation.updateTime(deltaTime);
                }

                this._currentAnimation.updateTime(deltaTime);
            },

            step: function(animationTarget) {
                if (this._previousAnimation && this._currentAnimation !== this._previousAnimation) {
                    this._previousAnimation.step(animationTarget);
                    this._previousAnimation.stop();
                }
                this._currentAnimation.step(animationTarget);
            }
        };

        inherit(AnimationSequence, AnimationInterval);

        return AnimationSequence;
    }
);
