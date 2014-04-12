/**
 * @file 常见键盘码
 * @author hushicai02
 */

 define(
     function(require) {
         // 枚举变量
         // pascal命名方式
         var KeyCode = {
             /**
              * 左箭头
              *
              * @type {number}
              */
             LEFT: 37,

             /**
              * 上箭头
              *
              * @type {number}
              */
             UP: 38,

             /**
              * 右箭头
              *
              * @type {number}
              */
             RIGHT: 39,

             /**
              * 下箭头
              *
              * @type {number}
              */
             DOWN:40 
         };

         return KeyCode;
     }
 );
