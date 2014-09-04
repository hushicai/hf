/**
 * @file css
 * @author hushicai(bluthcy@gmail.com)
 */

define(
    function(require) {
        var style = {};

        style.getCssProperty = function(property) {
            var prefix = ['webkit', 'ms', 'moz', 'o', 'khtml'];
            var div = document.createElement('div');

            property = property.replace(/(^|.)-([a-z])/gi, function($0, $1, $2) {
                if ($1) {
                    $2 = $2.toUpperCase();
                }
                return $1 + $2;
            });

            if (property in div.style) {
                return property;
            }

            // 首字母大写
            property = property.replace(/^([a-z])/i, function($0, $1) {
                return $1.toUpperCase();
            });

            for (var i = 0, len = prefix.length; i < len; i++) {
                var css = prefix[i] + property;
                if (css in div.style) {
                    return css;
                }
            }

            return null;
        }

        var cssUnit = {
            left: 'px'
        };

        style.css = function(element, key, value) {
            var unit = cssUnit[key] || "";

            element.style[key] = value + unit;
        }

        return style;
    }
);
