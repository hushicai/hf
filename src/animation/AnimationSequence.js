/**
 * @file AnimationSequence
 * @author hushicai(bluthcy@gmail.com)
 */

define(
    function(require) {
        var extend = require('../lang/extend');
        var bind = require('../lang/bind');

        /**
         * AnimationSequence
         * @param {Array.<Animation>} animations 
         * @param {Object} options 
         * @param {string} options.direction 
         * @param {number} options.iterations 
         * 
         * @constructor
         */
        function AnimationSequence(animations, options) {
            this.animations = animations;

            extend(this, options);

            this.iterations = this.iterations || 1;
            this.currentIteration = 0;
            this.direction = this.direction || 'normal';
            this.index = 0;
            this.total = this.animations.length;
        }

        AnimationSequence.prototype = {
            constructor: AnimationSequence,

            play: function() {
                var animation = this.next();

                if (animation) {
                    animation.play().promise.then(bind(this.play, this));
                }

                return this;
            },
        
            /**
             * 获取下一个animation
             * 
             * @public
             */
            next: function() {
                var direction = this.direction;

                switch (direction) {
                    case 'normal':
                        break;
                    case 'alternate':
                        break;
                    default:
                }

                if (this.index < this.total) {
                    return this.animations[this.index++];
                }

                return null;
            }
        };

        return AnimationSequence;
    }
);
