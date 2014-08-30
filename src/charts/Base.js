/**
 * @file 图形基类
 * @author hushicai(bluthcy@gmail.com)
 */

define(
    function(require) {
        var extend = require('../lang/extend');
        var getGuid = require('../lang/getGuid');

        function Base(options) {
            extend(this, options);
            this.id = this.id || getGuid('charts');
        }

        return Base;
    }
);
