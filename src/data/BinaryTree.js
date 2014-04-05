/**
* @file 二叉树的js实现
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
            // 父节点
            this.parent = null;
        }

        function BinaryTree() {
            this.root = null;

            // 私有变量
            var queue = [];
            // 特权函数，主要用于将输入数据构建成二叉树
            // 这是一颗完全二叉树：最后一层或者是满的，或者是在右边缺少连续若干节点
            this.insert = function(value) {
                var newNode = new Node(value);
                if (this.root === null) {
                    this.root = newNode;
                } else {
                    var node = queue[0];

                    if(node.left === null) {
                        node.left = newNode;
                    } else if(node.right === null) {
                        node.right = newNode;
                        queue.shift();
                    }
                }

                queue.push(newNode);

                return  newNode;
            }
        }

        // 先序遍历
        // 根—>左节点->右节点
        BinaryTree.prototype.prefix = function() {
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
        BinaryTree.prototype.infix = function() {
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
        BinaryTree.prototype.postfix = function() {
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

        return BinaryTree;
    }
);
