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

            this._origin = null;
        }

        Move.prototype = {
            constructor: Move,

            step: function(t) {
                var animationTarget = this._target;

                // 初始位置
                if (!this._origin) {
                    this._origin = animationTarget.getPosition();
                }
                var origin = this._origin;
                var style = {};

                style.x = origin.x + (this.x - origin.x) * t;
                style.y = origin.y + (this.y - origin.y) * t;

                animationTarget.composite(style);
            }
        };

        inherit(Move, AnimationInterval);

        return Move;
    }
);
