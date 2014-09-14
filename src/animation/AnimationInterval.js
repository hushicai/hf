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

        var getGuid = require('../lang/getGuid');

        /**
         * AnimationInterval
         * 
         * @constructor
         */
        function AnimationInterval(timingInput) {
            this.timing = new Timing(timingInput);

            this.guid = getGuid('animation_interval');

            // 开始时间
            this._startTime = 0.0;
            // 已消耗的时间
            this._elapsedTime = 0.0;
            // 动画结束时间
            this._endTime = this._startTime 
                + this.timing.delay 
                + this.timing.getActiveDuration() 
                + this.timing.endDelay;
            this._deltaTime = 0.0;
            this._target = null;
        }

        AnimationInterval.prototype = {
            constructor: AnimationInterval,

            // 总的持续时间
            getInterval: function() {
                return this._endTime;
            },

            getElapsedTime: function() {
                return this._elapsedTime;
            },

            getDeltaTime: function() {
                return this._deltaTime;
            },

            attach: function(animationTarget) {
                this._target = animationTarget;
            },

            stop: function() {
                this._elapsedTime = 0.0;
                this._target = null;

                console.log('stop', this.guid);
            },

            // 更新时间
            update: function(deltaTime) {
                var elapsedTime = this._elapsedTime + deltaTime;
                // 修正
                var activeDuration = this.timing.getActiveDuration();
                var delay = this.timing.delay;

                // 累积时间
                this._elapsedTime = elapsedTime;
                this._deltaTime = deltaTime;

                var animationTime = elapsedTime;

                // 修正时间
                if (animationTime < delay) {
                    animationTime = 0;
                } 
                else if (animationTime < delay + activeDuration) {
                    animationTime = animationTime - delay;
                } 
                else {
                    animationTime = activeDuration;
                }

                // 计算timeFraction
                var duration = this.timing.duration;
                var startOffset = this.timing.iterationStart * duration;
                var adjustedTime = animationTime + startOffset;
                // 是否结束迭代
                var isAtEndOfIterations = (animationTime === activeDuration);
                // 当前迭代次数
                this.currentIteration = isAtEndOfIterations 
                    ? this._floorWithOpenClosedRange(adjustedTime, duration) 
                    : this._floorWithClosedOpenRange(adjustedTime, duration);
                // 单次迭代时间
                var unscaledIterationTime = isAtEndOfIterations 
                    ? this._modulusWithOpenClosedRange(adjustedTime, duration) 
                    : this._modulusWithClosedOpenRange(adjustedTime, duration);
                // 方向
                var iterationTime = this.isCurrentDirectionForwards()
                    ? unscaledIterationTime
                    : duration - unscaledIterationTime;
                var t = iterationTime / duration;
                var timingFunction = this.timing.timingFunction;

                if (timingFunction) {
                    t = timingFunction(t);
                }

                this.step(t);

                return t;
            },

            step: function(t) {
                return t;
            },

            /**
             * 是否结束
             * 
             * @public
             */
            isPastEndOfInterval: function() {
                return this._elapsedTime >= this._endTime;
            },

            /**
             * 播放方向
             * 
             * @public
             */
            isCurrentDirectionForwards: function() {
                var direction = this.timing.direction;
                if (direction === 'normal') {
                    return true;
                }
                if (direction === 'reverse') {
                    return false;
                }
                var d = this.currentIteration;
                if (direction === 'alternate-reverse') {
                    d += 1;
                }
                return d % 2 === 0;
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
            }
        };

        return AnimationInterval;
    }
);
