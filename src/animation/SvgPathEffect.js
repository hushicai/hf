/**
 * @file SvgPathEffect
 * @author hushicai(bluthcy@gmail.com)
 */

define(
    function(require) {
        var inherit = require('../lang/inherit');
        var PathEffect = require('./PathEffect');

        // 输入：
        // ```javascript
        // {
            // path: SVGPathElement
        // }
        // ```
        function SvgPathEffect(effectInput) {
            PathEffect.call(this, effectInput);

            if (!this.path instanceof SVGPathElement) {
                throw '参数有误';
            }

            this.total = this.path.getTotalLength();
        }

        SvgPathEffect.prototype = {
            constructor: SvgPathEffect,

            sample: function(target, timeFraction, currentIteration) {
                var lengthAtTimeFraction = this.total * timeFraction;
                var point = this.path.getPointAtLength(lengthAtTimeFraction);
                if (!this._tow) {
                    this._tow = target.offsetWidth / 2;
                }

                if (!this._toh) {
                    this._toh = target.offsetHeight / 2;
                }

                var x = point.x - this._tow;
                var y = point.y - this._toh;


                // svg有viewport（由width、 height指定）、view box（由viewBox指定）两个坐标系统
                // 如果这两个系统不一致，获得的坐标就不能跟dom一致
                // 按比例缩放一下？
                // TODO: 怎么修正一下位置呢？

                var compositor = require('./compositor');
                compositor.setAnimatedValue(target, 'left', x);
                compositor.setAnimatedValue(target, 'top', y);
            }
        };

        inherit(SvgPathEffect, PathEffect);

        return SvgPathEffect;
    }
);
