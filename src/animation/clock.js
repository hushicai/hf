/**
 * @file 全局时钟
 * @author hushicai(bluthcy@gmail.com)
 */

define(
    function(require) {
        function clockMillis() {
            return +new Date();
        }

        var nativeRaf = window.requestAnimationFrame 
            || window.webkitRequestAnimationFrame 
            || window.mozRequestAnimationFrame;

        var raf;

        if (nativeRaf) {
            raf = function(callback) {
                nativeRaf(function() {
                    callback(clockMillis());
                });
            };
        } else {
            raf = function(callback) {
                setTimeout(function() {
                    callback(clockMillis());
                }, 1000 / 60);
            };
        }

        var timeZeroAsRafTime;
        var timeZeroAsClockTime = clockMillis();

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

        raf(function(rafTime) {
            timeZeroAsRafTime = rafTime;
        });

        var clock = {
            start: function(tickHandler) {
                this.tick = tickHandler;
            },
            // 尝试重启时钟
            tryStart: function() {
                if (rafScheduled) {
                    return;
                }
                raf(ticker);
                rafScheduled = true;
            },

            clockMillis: clockMillis,

            // 零点
            getZeroTime: function() {
                return timeZeroAsClockTime;
            },

            // 相对零点时间
            relativeTime: function(time, zeroTime) {
                return time - zeroTime;
            }
        };

        return clock;
    }
);
