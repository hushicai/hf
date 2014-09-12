/**
 * @file 迭代数组或者对象
 * @author hushicai(bluthcy@gmail.com)
 */

define(
    function(require) {
        var type = require('./type');

        function each(obj, iterator, context) {
            context = context || this;

            if (!obj) {
                return;
            }
            if (type.isArray(obj)) {
                for (var i = 0, li = obj.length; i < li; i++) {
                    if (iterator.call(context, obj[i], i) === false) {
                        return;
                    }
                }
            } 
            else {
                for (var key in obj) {
                    if (iterator.call(context, obj[key], key) === false) {
                        return;
                    }
                }
            }
        }

        return each;
    }
);
