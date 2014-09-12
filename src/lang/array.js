/**
 * @file 数组增强功能
 * @author hushicai02
 */

 define(
     function(require) {
         var each = require('./each');

         return {
             /**
              * indexOf
              *
              * @public
              * @return {number} index
              */
             indexOf: function(item, arr) {
                 if (arr.indexOf) {
                     return arr.indexOf(item);
                 }

                 var idx = -1;
                 each(arr, function(x, i) {
                     if (item === x) {
                         idx = i;
                         return false;
                     }
                 });

                 return idx;
             },

            lastIndexOf: function() {},

            unique: function() {}
         };
     }
 );
