/**
 * @file AnimationTarget
 * @author hushicai(bluthcy@gmail.com)
 */

// 可以执行动画的元素，可以有多种不同类型：
// * dom元素
// * canvas中的精灵
// * ...

define(
    function(require) {
        var timeline = require('./timeline');

        function AnimationTarget(node) {
            this._node = node;
            this._animation = null;
        }

        AnimationTarget.prototype = {
            constructor: AnimationTarget,

            update: function(deltaTime) {
                // 计算时间
                this._animation.update(deltaTime);
            },

            getPropertyValue: function(prop) {},

            // 应用样式
            composite: function(styles) {
                return styles;
            },

            // 开始播放
            /**
             * 播放动画
             * 
             * @public
             * @param {AnimationInterval} animation 
             */
            run: function(animation) {
                this._animation = animation;

                this._animation.attach(this);

                timeline.scheduler.schedule(this);
                timeline.tryPlay();

                return this;
            },

            // 播放完成
            complete: function() {
                this._animation.stop();
            },

            isFinished: function() {
                return this._animation.isEnded();
            }
        };

        return AnimationTarget;
    }
);
