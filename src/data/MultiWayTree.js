/**
 * @file 基于顺序存储的多叉树
 * @author hushicai(bluthcy@gmail.com)
 */

define(
    function(require) {
        // 输入
        // ```javascript
        // [
        //     {
            //     name: 'xxxx',
            //     value: 1,
            //     children: []
            // },
            // ....
        // ]
        // ```
        function MultiWayTree(source) {
            this._root = {
                name: 'root',
                value: 'root',
                children: source
            };
        }


        MultiWayTree.prototype = {
            constructor: MultiWayTree,

            // 广度优先搜索
            wfs: function(value) {
                var queue = [];
                var root = this._root;

                queue.push(root);

                var current = null;

                while (queue.length > 0) {
                    current = queue.shift();
                    
                    if (current.value === value) {
                        break;
                    }

                    var children = current.children || [];
                    for (var i = 0, len = children.length; i < len; i++) {
                        queue.push(children[i]);
                    }
                }

                queue = null;

                return current;
            }
        };

        return MultiWayTree;
    }
);
