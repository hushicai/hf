/**
 * @file AnimationInterval
 * @author hushicai(bluthcy@gmail.com)
 */

// 将一段duration拆成一个个interval

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

            // player的时间
            this._inheritedTime = null;
            // 单次迭代时间
            this._iterationTime = null;
            // 动画时间
            this._animationTime = null;
            this._player = null;

            this.currentIteration = null;
            this.startTime = 0.0;
            // 动画播放时间
            this.localTime = null;
            // 动画结束时间
            this.endTime = this.startTime 
                + this.timing.delay 
                + this.timing.getActiveDuration() 
                + this.timing.endDelay;

            this._updateTimeMarkers();
        }

        AnimationInterval.prototype = {
            constructor: AnimationInterval,

            _sample: function() {
                return null;
            },

            _updateInheritedTime: function(inheritedTime) {
                this._inheritedTime = inheritedTime;
                this.localTime = inheritedTime === null ? null : (inheritedTime - this.startTime);
                this._updateTimeMarkers();
            },

            /**
             * 更新所有时间标志
             * 
             * @private
             */
            _updateTimeMarkers: function() {
                if (this.localTime === null) {
                    this._animationTime = null;
                    this._iterationTime = null;
                    this.currentIteration = null;
                    this._timeFraction = null;
                    return false;
                }
                this._updateAnimationTime();
                if (this._animationTime === null) {
                    this._iterationTime = null;
                    this.currentIteration = null;
                    this._timeFraction = null;
                } 
                else {
                    this._updateIterationParams();
                }
                timeline.play();
            },

            /**
             * 更新动画时间
             * 
             * @private
             */
            _updateAnimationTime: function() {
                var activeDuration = this.timing.getActiveDuration();
                if (this.localTime < this.timing.delay) {
                    this._animationTime = 0;
                } 
                else if (this.localTime < this.timing.delay + activeDuration) {
                    this._animationTime = this.localTime - this.timing.delay;
                } 
                else {
                    this._animationTime = activeDuration;
                }
            },

            /**
             * 计算时间片段
             * 
             * @private
             */
            _updateIterationParams: function() {
                var activeDuration = this.timing.getActiveDuration();

                var startOffset = this.timing.iterationStart * this.timing.duration;
                var adjustedAnimationTime = this._animationTime + startOffset;
                // 是否结束迭代
                var isAtEndOfIterations = (this.timing.iterations !== 0) && (this._animationTime === activeDuration);

                // 当前迭代次数
                this.currentIteration = isAtEndOfIterations 
                    ? this._floorWithOpenClosedRange(adjustedAnimationTime, this.timing.duration) 
                    : this._floorWithClosedOpenRange(adjustedAnimationTime, this.timing.duration);

                // 单次迭代时间
                var unscaledIterationTime = isAtEndOfIterations 
                    ? this._modulusWithOpenClosedRange(adjustedAnimationTime, this.timing.duration) 
                    : this._modulusWithClosedOpenRange(adjustedAnimationTime, this.timing.duration);

                // 设置方向
                this._iterationTime = this._isCurrentDirectionForwards()
                    ? unscaledIterationTime
                    : this.timing.duration - unscaledIterationTime;
                
                this._timeFraction = this._iterationTime / this.timing.duration;
                var timingFunction = this.timing.timingFunction;

                if (timingFunction) {
                    this._timeFraction = timingFunction(this._timeFraction);
                }
                this._iterationTime = this._timeFraction * this.timing.duration;
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
            },

            /**
             * 时间是否已结束
             * 
             * @private
             */
            _isPastEndOfActiveInterval: function() {
                return this._inheritedTime >= this.endTime;
            }
        };

        return AnimationInterval;
    }
);
