/**
 * @file AnimationInterval
 * @author hushicai(bluthcy@gmail.com)
 */

// 持续时间

define(
    function(require) {
        var extend = require('../lang/extend');
        var timeline = require('./timeline');

        var presetTimingFunctions = require('./easing');

        var defaultTimingInput = {
            duration: 500,
            easing: 'linear',
            iterations: 1,
            delay: 0,
            endDelay: 0,
            iterationStart: 0,
            direction: 'normal',
            // TODO: 添加播放速度支持
            speed: 1.0
        };

        /**
         * 时间配置
         * 
         * @constructor
         */
        function Timing(timingInput) {
            extend(this, defaultTimingInput, timingInput);

            var timingFunction;
            if (typeof this.easing === 'function') {
                timingFunction = this.easing;
            }
            else {
                timingFunction = presetTimingFunctions[this.easing];
            }
            this.timingFunction = timingFunction;
        }

        Timing.prototype = {
            constructor: Timing,

            getActiveDuration: function() {
                return this.duration * this.iterations;
            }
        };

        /**
         * AnimationInterval
         * 
         * @constructor
         */
        function AnimationInterval(timingInput) {
            this.timing = new Timing(timingInput);

            // 开始时间
            this._startTime = 0.0;
            // 已消耗的时间
            this._elapsedTime = 0.0;
            // 动画结束时间
            this._endTime = this._startTime 
                + this.timing.delay 
                + this.timing.getActiveDuration() 
                + this.timing.endDelay;
            // 时间片段
            this._timeFraction = null;
        }

        AnimationInterval.prototype = {
            constructor: AnimationInterval,

            // 更新时间
            updateTime: function(deltaTime) {
                // 累加
                var elapsedTime = this._elapsedTime + deltaTime;
                // 修正
                var activeDuration = this.timing.getActiveDuration();
                var delay = this.timing.delay;

                if (elapsedTime < delay) {
                    elapsedTime = 0;
                } 
                else if (elapsedTime < delay + activeDuration) {
                    elapsedTime = elapsedTime - delay;
                } 
                else {
                    elapsedTime = activeDuration;
                }

                // 计算timeFraction
                var duration = this.timing.duration;
                var startOffset = this.timing.iterationStart * duration;
                var adjustedTime = elapsedTime + startOffset;
                // 是否结束迭代
                var isAtEndOfIterations = (elapsedTime === activeDuration);
                // 当前迭代次数
                this.currentIteration = isAtEndOfIterations 
                    ? this._floorWithOpenClosedRange(adjustedTime, duration) 
                    : this._floorWithClosedOpenRange(adjustedTime, duration);
                // 单次迭代时间
                var unscaledIterationTime = isAtEndOfIterations 
                    ? this._modulusWithOpenClosedRange(adjustedTime, duration) 
                    : this._modulusWithClosedOpenRange(adjustedTime, duration);
                // 方向
                var iterationTime = this._isCurrentDirectionForwards()
                    ? unscaledIterationTime
                    : duration - unscaledIterationTime;
                var t = iterationTime / duration;
                var timingFunction = this.timing.timingFunction;

                if (timingFunction) {
                    t = timingFunction(t);
                }

                // 更新数据
                this._elapsedTime = elapsedTime;
                this._timeFraction = t;

                return t;
            },

            step: function(animationTarget) {
                return animationTarget;
            },

            /**
             * 是否结束
             * 
             * @public
             */
            isPastEndOfInterval: function() {
                return this._elapsedTime >= this._endTime;
            },

            _floorWithClosedOpenRange: function(x, range) {
                return Math.floor(x / range);
            },

            _floorWithOpenClosedRange: function(x, range) {
                return Math.ceil(x / range) - 1;
            },

            _modulusWithClosedOpenRange: function(x, range) {
                var modulus = x % range;
                var result = modulus < 0 ? modulus + range : modulus;
                return result;
            },

            _modulusWithOpenClosedRange: function(x, range) {
                var modulus = this._modulusWithClosedOpenRange(x, range);
                var result = modulus === 0 ? range : modulus;
                return result;
            },

            /**
             * 播放方向
             * 
             * @private
             */
            _isCurrentDirectionForwards: function() {
                if (this.timing.direction === 'normal') {
                    return true;
                }
                if (this.timing.direction === 'reverse') {
                    return false;
                }
                var d = this.currentIteration;
                if (this.timing.direction === 'alternate-reverse') {
                    d += 1;
                }
                return d % 2 === 0;
            }
        };

        return AnimationInterval;
    }
);
