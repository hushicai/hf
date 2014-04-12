define(
    function(require) {
        var inherit = function(subClass, superClass) {
            var proto = subClass.prototype;
            var F = function() {};
            F.prototype = superClass.prototype;
            subClass.prototype = new F();
            for(var k in proto) {
                subClass.prototype[k] = proto[k];
            }
            subClass.prototype.constructor = subClass;
            subClass.superClass = superClass;

            return subClass;
        }

        return inherit;
    }
);
