/**
 * @file timeline
 * @author hushicai(bluthcy@gmail.com)
 */

define(
    function(require) {
        var clock = require('./clock');
        // 动画集合
        var animations = [];

        var timeline = {
            startTime: clock.getZeroTime(),
            add: function(animation) {
                animations.push(animation);

                return this;
            },

            remove: function(animation) {
                var idx = require('../lang/array').indexOf(animations, animation);
                animations.splice(idx, 1);

                return this;
            },

            getCurrentTime: function() {
                return clock.relativeTime(clock.clockMillis(), this.startTime);
            },

            play: function() {
                return clock.tryStart();
            }
        };

        function tickHandler(rafTime) {
            var finished = true;
            var finishAnimations = [];
            for (var i = 0, len = animations.length; i < len; i++) {
                var animation = animations[i];

                // 更新
                animation.update();

                var isFinished = animation.isFinished();

                if (isFinished) {
                    finishAnimations.push(animation);
                }

                finished = finished && isFinished;
            }

            // 删除结束的animation
            for (var i = 0, len = finishAnimations; i < len; i++) {
                var animation = finishAnimations[i];

                timeline.remove(animation);
            }

            return finished;
        }

        clock.start(tickHandler);

        return timeline;
    }
);
