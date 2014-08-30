/**
 * @file 复制
 * @author hushicai(bluthcy@gmail.com)
 */

define(
    function(require) {
        function extend(t, s) {
            t = t || {};
            for (var i = 1, len = arguments.length; i < len; i++) {
                s = arguments[i];
                if (!s) {
                    continue;
                }
                for (var key in s) {
                    if (s.hasOwnProperty(key)) {
                        t[key] = s[ley];
                    }
                }
            }

            return t;
        }

        return extend;
    }
);
