/**
 * @file 动画主循环
 * @author hushicai02
 */

 define(
     function(require) {
         var array = require('../lang/array');

         // 这个存在一定的问题，比如不能控制帧率
         var raf = window.requestAnimationFrame
            || window.webkitRequestAnimationFrame
            || window.mozRequestAnimationFrame
            || window.oRequestAnimationFrame
            || window.msRequestAnimationFame
            || function(callback) {
                return setTimeout(callback, 1000 / 60);
            };

        var running = false;
        var ticks = [];

        // 动画主循环，它应该是一个单例，一个页面上最多只有一个主循环
        return {
            // 添加一个动画渲染函数
            // 在这里把它称之为tick，每个动画都会有一个需要重复执行的tick
            // 而我们把tick添加到这里来，是为了让动画主循环控制它循环执行
            // 不同动画的tick在每一个频幕刷新时刻都会同等地执行
            add: function(tick) {
                ticks.push(tick);
            },
            // 删除一个tick
            remove: function(tick) {
                var idx = array.indexOf(tick, ticks);

                if (idx >= 0) {
                    ticks.splice(idx, 1);
                }
            },
            // 在每一个屏幕刷新时刻执行一遍所有tick
            // 对于已经执行完毕的动画，应该把tick删除
            flush: function() {
                for(var i = 0, len = ticks.length; i < len; i++) {
                    // 获取返回结果，根据返回结果判断该tick动画是否已经结束
                    // 如果已经结束，删除它
                    var state = ticks[i]();

                    // 删除它
                    if (state === false) {
                        ticks.splice(i, 1);
                    }
                }

                // 如果ticks数组为空
                if (ticks.length === 0) {
                    this.stop();
                }
            },
            // 开启一个动画主循环
            start: function() {
                var _this = this;

                running = true;

                function _loop() {
                    if (running) {
                        // 对于60HZ的屏幕刷新频率来说，如果flush函数不能在16.7ms之内执行完毕
                        // 下一个requestAnimationFrame就会延迟调用
                        // 也就是说在下一个屏幕刷新时刻到来之前，requestAnimationFrame得不到调用
                        // 既然我们还没向浏览器发出requestAnimationFrame请求，那当然浏览器也不会在该时刻调用_loop方法，
                        // 也就是说在这一次屏幕刷新点中，没有再次调用flush更新动画状态，动画的渲染错过了这一帧
                        // 这就造成了所谓的动画卡顿，动画产生了延迟，如果延迟的时间特别长，卡顿就很明显了
                        // 所以这个flush方法是一个潜在的优化点，我们必须保证flush中的代码运行时间不能超过16.7ms
                        _this.flush();
                        raf(_loop);
                    }
                }
                // 在屏幕刷新时刻被调用
                raf(_loop);
            },
            // 结束主循环
            stop: function() {
                running = false;
            }
        };
     }
 );
