/**
 * @file Animation Model
 * @author hushicai(bluthcy@gmail.com)
 */

define(
    function(require) {
        var extend = require('../lang/extend');
        var helper = require('./helper');
        var AnimationEffect = require('./AnimationEffect');
        var KeyframeEffect = require('./KeyframeEffect');
        var AnimationPlayer = require('./AnimationPlayer');
        var timeline = require('./timeline');

        var multiplyZeroGivesZero = function(a, b) {
            return (a === 0 || b === 0) ? 0 : a * b;
        };

        var presetTimingFunctions = require('./easing');

        var defaultTimingInput = {
            duration: 500,
            easing: 'linear',
            iterations: 1,
            delay: 0,
            endDelay: 0,
            iterationStart: 0,
            direction: 'normal'
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
                return new KeyframeEffect(target, animationEffect);
            }
            return null;
        }


        var Animation = function(target, animationEffect, timingInput) {
            this.timing = new Timing(timingInput);

            this._inheritedTime = null;
            this._iterationTime = null;
            this._animationTime = null;
            this._player = null;

            this.effect = interpretAnimationEffect(animationEffect, target);
            this.currentIteration = null;
            this.target = target;
            this.startTime = 0.0;
            this.localTime = null;
            this.endTime = this.startTime 
                + this.timing.getActiveDuration() 
                + this.timing.delay 
                + this.timing.endDelay;

            this._updateTimeMarkers();
        };

        Animation.prototype = {
            constructor: Animation,

            play: function() {
                return this._player = new AnimationPlayer(this);
            },

            _sample: function() {
                if (helper.isDefinedAndNotNull(this.effect)) {
                    this.effect.sample(this._timeFraction);
                }
            },

            // 接收player的时间
            // 更新animation的时间
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
                var adjustedAnimationTime = this._getAdjustedAnimationTime(this._animationTime);
                var activeDuration = this.timing.getActiveDuration();
                var startOffset = this.timing.iterationStart * this.timing.duration;
                var isAtEndOfIterations = (this.timing.iterations !== 0) 
                    && ((adjustedAnimationTime - startOffset) === activeDuration);
                this.currentIteration = isAtEndOfIterations 
                    ? this._floorWithOpenClosedRange(adjustedAnimationTime, this.timing.duration) 
                    : this._floorWithClosedOpenRange(adjustedAnimationTime, this.timing.duration);
                var unscaledIterationTime = isAtEndOfIterations 
                    ? this._modulusWithOpenClosedRange(adjustedAnimationTime, this.timing.duration) 
                    : this._modulusWithClosedOpenRange(adjustedAnimationTime, this.timing.duration);
                this._iterationTime = this._scaleIterationTime(unscaledIterationTime);

                this._timeFraction = this._iterationTime / this.timing.duration;
                var timingFunction = this.timing.timingFunction;

                if (timingFunction) {
                    this._timeFraction = timingFunction(this._timeFraction);
                }
                this._iterationTime = this._timeFraction * this.timing.duration;
            },

            _getInEffect: function(items) {
                if (this._timeFraction !== null) {
                    items.push(this);
                }
            },

            _getAdjustedAnimationTime: function(animationTime) {
                var startOffset = multiplyZeroGivesZero(this.timing.iterationStart, this.timing.duration);
                return animationTime + startOffset;
            },

            _scaleIterationTime: function(unscaledIterationTime) {
                return this._isCurrentDirectionForwards() 
                    ? unscaledIterationTime 
                    : this.timing.duration - unscaledIterationTime;
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

            _isPastEndOfActiveInterval: function() {
                return this._inheritedTime >= this.endTime;
            }
        };

        return Animation;
    }
);
