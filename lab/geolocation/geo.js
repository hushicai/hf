/**
 * @file 定位
 * @author hushicai(bluthcy@gmail.com)
 */

define(
    function(require) {
        function success(position) {
            geo.emit('founded', position);
        }

        function fail(error) {
            var message = "";
            switch (error.code) {
                case 0:
                    message = "获取出错";
                    break;
                case 1:
                    message = "用户拒绝";
                    break;
                case 2:
                    message = "获取超时";
                    break;
            }

            geo.emit('fail', message);
        }

        var geo = {
            getLocation: function() {
                if (!navigator.geolocation) {
                    return false;
                }

                navigator.geolocation.getCurrentPosition(success, fail, {enableHighAccuracy: true});

                return geo;
            }
        };

        require('../../src/event/Emitter').mixin(geo);

        return geo;
    }
);
