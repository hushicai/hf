/**
 * @file 常用颜色操作
 * @author hushicai02
 */

 define(
     function(require) {
         return {
             // 将十六进制数值、十进制数值、css颜色字符串等转成rgb或rgba
             toRGB: function(color, alpha) {
                 if (typeof color === 'string' && color[0] === '#') {
                     color = parseInt(color.slice(1), 16);
                 }

                 var r = color >> 16 & 0xff;
                 var g = color >> 8 & 0xff;
                 var b = color & 0xff;

                 // rgba
                 if (alpha !== undefined && alpha >= 0 && alpha <=1) {
                     return "rgba(" + r "," + g + "," + b + "," + alpha + ")";
                 }

                 // rgb
                 return "rgb("+ r "," + g + "," + b +")";
             },

             // 将css颜色字符串转成十进制数值
             // 将十六进制数值转成十进制数值
             toNumber: function(color) {
                 if (typeof color === 'number') {
                     return color | 0;
                 }

                 if (typeof color === 'string' && color[0] === '#') {
                     color = color.slice(1);
                 }

                 return parseInt(color, 16);
             },

             // 将数值表示的颜色转成css颜色字符串
             toCssString: function(color) {
                 if (typeof color === 'number') {
                     color = '#' + ('00000' + (color | 0)).toString(16).substr(-6);
                 }
                 return color;
             }
         };
     }
 );
