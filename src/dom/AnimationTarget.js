/**
 * @file AnimationTarget
 * @author hushicai(bluthcy@gmail.com)
 */

define(
    function(require) {
        var inherit = require('../lang/inherit');
        var AnimationTarget = require('../animation/AnimationTarget');
        var getStyle = require('../css/getStyle');
        var setStyles = require('../css/setStyles');

        var propMap = {
            x: 'left',
            y: 'top'
        };

        function DomAnimationTarget(target) {
            AnimationTarget.call(this, target);
        }

        DomAnimationTarget.prototype = {
            constructor: DomAnimationTarget,

            composite: function(style) {
                for (var key in style) {
                    var prop = this.normalize(key);
                    if (prop !== key) {
                        style[prop] = style[key];
                        delete style[key];
                    }
                }
                // 应用样式
                setStyles(this._node, style);
            },

            getPropertyValue: function(prop) {
                prop = this.normalize(prop);
                return getStyle(this._node, prop);
            },

            normalize: function(prop) {
                return  propMap[prop] || prop;
            }
        };

        inherit(DomAnimationTarget, AnimationTarget);

        return DomAnimationTarget;
    }
);
