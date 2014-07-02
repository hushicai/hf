/**
* @file 最大公约数算法
* @author hushicai02
*/

define(
    function(require) {
        function gcd(m, n) {
            if (n === 0) {
                return m;
            }

            return gcd(n, m % n);
        }

        return gcd;
    }
);
