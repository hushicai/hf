/**
 * @file getStyle
 * @author hushicai(bluthcy@gmail.com)
 */

define(
    function(require) {
        var getProperty = require('./getProperty');

        function getStyle(elem, property) {
            property = getProperty(property);

            var styles = getComputedStyle 
                ? getComputedStyle(elem)
                : elem.currentStyle;

            var originValue = styles[property];
            var value = parseInt(originValue, 10);

            return isNaN(value) ? 0 : value;
        }

        return getStyle;
    }
);
