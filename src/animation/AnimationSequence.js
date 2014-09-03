/**
 * @file 动画序列
 * @author hushicai(bluthcy@gmail.com)
 */

define(
    function(require) {
        var Promise = require('../promise/index');

        function AnimationSequence(animations) {
            this.animations = animations;
        }

        AnimationSequence.prototype = {
            constructor: AnimationSequence,

            play: function() {
                var animation = this.animations.shift();

                if (animation) {
                    return animation.play().then(this.play.bind(this));
                }
            }
        };

        return AnimationSequence;
    }
);
