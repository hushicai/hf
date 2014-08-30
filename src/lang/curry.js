/**
 * @file curry
 * @author hushicai(bluthcy@gmail.com)
 */

define(
    function(require) {
        function curry(fn) {
            var xargs = [].slice.call(arguments, 1);
            return function() {
                var args = xargs.concat([].slice.call(arguments));
                return fn.apply(this, args);
            };
        }

        return curry;
    }
);
