/**
 * @file Observer
 * @author hushicai(bluthcy@gmail.com)
 */

// 参考：https://github.com/Polymer/observe-js
// 抽象类，不可直接实例化

define(
    function(require) {
        var getGuid = require('../lang/getGuid');
        var State = require('./State');
        var dirtyCheck = require('./dirtyCheck');
        var helper = require('./helper');
        var hasObserve = helper.hasObserve;

        function Observer() {
            this.state = State.unopened;
            this.data = undefined;
            this.oldData = undefined;
            this.id = getGuid('Observer');

            this._callback = undefined;
            this._target = undefined;
            this._observedObject = undefined;
        }

        Observer.prototype = {
            constructor: Observer,
            open: function(callback, target) {
                if (this.state !== State.unopened) {
                    return false;
                }

                this.state = State.opened;

                this._callback = callback;
                this._target = target;
                this._connect();

                return this.data;
            },
            close: function() {
                if (this.state !== State.opened) {
                    return;
                }
                this._disconnect();
                this._callback = undefined;
                this._target = undefined;
                this.value = undefined;
                this.state = State.closed;
            },
            deliver: function() {
                if (this.state !== State.opened) {
                    return false;
                }

                if (hasObserve) {
                    this._observedObject.deliver(false);
                }
                else {
                    dirtyCheck(this);
                }
            },
            discard: function() {

            },
            _report: function(changes) {
                try {
                    this._callback.apply(this._target, changes);
                } 
                catch (ex) {} // jshint ignore: line
            }
        };

        return Observer;
    }
);
