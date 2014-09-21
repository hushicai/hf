define(
    function(require) {
        var lastY = 0;
        var down = document.querySelector('.pull-down');
        var up = document.querySelector('.pull-up');
        var needToRefresh = false;
        document.addEventListener('touchstart', function(e) {
            var touch = e.touches[0];
            lastY = touch.pageY;
        }, false);
        document.addEventListener('touchmove', function(e) {
            var touch = e.touches[0];
            if (touch.pageY - lastY >= 50) {
                needToRefresh = true;
            }
            else {
                needToRefresh = false;
            }
        }, false);
        document.addEventListener('touchend', function(e) {
            if (needToRefresh) {
                needToRefresh = false;
            }
        }, false);
    }
);
