/**
 * @file 唯一标志
 * @author hushicai(bluthcy@gmail.com)
 */

define(
    function(require) {
        var uid = 0;

        var getGuid = function() {
            return 'hf' + (++uid);
        };

        return getGuid;
    }
);
