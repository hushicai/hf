/**
 * @file 复制
 * @author hushicai(bluthcy@gmail.com)
 */

define(
    function(require) {
        function extend(t, s, override) {
            s = s || {};
            override = override === undefined ? true : false;
            for(var k in s) {
                if (override || !t[k]) {
                    t[k] = s[k];
                } 
            }
            return t;
        }

        return extend;
    }
);
