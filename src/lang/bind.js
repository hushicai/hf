/**
 * @file bind
 * @author hushicai(bluthcy@gmail.com)
 */

define(
    function(require) {
        // see http://es5.github.io/#x15.3.4.5.1
        function bind(fn, thisArg) {
            var args = Array.prototype.slice.call(arguments, 2);
            return function () {
                return fn.apply(
                    thisArg, 
                    args.concat(Array.prototype.slice.call(arguments))
                );
            };
        }

        return bind;
    }
);
