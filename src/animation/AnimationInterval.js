/**
 * @file AnimationInterval
 * @author hushicai(bluthcy@gmail.com)
 */

define(
    function(require) {
        var inherit = require('../lang/inherit');
        var AnimationTime = require('./AnimationTime');

        var presetTimingFunctions = require('./easing');

        /**
         * AnimationInterval
         * 
         * @constructor
         */
        function AnimationInterval(timingInput) {
            AnimationTime.call(this);

            this._iterations = timingInput.iterations || 1;
            this._direction = timingInput.direction || 'normal';
            this._delay = timingInput.delay || 0;
            this._endDelay = timingInput.endDelay || 0;
            this._easing = timingInput.easing || 'linear';
            this._duration = timingInput.duration || 500;
            this._activeDuration = this._duration * this._iterations;
            this._endTime = this._startTime 
                + this._delay 
                + this._activeDuration
                + this._endDelay;
            if (typeof this._easing === 'function') {
                this._timingFunction = this._easing;
            }
            else {
                this._timingFunction = presetTimingFunctions[this._easing];
            }
        }

        AnimationInterval.prototype = {
            constructor: AnimationInterval,

            // 更新时间
            update: function(deltaTime) {
                var elapsedTime = this._elapsedTime + deltaTime;
                var activeDuration = this._activeDuration;
                var delay = this._delay;

                this._elapsedTime = elapsedTime;
                this._deltaTime = deltaTime;

                var localTime = elapsedTime;

                // 修正时间
                if (localTime < delay) {
                    localTime = 0;
                } 
                else if (localTime < delay + activeDuration) {
                    localTime = localTime - delay;
                } 
                else {
                    localTime = activeDuration;
                }

                var duration = this._duration;
                var isAtEndOfIterations = (localTime === activeDuration);
                this.currentIteration = isAtEndOfIterations 
                    ? this._floorWithOpenClosedRange(localTime, duration) 
                    : this._floorWithClosedOpenRange(localTime, duration);
                var unscaledIterationTime = isAtEndOfIterations 
                    ? this._modulusWithOpenClosedRange(localTime, duration) 
                    : this._modulusWithClosedOpenRange(localTime, duration);
                var iterationTime = this.isCurrentDirectionForwards()
                    ? unscaledIterationTime
                    : duration - unscaledIterationTime;
                var t = iterationTime / duration;
                var timingFunction = this._timingFunction;

                if (timingFunction) {
                    t = timingFunction(t);
                }

                this._timeFraction = t;

                this.step(t);

                return t;
            },

            /**
             * 是否结束
             * 
             * @public
             */
            isEnded: function() {
                return this._elapsedTime >= this._endTime;
            },

            /**
             * 播放方向
             * 
             * @public
             */
            isCurrentDirectionForwards: function() {
                var direction = this._direction;
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

        inherit(AnimationInterval, AnimationTime);

        return AnimationInterval;
    }
);
