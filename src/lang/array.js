/**
 * @file 数组增强功能
 * @author hushicai02
 */

 define(
     function(require) {
         var indexOf = Array.prototype.indexOf;

         return {
             /**
              * indexOf
              *
              * @public
              * @return {number} index
              */
             indexOf: indexOf
                ? function(item, arr) {
                    return indexOf.call(arr, item);
                }
                : function(item, arr) {
                    for(var i = 0, len = array.length; i < len; i++) {
                        if (arr[i] === item) {
                            return i;
                        }
                    }
                    return -1;
                },

            lastIndexOf: function() {},

            unique: function() {}
         };
     }
 );
