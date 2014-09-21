/**
 * @file AnimationTime
 * @author hushicai(bluthcy@gmail.com)
 */

define(
    function(require) {
        var getGuid = require('../lang/getGuid');

        /**
         * AnimationTime
         * 
         * @constructor
         */
        function AnimationTime() {
            this._guid = getGuid('animation');
            // 持续时间
            this._duration = 0.0;
            // 开始时间
            this._startTime = 0.0;
            // 已消耗的时间
            this._elapsedTime = 0.0;
            // 动画结束时间
            this._endTime = 0.0;
            this._deltaTime = 0.0;
            this._timeFraction = null;
            this._target = null;
        }

        AnimationTime.prototype = {
            constructor: AnimationTime,

            getElapsedTime: function() {
                return this._elapsedTime;
            },

            getEndTime: function() {
                return this._endTime;
            },

            getDeltaTime: function() {
                return this._deltaTime;
            },

            getTimeFraction: function() {
                return this._timeFraction;
            },

            getDuration: function() {
                return this._duration;
            },

            setDuration: function(duration) {
                this._duration = duration;
            },

            attach: function(animationTarget) {
                this._target = animationTarget;
            },

            stop: function() {
                this._target = null;
                this._elapsedTime = 0.0;
                this._timeFraction = null;
            },

            update: function(deltaTime) { // jshint: ignore line
                // nothing
            },

            step: function(t) { // jshint: ignore line
                // nothing
            }
        };

        return AnimationTime;
    }
);
