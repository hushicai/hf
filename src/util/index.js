/**
 * @file 工具库
 * @author hushicai02
 */

define(
    function(require) {
        var toString = Object.prototype.toString;
        var util = {};

        var uid = 0;

        util.getGuid = function() {
            return 'hf' + (++uid);
        };

        /**
        * 继承
        *
        * @public
        */
        util.inherit = function(subClass, superClass) {
            var proto = subClass.prototype;
            var F = function() {};
            F.prototype = superClass.prototype;
            subClass.prototype = new F();
            for(var k in proto) {
                subClass.prototype[k] = proto[k];
            }
            subClass.prototype.constructor = subClass;

            return subClass;
        };

        // 默认覆盖
        util.extend = function(t, s, override) {
            s = s || {};
            override = override === undefined ? true : false;
            for(var k in s) {
                if (override || !t[k]) {
                    t[k] = s[k];
                } 
            }
            return t;
        };

        util.isObject = function(s) {
            return toString.call(s) === '[object Object]';
        };

        util.isArray = function(s) {
            return toString.call(s) === '[object Array]';
        };

        util.each = function(s, iterator) {
            if (util.isObject(s)) {
                for(var k in s) {
                    if (s.hasOwnProperty(k)
                        && iterator(s[k], k, s) === false
                    ) {
                        break;
                    }
                }
            }
            else if(util.isArray(s)) {
                for(var i = 0, len = s.length; i < len; i++) {
                    if (iterator(s[i], i, s) === false) {
                        break;
                    }
                }
            }
        };

        return util;
    }
);
