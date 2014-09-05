/**
 * @file 动画模型
 * @author hushicai(bluthcy@gmail.com)
 */

define(
    function(require) {
        var curry = require('../lang/curry');
        var extend = require('../lang/extend');
        var timeline = require('./timeline');
        var AnimationEffect = require('./AnimationEffect');
        var KeyframeEffect = require('./KeyframeEffect');

        var presetTimingFunctions = require('./easing');

        var defaultTimingInput = {
            duration: 500,
            easing: 'linear',
            iterations: 1
        };

        function Animation(target, effect, timingInput) {
            this.timing = extend({}, defaultTimingInput, timingInput);
            this.startTime = null;
            this.currentTime = null;
            this.currentIteration = 0;
            this.state = 'init';
            this.target = target;

            if (typeof effect === 'function') {
                this.effect = {
                    sample: effect
                };
            }
            else if (effect instanceof AnimationEffect) {
                this.effect = effect;
            }
            else {
                this.effect = new KeyframeEffect(target, effect);
            }
        }

        Animation.prototype = {
            constructor: Animation,

            update: function() {
                if (this.startTime === null) {
                    return;
                }

                var nowTime = timeline.getCurrentTime();
                var spentTime = nowTime - this.startTime;
                var duration = this.timing.duration;

                this.currentTime = nowTime;

                var percent  = spentTime / duration;
                if (percent > 1) {
                    this.state = 'finished';
                    percent = 1;
                }

                var easing = this.timing.easing;
                var timingFunction;
                if (typeof easing === 'function') {
                    timingFunction = easing;
                }
                else {
                    timingFunction = presetTimingFunctions[this.timing.easing];
                }
                
                if (timingFunction) {
                    percent = timingFunction(percent);
                }

                this.effect.sample(percent);

                return this;
            },

            updateMarker: function() {
                this.state = 'playing';
                this.startTime = timeline.getCurrentTime();
                this.currentIteration++;
            },

            play: function() {
                if (this.state === 'playing') {
                    return;
                }

                this.updateMarker();
                timeline.add(this);
                timeline.play();

                var self = this;
                return new Promise(function(resolve, reject) {
                    self._resolver = resolve;
                    self._rejecter = reject
                });
            },

            /**
             * 是否结束
             * 
             * @public
             */
            isFinished: function() {
                // 上一轮动画已播放完成
                if (this.state === 'finished') {
                    // 如果迭代次数还未到，则继续播放
                    if (this.currentIteration < this.timing.iterations) {
                        // 重新开始
                        this.updateMarker();
                        return false;
                    }

                    this._resolver(this.currentTime);
                    return true;
                }

                return false;
            }
        };

        return Animation;
    }
);
