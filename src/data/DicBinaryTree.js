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

        function DicBinaryTree(data) {
            data = data || [];

            // 临时队列
            var queue = [];
            // 构建二叉树
            // 这是一颗完全二叉树：最后一层或者是满的，或者是在右边缺少连续若干节点
            for(var i = 0, len = data.length; i < len; i++) {
                var newNode = new Node(value);
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
        }

        DicBinaryTree.prototype.isEmptyTree = function() {
            return !this.root;
        }

        DicBinaryTree.prototype.getDepth = function() {
            if (this.isEmptyTree()) {
                return 0;
            }

            function _depth(root) {
                var i;
                var j;
            }

            return _depth(this.root);
        }

        // 先序遍历
        // 根—>左节点->右节点
        DicBinaryTree.prototype.prefix = function() {
            var result = [];
            /**
             * @inner
             */
            function _xxbl(root) {
                result.push(root.value);
                if (root.left) {
                    _xxbl(root.left);
                }
                if (root.right) {
                    _xxbl(root.right);
                }
            }
            _xxbl(this.root);

            return result;
        }

        // 中序遍历
        // 左节点->根->右节点
        DicBinaryTree.prototype.infix = function() {
            var result = [];

            /**
             * @inner
             */
            function _zxbl(root) {
                if(root.left) {
                    _zxbl(root.left);
                }
                result.push(root.value);
                if(root.right) {
                    _zxbl(root.right);
                }
            }

            _zxbl(this.root);

            return result;
        }

        // 后序遍历
        // 左节点->右节点->根
        DicBinaryTree.prototype.postfix = function() {
            var result = [];

            /**
             * @inner
             */
            function _hxbl(root) {
                if(root.left) {
                    _hxbl(root.left);
                }
                if(root.right) {
                    _hxbl(root.right);
                }
                result.push(root.value);
            }
            _hxbl(this.root);

            return result;
        }

        return DicBinaryTree;
    }
);
