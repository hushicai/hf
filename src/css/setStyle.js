/**
 * @file setStyle
 * @author hushicai(bluthcy@gmail.com)
 */

define(
    function(require) {
        var unit = require('./unit');

        function setStyle(element, property, value) {
            element.style[property] = value + unit[property] || "";
        }

        return setStyle;
    }
);
