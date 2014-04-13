/**
 * @file 事件对象
 * @author hushicai02
 */

 define(
     function(require) {
         function EventArgs(e) {
             this.originEvent = e;

             for(var k in e) {
                 var item = e[k];
                 if (typeof item !== 'function') {
                     this[k] = item;
                 }
             }

             this.target = this.target || this.srcElement || null;
             this.which = this.which || this.keyCode || 0;
         }

         EventArgs.prototype.stopPropagation = function() {}

         EventArgs.prototype.preventDefault = function() {}

         return EventArgs;
     }
 );
