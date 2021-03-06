/**
 * @file 数学曲线
 * @author hushicai(bluthcy@gmail.com)
 */

define(
    function(require) {
        var inherit = require('../lang/inherit');
        var extend = require('../lang/extend');
        var AnimationEffect = require('./AnimationEffect');

        function MathEffect(effectInput) {
            AnimationEffect.call(this);

            extend(this, effectInput);

            // 起点
            this.startPoint = this.startPoint || {x: 0, y: 0};

            this._resolveEquation();
        }

        MathEffect.prototype = {
            constructor: MathEffect,

            sample: function(target, timeFraction) {},

            _resolveEquation: function() {}
        };

        inherit(MathEffect, AnimationEffect);

        return MathEffect;
    }
);
