/**
 * @file 提供一些常用的事件方法
 * @author hushicai02
 */

 define(
     function(require) {
         return {
             // 添加事件监听
             addEventListener: function(element, type, listener) {
                 if (element.addEventListener) {
                     element.addEventListener(type, listener, false);
                 } 
                 else if(element.attachEvent) {
                     element.attachEvent('on' + type, listener);
                 }

                 return this;
             },
             // 移除事件监听
             removeEventListener: function(element, type, listener) {
                 if (element.removeEventListener) {
                     element.removeEventListener(type, listener ,false);
                 }
                 else if(element.detachEvent) {
                     element.detachEvent(type, listener);
                 }

                 return this;
             }
         };
     }
 );
