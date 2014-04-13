/**
 * @file 事件基类
 * @author hushicai02
 */

 define(
     function(require) {
         function Event(e) {
             var ev;
             if (e && e.type) {
                 ev = e;
             }
             else {
                 ev = {
                     type: e
                 };
             }
             for(var k in ev) {
                 if (ev.hasOwnProperty(k)) {
                     this[k] = ev[k];
                 }
             }
             this.eventType = 'Events';

             this.target = this.target || null;
             this.currentTarget = this.currentTarget || null;
             this.bubbles = this.bubbles || true;
             this.cancelable = this.cancelable || true;
         }

         Event.prototype.createDomEvent = function() {
             var eo;
             if (document.createEvent) {
                 eo = document.createEvent(this.eventType);
             }
             else if(document.createEventObject) {
                 eo = document.createEventObject();
             }

             // 如果为false，说明子类中的initEvent方法没有成功调用dom api
             // 那就需要把参数手动拷贝过去
             // 这通常发生在非标准浏览器，比如ie
             if (this.initEvent(eo) === false) {
                 for(var k in this) {
                     if (typeof this[k] !== 'function') {
                         eo[k] = this[k];
                     }
                 }
             }

             return eo;
         }

         Event.prototype.initEvent = function(eo) {
             if (eo.initEvent) {
                 return eo.initEvent(
                     this.type,
                     this.bubbles,
                     this.cancelable
                 );
             }

             return false;
         }

         return Event;
     }
 );
