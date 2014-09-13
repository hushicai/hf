/**
 * @file dom上的AnimationTarget
 * @author hushicai(bluthcy@gmail.com)
 */

define(
    function(require) {
        var inherit = require('../lang/inherit');
        var AnimationTarget = require('../animation/AnimationTarget');
        var getStyle = require('../css/getStyle');
        var setStyles = require('../css/setStyles');

        function DomTarget(target) {
            AnimationTarget.call(this, target);
        }

        DomTarget.prototype = {
            constructor: DomTarget,

            composite: function(style) {
                // 应用样式
                setStyles(this._node, {left: style.x, top: style.y});
            },

            getPosition: function() {
                var pos = {};

                pos.x = getStyle(this._node, 'left');
                pos.y = getStyle(this._node, 'top');

                return pos;
            }
        };

        inherit(DomTarget, AnimationTarget);

        return DomTarget;
    }
);
