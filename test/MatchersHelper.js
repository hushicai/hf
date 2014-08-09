beforeEach(function() {
    jasmine.addMatchers({
        toBeOfType: function() {
            return {
                compare: function(actual, type) {
                    var result = {
                        pass: typeof actual === type
                    };

                    return result;
                }
            };
        }
    });
});
