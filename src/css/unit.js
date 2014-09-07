/**
 * @file unit
 * @author hushicai(bluthcy@gmail.com)
 */

define(
    function(require) {
        var unit = {
            opacity: ''
        }

        var pos = ['top', 'right', 'bottom', 'left'];
        for (var i = 0; i < 4; i++) {
            unit[pos[i]] = 'px';
        }

        return unit;
    }
);
