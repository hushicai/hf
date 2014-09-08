/**
 * @file AnimationPlayer
 * @author hushicai(bluthcy@gmail.com)
 */

define(
    function(require) {
        var timeline = require('./timeline');

        var playerSequenceNumber = 0;

        function AnimationPlayer(animation) {
            this._registeredOnTimeline = false;
            this._sequenceNumber = playerSequenceNumber++;
            // 播放器开始的时间
            // 相对于timeline
            this._startTime = timeline.getCurrentTime();
            this._finishedFlag = false;
            this._animation = animation;

            // 播放器的时间
            // 相对于播放器本身
            this.currentTime = 0.0;
            this._registerOnTimeline();

            // 生成一个promise
            var self = this;
            this.promise = new Promise(function(resolve, reject) {
                self._resolver = resolve;
                self._rejecter = reject;
            });

            timeline.play();
        }

        AnimationPlayer.prototype = {
            constructor: AnimationPlayer,

            // 获取播放器当前时间
            getCurrentTime: function() {
                this.currentTime = timeline.getCurrentTime() - this._startTime;

                return this.currentTime;
            },

            // 暂时不实现
            cancel: function() {},
            play: function() {},
            pause: function() {},
            reverse: function() {},

            _update: function() {
                if (this._animation !== null) {
                    this._animation._updateInheritedTime(this.getCurrentTime());
                }
            },
            _getAnimationInEffect: function(items) {
                if (this._animation) {
                    this._animation._getInEffect(items);
                }
            },

            /**
             * 是否播放结束
             * 
             * @public
             */
            isFinished: function() {
                return this._animation === null || this._animation._isPastEndOfActiveInterval();
            },

            _generateEvents: function() {
                var finished = this.isFinished();
                if (!this._finishedFlag 
                    && finished
                ) {
                    var currentTime = this.getCurrentTime();
                    this.emit('finish', {
                        currentTime: currentTime,
                        timelineTime: timeline.getCurrentTime()
                    });

                    this._resolver(currentTime);
                }

                this._finishedFlag = finished;
            },

            _registerOnTimeline: function() {
                if (!this._registeredOnTimeline) {
                    timeline.add(this);
                    this._registeredOnTimeline = true;
                }
            },
            _deregisterFromTimeline: function() {
                timeline.remove(this);
                this._registeredOnTimeline = false;
            }
        };

        require('../event/Emitter').mixin(AnimationPlayer.prototype);

        return AnimationPlayer;
    }
);
