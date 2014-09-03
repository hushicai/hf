/**
 * @file ObjectObserver
 * @author hushicai(bluthcy@gmail.com)
 */

define(
    function(require) {
        var inherit = require('../lang/inherit');
        var extend = require('../lang/extend');
        var Observer = require('./Observer');
        var helper = require('./helper');
        var hasObserve = helper.hasObserve;
        var getObservedObject = require('./getObservedObject');

        function ObjectObserver(obj) {
            Observer.call(this);
            this.data = obj;
        }
        ObjectObserver.prototype = {
            constructor: ObjectObserver,
            _connect: function(callback) {
                if (hasObserve) {
                    this._observedObject = getObservedObject(this, this.data);
                } 
                else {
                    this.oldData = extend({}, this.data);
                } 
            },
            _check: function(changeRecords, skipChanges) {
                var diff;

                if (hasObserve) {
                    if (!changeRecords) {
                        return false;
                    }

                    diff = helper.diffWithChangeRecords(this.data, changeRecords);
                } 
                else {
                    diff = helper.diffWithOldData(this.data, this.oldData);
                }

                if (helper.diffIsEmpty(diff)) {
                    return false;
                }

                // 更新数据
                if (!hasObserve) {
                    this.oldData = extend({}, this.data);
                }

                this._report([
                    diff.added || {},
                    diff.removed || {},
                    diff.changed || {}
                ]);

                return true;
            },
            _disconnect: function() {
                if (hasObserve) {
                    this._observedObject.close();
                    this._observedObject = undefined;
                } 
                else {}
            }
        };

        inherit(ObjectObserver, Observer);

        return ObjectObserver;
    }
);
