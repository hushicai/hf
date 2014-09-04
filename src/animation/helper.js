/**
 * @file helper
 * @author hushicai(bluthcy@gmail.com)
 */

define(
    function(require) {
        var helper = {
            isDefined: function(val) {
                return val !== undefined;
            },
            isDefinedAndNotNull: function(val) {
                return helper.isDefined(val) && (val !== null);
            }
        };
        
        return helper;
    }
);
