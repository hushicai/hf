/**
 * @file Scheduler
 * @author hushicai(bluthcy@gmail.com)
 */

// 在每个tick中规划时间
// 规划Timer？
// 规划target？
// ...

define(
    function(require) {
        function Scheduler() {
            this._targets = [];
        }

        Scheduler.prototype = {
            constructor: Scheduler,

            // 规划一下时间
            // 是否结束?
            // 是否暂停？
            // ...
            update: function(deltaTime) {
                var targets = this._targets;
                var finishTargets = [];
                var finished = false;

                for (var i = 0, len = targets.length; i < len; i++) {
                    var target = targets[i];
                    // TODO: target有可能是一个函数？
                    target.update(deltaTime);
                    
                    var isFinished = target.isFinished();

                    if (isFinished) {
                        finishTargets.push(target);
                    }

                    finished = !finished && isFinished;
                }

                for (var i = 0, len = finishTargets.length; i < len; i++) {
                    var finishTarget = finishTargets[i];
                    finishTarget.complete();
                    this.unschedule(finishTarget);
                }

                return finished;
            },

            schedule: function(target, interval) {
                this._targets.push(target);
            },

            unschedule: function(target) {
                var idx = this._targets.indexOf(target);
                this._targets.splice(idx, 1);
            }
        };

        return Scheduler;
    }
);
