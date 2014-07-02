/**
* @file 二叉存储方式的二叉树实现
* @author hushicai02
*/

define(
    function(require) {
        function Node(value) {
            // 节点值
            this.value = value;
            // 左子节点
            this.left = null;
            // 右子节点
            this.right = null;
        }

        function DcBinaryTree(data) {
            data = data || [];

            this.root = null;

            // 临时队列
            var queue = [];
            // 构建二叉树
            // 这是一颗完全二叉树：最后一层或者是满的，或者是在右边缺少连续若干节点
            for(var i = 0, len = data.length; i < len; i++) {
                var newNode = new Node(data[i]);
                if (this.root === null) {
                    this.root = newNode;
                } else {
                    // 取下一个节点为子树根节点
                    var node = queue[0];
                    if (node.left === null) {
                        node.left = newNode;
                    } else if(node.right === null) {
                        node.right = newNode;
                        // 处理完右子节点后，弹出队列的当前节点
                        queue.shift();
                    }
                }

                queue.push(newNode);
            }

            queue = null;
        }

        DcBinaryTree.prototype.isEmptyTree = function() {
            return !this.root;
        };

        DcBinaryTree.prototype.getDepth = function() {
            if (this.isEmptyTree()) {
                return 0;
            }

            function _depth(root) {
                var i;
                var j;

                if (root.left) {
                    i = _depth(root.left);
                }
                else {
                    i = 0;
                }

                if (root.right) {
                    j = _depth(root.right);
                }
                else {
                    j = 0;
                }

                // 当前子树根节点的深度
                // 那边大算那边
                return i > j ? i + 1 : j + 1;
            }

            return _depth(this.root);
        };

        return DcBinaryTree;
    }
);
