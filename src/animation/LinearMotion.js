/**
 * @file x、y方向上的线性运动
 * @author hushicai(bluthcy@gmail.com)
 */

define(
    function(require) {
        "use strict";

        var inherit = require('../lang/inherit');
        var Motion = require('./Motion');

        // 输入：
        // ```javascript
        //    {x: 100, y: 100}
        // ```
        function LinearMotion(motionInput, timingInput) {
            Motion.apply(this, arguments);

            this._origin = null;
        }

        LinearMotion.prototype = {
            constructor: LinearMotion,

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

        inherit(LinearMotion, Motion);

        return LinearMotion;
    }
);
