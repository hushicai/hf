define(
    function(require) {
        var inherit = function(subClass, superClass) {
            var F = function() {};

            F.prototype = superClass;

            subClass.prototype = new F();
            subClass.prototype.constructor = subClass;
            subClass.superClass = superClass;

            return subClass;
        }

        return inherit;
    }
);
