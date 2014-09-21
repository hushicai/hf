/**
 * @file 唯一标志
 * @author hushicai(bluthcy@gmail.com)
 */

define(
    function(require) {
        var uid = 0;

        var getGuid = function(prefix) {
            return '_hf_' + (prefix ? prefix + '_' : '') + (++uid) + '_';
        };

        return getGuid;
    }
);
