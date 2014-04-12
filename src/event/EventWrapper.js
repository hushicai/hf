/**
 * @file 事件包装对象
 * @author hushicai02
 */

 define(
     function(require) {
         // 还有老多事要做，先这样
         // 包装原生event对象
         // 跨浏览器支持
         function EventWrapper(e) {
             // 只拷贝属性
             for(var k in e) {
                 var item = e[k];
                 if ('function' !== typeof item) {
                     this[k] = item;
                 }
             }

             this.target = this.target || this.srcElement;
             this.keyCode = this.keyCode || this.which;

             var doc = document;
             if (this.pageX === undefined) {
                 this.pageX = (this.clientX || 0) 
                     + (doc.documentElement.scrollLeft || doc.body.scrollLeft);
             }

             if (this.pageY === undefined) {
                 this.pageY = (this.clientY || 0)
                    + (doc.documentElement.scrollTop || doc.body.scrollTop);
             }

             this.originEvent = e;
         }

         EventWrapper.prototype.preventDefault = function() {
             var e = this.originEvent;
             if (e.preventDefault) {
                 e.preventDefault();
             }
             else {
                 e.returnValue = false;
             }
             return this;
         }

         EventWrapper.prototype.stopPropagation = function() {
             var e = this.originEvent;
             if(e.stopPropagation) {
                 e.stopPropagation();
             }
             else {
                 e.cancelBubble = true;
             }
             return this;
         }

         return EventWrapper;
     }
 );
