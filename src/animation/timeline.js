/**
 * @file timeline
 * @author hushicai(bluthcy@gmail.com)
 */

define(
    function(require) {
        var clock = require('./clock');

        var timeline = {
            players: [],
            startTime: clock.getZeroTime(),

            /**
             * 添加播放器
             * 
             * @public
             */
            add: function(player) {
                this.players.push(player);
                return this;
            },

            /**
             * 删除播放器
             * 
             * @public
             */
            remove: function(player) {
                var idx = require('../lang/array').indexOf(this.players, player);
                this.players.splice(idx, 1);
                return this;
            },

            /**
             * 获取timeline当前时间
             * 
             * @public
             */
            getCurrentTime: function() {
                return clock.relativeTime(clock.clockMillis(), this.startTime);
            },

            /**
             * 尝试播放
             * 
             * @public
             */
            play: function() {
                return clock.tryStart();
            }
        };

        function tickHandler(rafTime) {
            var finished = true;
            var players = timeline.players;
            var finishedPlayers = [];
            var animations = [];

            // 更新player时间
            for (var i = 0, len = players.length; i < len; i++) {
                var player = players[i];
                player._update();
                
                var isFinished = player.isFinished();
                finished = finished && isFinished;
                if (isFinished) {
                    finishedPlayers.push(player);
                }
                player._getAnimationInEffect(animations);
            }

            // 执行每个动画
            for (var i = 0; i < animations.length; i++) {
                animations[i]._sample();
            }

            for (var i = 0, len = players.length; i < len; i++) {
                player._generateEvents();
            }

            // 删除播放完成的动画
            for (var i = 0, len = finishedPlayers.length; i < len; i++) {
                var player = finishedPlayers[i];
                player._deregisterFromTimeline();
            }

            // 更新样式
            require('./compositor').applyAnimatedValues();

            return finished;
        }

        clock.start(tickHandler);

        return timeline;
    }
);
