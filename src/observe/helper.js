/**
 * @file helper
 * @author hushicai(bluthcy@gmail.com)
 */

define(
    function(require) {
        var object = require('../lang/object');

        var hasObserve = typeof Object.observe === 'function' 
            && typeof Array.observe === 'function'; 

        return {
            hasObserve: hasObserve,

            diffIsEmpty: function(diff) {
                return object.isEmpty(diff.added) &&
                    object.isEmpty(diff.removed) &&
                    object.isEmpty(diff.changed);
            },

            diffWidthChangeRecords: function(data, changeRecords) {
                var expectedRecordTypes = {
                    'add': true,
                    'update': true,
                    'delete': true
                };

                var added = {};
                var removed = {};
                var changed = {};

                for (var i = 0; i < changeRecords.length; i++) {
                    var record = changeRecords[i];
                    var type = record.type;
                    var name = record.name;

                    if (!expectedRecordTypes[type]) {
                        continue;
                    }

                    if (type === 'update') {
                        changed[name] = data[name];
                    }

                    if (type === 'add') {
                        added[name] = data[name];
                    }

                    if (type === 'delete') {
                        removed[name] = undefined;
                    }
                }

                return {
                    added: added,
                    removed: removed,
                    changed: changed
                };
            },

            diffWithOldData: function(data, oldData) {
                var added = {};
                var removed = {};
                var changed = {};

                for (var prop in oldData) {
                    var newValue = data[prop];

                    if (newValue === oldData[prop]) {
                        continue;
                    }

                    if (!(prop in data)) {
                        removed[prop] = undefined;
                        continue;
                    }

                    if (newValue !== oldData[prop]) {
                        changed[prop] = newValue;
                    }
                }

                for (var prop in data) {
                    if (prop in oldData) {
                        continue;
                    }

                    added[prop] = data[prop];
                }

                return {
                    added: added,
                    removed: removed,
                    changed: changed
                };
            }
        };
    }
);
