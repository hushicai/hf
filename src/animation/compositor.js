/**
 * @file compositor
 * @author hushicai(bluthcy@gmail.com)
 */

define(
    function(require) {
        var compositor = {
            items: [],
            setAnimatedValue: function(target, property, value) {
                this.items.push({
                    target: target,
                    property: property,
                    value: value
                });
            },
            applyAnimatedValues: function() {
                for (var i = 0, len = this.items.length; i < len; i++) {
                    var item = this.items[i];
                    require('../css/style').css(item.target, item.property, item.value);
                }
                // 执行完清空
                this.items = [];
            }
        };

        return compositor;
    }
);
