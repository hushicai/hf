define(
    function(require) {
        return {
            keys: Object.keys
                ? function(obj) {
                    return Object.keys(obj);
                }
                : function(obj) {
                    var keys = [];
                    for(var k in obj) {
                        keys.push(k);
                    }
                    return keys;
                }
        };
    }
);
