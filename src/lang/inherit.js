/**
 * @file 继承
 * @author hushicai(bluthcy@gmail.com)
 */

define(
    function(require) {
        function inherit(subClass, superClass) {
            var proto = subClass.prototype;
            var F = function() {};
            F.prototype = superClass.prototype;
            subClass.prototype = new F();
            for(var k in proto) {
                subClass.prototype[k] = proto[k];
            }
            subClass.prototype.constructor = subClass;
            subClass.prototype.superClass = superClass;

            return subClass;
        }

        return inherit;
    }
);
