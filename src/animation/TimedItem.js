/**
 * @file TimedItem
 * @author hushicai(bluthcy@gmail.com)
 */

define(
    function(require) {
        var extend = require('../lang/extend');
        var timeline = require('./timeline');
        var helper = require('./helper');
        var AnimationPlayer = require('./AnimationPlayer');

        var abstractMethod = helper.abstractMethod;

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
            fill: 'forwards',
            iterationStart: 0,
            direction: 'normal'
        };

        function Timing(timingInput) {
            extend(this, defaultTimingInput, timingInput);

            this.fill = this.fill === 'auto'
                ? 'none'
                : this.fill;

            var timingFunction;
            if (typeof this.easing === 'function') {
                timingFunction = this.easing;
            }
            else {
                timingFunction = presetTimingFunctions[this.easing];
            }
            this.timingFunction = timingFunction;
        }

        function TimedItem(timingInput) {
            this.timing = new Timing(timingInput);
            this.currentIteration = null;
            this._inheritedTime = null;
            this._iterationTime = null;
            this._animationTime = null;
            this._player = null;
            this._startTime = 0.0;
            this._updateTimeMarkers();
        };

        TimedItem.prototype = {
            get localTime() {
                return this._inheritedTime === null ? null : this._inheritedTime - this._startTime;
            },
            get activeDuration() {
                return this.timing.duration * this.timing.iterations;
            },
            get endTime() {
                return this._startTime + this.activeDuration + this.timing.delay + this.timing.endDelay;
            },
            _updateInheritedTime: function(inheritedTime) {
                this._inheritedTime = inheritedTime;
                this._updateTimeMarkers();
            },
            _updateAnimationTime: function() {
                if (this.localTime < this.timing.delay) {
                    if (this.timing.fill === 'backwards' || this.timing.fill === 'both') {
                        this._animationTime = 0;
                    } 
                    else {
                        this._animationTime = null;
                    }
                } 
                else if (this.localTime < this.timing.delay + this.activeDuration) {
                    this._animationTime = this.localTime - this.timing.delay;
                } 
                else {
                    if (this.timing.fill === 'forwards' || this.timing.fill === 'both') {
                        this._animationTime = this.activeDuration;
                    } 
                    else {
                        this._animationTime = null;
                    }
                }
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
            _updateIterationParams: function() {
                var adjustedAnimationTime = this._getAdjustedAnimationTime(this._animationTime);
                var repeatedDuration = this.activeDuration;
                var startOffset = this.timing.iterationStart * this.timing.duration;
                var isAtEndOfIterations = (this.timing.iterations !== 0) 
                    && (adjustedAnimationTime - startOffset === repeatedDuration);
                this.currentIteration = isAtEndOfIterations 
                    ? this._floorWithOpenClosedRange(adjustedAnimationTime, this.timing.duration) 
                    : this._floorWithClosedOpenRange(adjustedAnimationTime, this.timing.duration);
                var unscaledIterationTime = isAtEndOfIterations 
                    ? this._modulusWithOpenClosedRange(adjustedAnimationTime, this.timing.duration) 
                    : this._modulusWithClosedOpenRange(adjustedAnimationTime, this.timing.duration);
                this._iterationTime = this._scaleIterationTime(unscaledIterationTime);
                if (this.timing.duration == Infinity) {
                    this._timeFraction = 0;
                    return;
                }
                this._timeFraction = this._iterationTime / this.timing.duration;
                var timingFunction = this.timing.timingFunction;
                if (timingFunction) {
                    this._timeFraction = timingFunction(this._timeFraction);
                }
                this._iterationTime = this._timeFraction * this.timing.duration;
            },
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

            _hasFutureAnimation: function(timeDirectionForwards) {
                return timeDirectionForwards 
                    ? this._inheritedTime < this.endTime 
                    : this._inheritedTime > this._startTime;
            },

            _isPastEndOfActiveInterval: function() {
                return this._inheritedTime >= this.endTime;
            },
            _isCurrent: function() {
                return !this._isPastEndOfActiveInterval();
            },
            _hasFutureEffect: function() {
                return this._isCurrent() || this.timing.fill !== 'none';
            }
        };

        return TimedItem;
    }
);
