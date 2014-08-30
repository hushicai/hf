/**
 * @file 掺合
 * @author hushicai(bluthcy@gmail.com)
 */

define(
    function(require) {
        function mixin(t, s) {
            s = s || {};
            t = t || {};

            for(var key in s) {
                t[key] = s[key];
            }

            return t;
        }

        return mixin;
    }
);
