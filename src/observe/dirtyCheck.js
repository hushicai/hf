/**
 * @file dirtyCheck
 * @author hushicai(bluthcy@gmail.com)
 */

define(
    function(require) {
        // 为啥要限制次数？
        // 超出次数会怎么样？
        var MAX_DIRTY_CHECK_CYCLES = 1000;

        function dirtyCheck(observer) {
            var cycles = 0;
            while (cycles < MAX_DIRTY_CHECK_CYCLES && observer._check()) {
                cycles++;
            }

            return cycles > 0;
        }

        return dirtyCheck;
    }
);
