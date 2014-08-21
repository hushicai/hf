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
            it('should throw a `TypeError` if not given a function argument', function() {
                expect(
                    function() {
                        new Promise();
                    }
                ).toThrow(
                    new TypeError('Promise should be called with a function argument.')
                );

                expect(
                    function() {
                        new Promise({});
                    }
                ).toThrow(
                    new TypeError('Promise should be called with a function argument.')
                );

                expect(
                    function() {
                        new Promise('test');
                    }
                ).toThrow(
                    new TypeError('Promise should be called with a function argument.')
                );
            });
            it('should reject on resolver exception', function(done) {
                new Promise(function() {
                    throw 'error';
                }).then(null, function(r) {
                    expect(r).toBe('error');
                    done();
                });
            });
            it('should not resolve multiple times', function(done) {
                var resolver, rejector, fulfilled = 0, rejected = 0;
                var thenable = {
                    then: function(resolve, reject) {
                        resolver = resolve;
                        rejector = reject;
                    }
                };

                var promise = new Promise(function(resolve) {
                    resolve(1);
                });

                promise.then(function(value){
                    return thenable;
                }).then(function(value){
                    fulfilled++;
                }, function(reason) {
                    rejected++;
                });

                setTimeout(function() {
                    resolver(1);
                    resolver(1);
                    rejector(1);
                    rejector(1);

                    setTimeout(function() {
                        expect(fulfilled).toBe(1);
                        expect(rejected).toBe(0);
                        done();
                    }, 20);
                }, 20);
            });
            it('should not reject multiple times', function(done) {
                var resolver, rejector, fulfilled = 0, rejected = 0;
                var thenable = {
                    then: function(resolve, reject) {
                        resolver = resolve;
                        rejector = reject;
                    }
                };

                var promise = new Promise(function(resolve, reject) {
                    reject('error');
                });

                promise.then(function(value){
                    return thenable;
                }, function(r) {
                    return thenable;
                }).then(function(value){
                    fulfilled++;
                }, function(reason) {
                    rejected++;
                });

                setTimeout(function() {
                    rejector(1);
                    rejector(1);
                    resolver(1);
                    resolver(1);

                    setTimeout(function() {
                        expect(rejected).toBe(1);
                        expect(fulfilled).toBe(0);
                        done();
                    }, 20);
                }, 20);
            });
        });
    }
);
