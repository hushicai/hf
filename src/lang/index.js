/**
* @file 判断数据类型
* @author hushicai(bluthcy@gmail.com)
*/

define(
    function(require) {
        var toString = Object.prototype.toString;

        return {
            /**
            * 判断是否是对象
            * 
            */
            isObject: function(s) {
                return toString.call(s) === '[object Object]';
            },

            /**
            * 判断是否是数组
            * 
            */
            isArray: function(s) {
                return toString.call(s) === '[object Array]';
            }
        };
    }
);
