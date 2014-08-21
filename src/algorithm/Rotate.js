/**
 * @file 字符串左旋算法
 * @author hushicai(bluthcy@gmail.com)
 */

// 参考文章：http://blog.csdn.net/v_JULY_v/article/details/6322882
// js实现
// 其实我主要是想记录一下字符移动过程，然后用动画演示一遍

define(
    function(require) {
        function swap(s, i, j) {
            s = s.split('');
            var t = s[i];
            s[i] = s[j];
            s[j] = t;
            
            return s.join('');
        }

        function rotate(s, m) {
            if (s.length === 0 || m <= 0) {
                return;
            }

            var n = s.length;

            if (m >= n) {
                return;
            }

            var p1 = 0;
            var p2 = m;

            // 长度为m的子字符串可以向前整体移动的次数
            var k = (n - m) - n % m;

            while(k--) {
                this.records.push({
                    s: s,
                    p1: p1,
                    p2: p2
                });
                s = swap(s, p1, p2);
                p1++;
                p2++;
            }

            // 剩余的字符串处理
            // 挨个向左移动
            var r = n - p2;
            while(r--) {
                var i = p2;
                while(i > p1) {
                    this.records.push({
                        s: s,
                        i: i
                    });
                    s= swap(s, i, i - 1);
                    i--;
                }
                this.records.push({
                    s: s,
                    i: i
                });
                p1++;
                p2++;
            }

            this.records.push({
                s: s
            });

            return s;
        }

        function Rotate() {
            this.records = [];
        }

        Rotate.prototype = {
            constructor: Rotate,
            rotate: function() {
                return rotate.apply(this, arguments);
            },
            getRecords: function() {
                return this.records;
            }
        };

        return Rotate;
    }
);
