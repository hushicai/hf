/**
 * @file Promise/A+单测
 * @author hushicai(bluthcy@gmail.com)
 */

/* jshint newcap: false, nonew: false */
define(
    function(require) {
        var Promise = require('promise/index');

        describe('Promise', function() {
            it('should exist', function() {
                expect(Promise).not.toBe(undefined);
            });
            it('should have length 1', function() {
                expect(Promise.length).toBe(1);
            });
            it('should fulfill if `resolve` is called with a value', function(done) {
                var promise = new Promise(function(resolve) {
                    resolve('value');
                });

                promise.then(function(value) {
                    expect(value).toBe('value');
                    done();
                });
            });
            it('should reject if `reject` is called with a reason', function(done) {
                var promise = new Promise(function(resolve, reject) {
                    reject('reason');
                });
                promise.then(null, function(r) {
                    expect(r).toBe('reason');
                    done();
                });
            });
            it('should be a constructor', function() {
                var promise = new Promise(function() {});

                expect(Object.getPrototypeOf(promise)).toBe(Promise.prototype);
                expect(promise.constructor).toBe(Promise);
                expect(Promise.prototype.constructor).toBe(Promise);
            });
            it('should not work without `new`', function() {
                expect(
                    function() {
                        Promise(function(resolve) {resolve('value');});
                    }
                ).toThrow(
                    new TypeError('Promise should be called with `new`.')
                );
            });
            it('should throw a `TypeError` if not given a function', function() {
                expect(
                    function() {
                        new Promise();
                    }
                ).toThrow(
                    new TypeError('Promise should be called with a function argument.')
                );
            });
        });
    }
);
