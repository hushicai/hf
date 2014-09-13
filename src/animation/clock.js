/**
 * @file 全局时钟
 * @author hushicai(bluthcy@gmail.com)
 */

// 动画主循环

define(
    function(require) {
        function now() {
            return +new Date();
        }

        var nativeRaf = window.requestAnimationFrame 
            || window.webkitRequestAnimationFrame 
            || window.mozRequestAnimationFrame;

        var raf;

        if (nativeRaf) {
            raf = function(callback) {
                nativeRaf(function() {
                    callback(now());
                });
            };
        } else {
            raf = function(callback) {
                setTimeout(function() {
                    callback(now());
                }, 1000 / 60);
            };
        }

        var timeZeroAsRafTime;
        var timeZeroAsClockTime = now();

        var rafScheduled = false;
        var ticker = function(rafTime) {
            if (!timeZeroAsRafTime) {
                raf(ticker);
                return;
            }

            var isFinished = clock.tick(rafTime);

            if (isFinished) {
                rafScheduled = false;
            } 
            else {
                raf(ticker);
            }
        };

        var clock = {
            start: function(tickHandler) {
                this.tick = tickHandler;

                raf(function(rafTime) {
                    timeZeroAsRafTime = rafTime;
                });
            },
            // 尝试重启时钟
            tryStart: function() {
                if (rafScheduled) {
                    return;
                }
                raf(ticker);
                rafScheduled = true;
            },

            // 当前时间
            now: now,

            // 零点
            getZeroTime: function() {
                return timeZeroAsClockTime;
            }
        };

        return clock;
    }
);
