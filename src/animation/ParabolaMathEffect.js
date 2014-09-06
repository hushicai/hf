/**
 * @file 抛物线动画效果
 * @author hushicai(bluthcy@gmail.com)
 */

define(
    function(require) {
        var inherit = require('../lang/inherit');
        var MathEffect = require('./MathEffect');

        function ParabolaMathEffect(effectInput) {
            MathEffect.call(this, effectInput);
        }

        ParabolaMathEffect.prototype = {
            constructor: ParabolaMathEffect,

            sample: function(target, timeFraction) {
                // x轴的递增速度
                var x = this.endPoint.x * timeFraction;
                var y = this.equation(x);

                var compositor = require('./compositor');
                compositor.setAnimatedValue(target, 'left', x);
                compositor.setAnimatedValue(target, 'top', y);
            },

            _resolveEquation: function() {
                var endPoint = this.endPoint;
                var a = 0.01;
                var b = (endPoint.y - a * endPoint.x * endPoint.x) / endPoint.x;
                var c = 0;

                this.equation = function(x) {
                    return a * x * x + b * x + c;
                };
            }
        };

        inherit(ParabolaMathEffect, MathEffect);

        return ParabolaMathEffect;
    }
);
