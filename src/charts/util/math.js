/**
 * @file 图表常用数学方法
 * @author hushicai02
 */

 define(
     function(require) {
         var math = {
             /**
              * 弧度转角度
              *
              * @public
              */
             r2d: function(arc) {
                 return arc * 180 / Math.PI;
             },

             /**
              * 角度转弧度
              *
              * @public
              */
             d2r: function(degree) {
                 return degree * Math.PI / 180;
             },

             /**
              * 两点之间的距离
              *
              * @public
              */
             distance: function(p1, p2) {
                 var dx = p2.x - p1.x;
                 var dy = p2.y - p1.y;

                 return Math.sqrt(dx * dx + dy * dy);
             }
         };

         return math;
     }
 );
