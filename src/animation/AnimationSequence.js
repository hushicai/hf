/**
 * @file AnimationSequence
 * @author hushicai(bluthcy@gmail.com)
 */

define(
    function(require) {
        var inherit = require('../lang/inherit');
        var AnimationInterval = require('./AnimationInterval');
        var AnimationInstant = require('./AnimationInstant')

        function AnimationSequence(animations, timingInput) {
            timingInput = timingInput || {};
            var duration = 0;
            for (var i = 0, len = animations.length; i < len; i++) {
                duration += animations[i].getEndTime();
            }
            timingInput.duration = duration;

            // 父类
            AnimationInterval.call(this, timingInput);

            // 计算分割点
            var split = [];
            var temp = 0;
            for (var i = 0, len = animations.length; i < len; i++) {
                var animation = animations[i];
                var time = animation.getEndTime();
                if (time === 0) {
                    continue;
                }
                temp += time;
                split.push({
                    t: temp / duration,
                    index: i,
                    time: time
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

                if (this._current !== index) {
                    var prevAniamtion = this._animations[this._current];
                    if (prevAniamtion) {
                        prevAniamtion.update(deltaTime);
                        prevAniamtion.stop();
                    }
                    this._runInstant(this._current, index);
                }

                var currentAnimation = this._animations[index];
                // 如果是第一次执行，绑定target？
                currentAnimation.update(deltaTime);

                if (this.isEnded()) {
                    currentAnimation.stop();

                    this._runInstant(this._current);
                }

                this._current = index;
            },

            _runInstant: function(start, end) {
                var animations = this._animations;
                var len = animations.length;
                var factor;

                if (this.isCurrentDirectionForwards()) {
                    start = start === null ? 0 : start;
                    end = end === undefined ? len - 1 : end;
                }
                else {
                    start = start === null ? len - 1 : start;
                    end = end === undefined ? 0 : end;
                    // 交换一下start、end
                    var temp = start;
                    start = end;
                    end = temp;
                }

                for (var i = start; i <= end; i++) {
                    var temp = animations[i];
                    if (temp instanceof AnimationInstant) {
                        temp.update();
                        temp.stop();
                    }
                }
            }
        };

        inherit(AnimationSequence, AnimationInterval);

        return AnimationSequence;
    }
);
