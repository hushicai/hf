/**
 * @file 正弦曲线动画
 * @author hushicai(bluthcy@gmail.com)
 */

define(
    function(require) {
        var inherit = require('../lang/inherit');
        var MathEffect = require('./MathEffect');

        function SineMathEffect(effectInput) {
            MathEffect.call(this, effectInput);

            this.equation = this.equation || function(x) {
                return Math.sin(x);
            }
        }
        SineMathEffect.prototype = {
            constructor: SineMathEffect,

            sample: function(target, timeFraction) {
                var x = 2 * Math.PI * timeFraction;
                var y = this.equation(x);

                // 最大值才2π
                // 因此为了更好地观察元素在x轴上的波形，将x放大40倍
                var left = this.startPoint.x + x * 40;
                var top = this.startPoint.y - y;

                var compositor = require('./compositor');
                compositor.setAnimatedValue(target, 'left', left);
                compositor.setAnimatedValue(target, 'top', top);
            }
        };

        inherit(SineMathEffect, MathEffect);

        return SineMathEffect;
    }
);
