/**
 * @file ArrayObserver
 * @author hushicai(bluthcy@gmail.com)
 */

define(
    function(require) {
        var inherit = require('../lang/inherit');
        var Observer = require('./Observer');

        function ArrayObserver(array) {
            Observer.call(this);
        }
        ArrayObserver.prototype = {
            constructor: ArrayObserver
        };
        inherit(ArrayObserver, Observer);

        return ArrayObserver;
    }
);
