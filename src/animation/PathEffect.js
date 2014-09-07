/**
 * @file 路径动画
 * @author hushicai(bluthcy@gmail.com)
 */

define(
    function(require) {
        var inherit = require('../lang/inherit');
        var extend = require('../lang/extend');
        var AnimationEffect = require('./AnimationEffect');

        function PathEffect(effectInput) {
            AnimationEffect.call(this);

            extend(this, effectInput);
        }

        PathEffect.prototype = {
            constructor: PathEffect,
            sample: function(target, timeFraction) {}
        };

        inherit(PathEffect, AnimationEffect);

        return PathEffect;
    }
);
