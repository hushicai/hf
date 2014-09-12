/**
 * @file setStyles
 * @author hushicai(bluthcy@gmail.com)
 */

define(
    function(require) {
        var unit = require('./unit');
        function setStyles(element, styles) {
            var cssText = element.style.cssText;

            if (cssText && cssText[cssText.length - 1] !== ';') {
                cssText += ';';
            }

            for (var property in styles) {
                var css = styles[property] + unit[property] + ';';
                cssText += css;
            }

            element.style.cssText = cssText;
        }

        return setStyles;
    }
);
