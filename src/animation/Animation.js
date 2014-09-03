/**
 * @file 动画模型
 * @author hushicai(bluthcy@gmail.com)
 */

define(
    function(require) {
        var extend = require('../lang/extend');
        var clock = require('./clock');
        var timeline = require('./timeline');
        var AnimationEffect = require('./AnimationEffect');

        var presetTimingFunctions = require('./easing');

        var defaultTimingInput = {
            duration: 500,
            easing: 'linear'
        };

        function Animation(target, effect, timingInput) {
            this.timing = extend({}, defaultTimingInput, timingInput);
            this.startTime = null;
            this.state = 'playing';
            this.effect = effect;
            this.target = target;
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

                if (typeof this.effect === 'function') {
                    this.effect(this.target, percent);
                }
                else if (this.effect instanceof AnimationEffect) {
                    this.effect.sample(this.target, percent);
                }

                return this;
            },

            play: function() {
                this.startTime = timeline.getCurrentTime();
                timeline.add(this);
                timeline.play();

                var self = this;
                return new Promise(function(resolve, reject) {
                    self._resolver = resolve;
                    self._rejecter = reject
                });
            },

            isFinished: function() {
                if (this.state === 'finished') {
                    this._resolver(this.currentTime);
                    return true;
                }

                return false;
            }
        };

        return Animation;
    }
);
