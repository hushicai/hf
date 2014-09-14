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
            this._current = null;
        }

        AnimationSequence.prototype = {
            constructor: AnimationSequence,

            attach: function(animationTarget) {
                this.superClass.prototype.attach.call(this, animationTarget);

                for (var i = 0, len = this._animations.length; i < len; i++) {
                    this._animations[i].attach(animationTarget);
                }
            },

            step: function(t) {
                var idx;
                for (var i = 0, len = this._split.length; i < len; i++) {
                    if (t <= this._split[i].t) {
                        idx = i;
                        break;
                    }
                }

                var split = this._split[idx];
                var index = split.index;
                var deltaTime = this.getDeltaTime();

                if (this._current !== null && this._current !== index) {
                    var prevAniamtion = this._animations[this._current];
                    prevAniamtion.update(deltaTime);
                    prevAniamtion.stop();
                }

                var currentAnimation = this._animations[index];
                currentAnimation.update(deltaTime);

                if (this.isPastEndOfInterval()) {
                    currentAnimation.stop();
                }

                this._current = index;
            }
        };

        inherit(AnimationSequence, AnimationInterval);

        return AnimationSequence;
    }
);
