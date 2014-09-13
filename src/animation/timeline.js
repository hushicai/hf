/**
 * @file timeline
 * @author hushicai(bluthcy@gmail.com)
 */

define(
    function(require) {
        var clock = require('./clock');
        var Scheduler = require('./Scheduler');

        var zeroTime = clock.getZeroTime();
        // 上一次更新时间
        var lastUpdateTime  = clock.now();
        // 每个tick之间的时间差
        var deltaTime = 0.0;

        // 时间轴
        var timeline = {
            scheduler: new Scheduler(),

            calculateDeltaTime: function() {
                var now = clock.now();

                deltaTime = now - lastUpdateTime;
                lastUpdateTime = now;

                // 为啥要判断0.2呢？
                // 1 / 60又是啥？

                return deltaTime;
            },

            /**
             * 获取timeline当前时间
             * 
             * @public
             */
            getCurrentTime: function() {
                return clock.relativeTime(clock.now(), zeroTime);
            },

            /**
             * 尝试播放
             * 
             * @public
             */
            tryPlay: function() {
                return clock.tryStart();
            }
        };

        // 每个tick都更新
        function tickHandler(rafTime) {
            // 计算时间差
            timeline.calculateDeltaTime();
            var finished = timeline.scheduler.update(deltaTime);

            return finished;
        }

        clock.start(tickHandler);

        return timeline;
    }
);
