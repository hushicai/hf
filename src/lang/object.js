/**
 * @file 对象常用方法
 * @author hushicai(bluthcy@gmail.com)
 */
define(
    function(require) {
        return {
            keys: Object.keys
                ? function(obj) {
                    return Object.keys(obj);
                }
                : function(obj) {
                    var keys = [];
                    for(var k in obj) {
                        keys.push(k);
                    }
                    return keys;
                },

            isEmpty: function(obj) {
                for (var prop in obj) { // jshint ignore:line
                    return false;
                }
                return true;
            }
        };
    }
);
