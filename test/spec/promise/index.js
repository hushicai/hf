/**
 * @file Promise/A+单测
 * @author hushicai(bluthcy@gmail.com)
 */

define(
    function(require) {
        var Promise = require('promise/index');

        describe('Promise Constructor', function() {
            it('Promise should be a construtor', function() {
                expect(Promise).toBeOfType('function');
            });
            it('Promise should have length 1', function() {
                expect(Promise.length).toBe(1);
            });
        });
    }
);
