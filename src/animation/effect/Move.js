/**
 * @file Move
 * @author hushicai(bluthcy@gmail.com)
 */

define(
    function(require) {
        var inherit = require('../../lang/inherit');
        var extend = require('../../lang/extend');
        var AnimationInterval = require('../AnimationInterval');

        // 输入：
        // ```javascript
        //    {x: 100, y: 100}
        // ```
        function Move(moveInput, timingInput) {
            AnimationInterval.call(this, timingInput);

            extend(this, moveInput);

            this._startX = null;
            this._startY = null;

            this._origin = null;
        }

        Move.prototype = {
            constructor: Move,

            step: function(t) {
                var animationTarget = this._target;

                // 初始位置
                if (!this._startX || !this._startY) {
                    this._startX = animationTarget.getPropertyValue('x');
                    this._startY = animationTarget.getPropertyValue('y');
                }
                var style = {};

                style.x = this._startX + (this.x - this._startX) * t;
                style.y = this._startY + (this.y - this._startY) * t;

                animationTarget.composite(style);
            }
        };

        inherit(Move, AnimationInterval);

        return Move;
    }
);
