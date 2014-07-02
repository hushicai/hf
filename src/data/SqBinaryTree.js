/**
 * @file 顺序存储方式的二叉树实现
 * @author hushicai02
 */

define(
    function(require) {
        // storage mapping function
        function smf(level, order) {
            if (level < 1 && order < 1) {
                throw new Error('level、order参数都从1开始！');
            }

            return Math.pow(2, level - 1) + order - 2;
        }

        // 初始化时，得到的二叉树是一颗完全二叉树
        // 对该二叉树进行各项操作时，比如setNode、deleteNode等，就可能会变成一颗普通的二叉树或者满二叉树
        // 如果最后不是一颗满二叉树，顺序存储的方式就会造成一定量的空间浪费，最后的存储可能类似如下：
        // `[1, 2, 3, undefined, 5, 6, 8]`
        function SqBinaryTree(data) {
            data = data || [];
            // js会自动扩充数组，不需要预先分配好存储空间
            // 比如`var a = []; a[10]; console.log(a); // [undefined x 9, 10]`
            this.nodes = data.slice(0);
            data = null;
        }

        // 判断是否是空树
        SqBinaryTree.prototype.isEmptyTree = function() {
            return !this.nodes.length;
        };

        // 获取树的深度，空树深度为0
        SqBinaryTree.prototype.getDepth = function() {
            var n = this.nodes.length;
            // 找到最后一个节点
            while(--n) {
                if (this.nodes[n] !== undefined) {
                    break;
                }
            }
            // 总节点数
            n += 1;

            var k = -1;

            // 深度为k的二叉树最多有2^k - 1个节点
            do {
                k++;
            } while (Math.pow(2, k) - 1 < n);

            return k;
        };

        // 获取根节点
        SqBinaryTree.prototype.getRoot = function() {
            return this.nodes[0];
        };

        // level、order都从1开始
        // 返回指定位置的节点
        SqBinaryTree.prototype.getNode = function(level, order) {
            var idx = smf(level, order);

            return this.nodes[idx];
        };

        // level、order都从1开始
        // 插入成功，返回插入的位置
        SqBinaryTree.prototype.setNode = function(level, order, value) {
            var idx = smf(level, order);

            if (this.nodes[Math.floor((idx - 1) / 2)] === undefined) {
                return false;
            }

            this.nodes[idx] = value;

            return idx;
        };

        // 删除节点
        // 这是一颗普通的二叉树，根本没有实际用途，写着玩的
        // 没必要重建树，直接删除整棵子树就完了
        SqBinaryTree.prototype.deleteNode = function(level, order) {
            var idx = smf(level, order);
            // 节点不存在
            if (this.nodes[idx] === undefined) {
                return false;
            }
            var queue = [idx];
            var k = queue.shift();
            while(k !== undefined) {
                if (this.nodes[2 * idx + 1] !== undefined) {
                    queue.push(2 * idx + 1);
                }
                if(this.nodes[2 * idx + 2] !== undefined) {
                    queue.push(2 * idx + 2);
                }
                // 删除节点
                this.nodes[idx] = undefined;

                k = queue.shift();
                idx = k;
            }

            return true;
        };

        // 获取指定节点的父节点
        SqBinaryTree.prototype.parent = function(value) {
            // 从1开始比较，0是根节点，根节点没有父节点
            for(var i = 1, len = this.nodes.length; i < len; i++) {
                if (this.nodes[i] === value) {
                    return this.nodes[Math.floor((i - 1) / 2)];
                }
            }
        };

        // 返回一个节点的左孩子节点
        SqBinaryTree.prototype.leftChild = function(value) {
            for(var i = 0, len = this.nodes.length; i < len; i++) {
                if (this.nodes[i] === value) {
                    return this.nodes[2 * i + 1];
                }
            }
        };

        // 返回一个节点的右孩子节点
        SqBinaryTree.prototype.rightChild = function(value) {
            for(var i = 0, len = this.nodes.length; i < len; i++) {
                if (this.nodes[i] === value) {
                    return this.nodes[2 * i + 2];
                }
            }
        };

        // 返回一个右孩子节点的左兄弟节点
        SqBinaryTree.prototype.leftSibling = function(value) {
            for(var i = 1, len = this.nodes.length; i < len; i++) {
                if (this.nodes[i] === value && i % 2 === 0) {
                    return this.nodes[i - 1];
                }
            }
        };

        // 返回一个左孩子节点的右兄弟节点
        SqBinaryTree.prototype.rightSibling = function(value) {
            for(var i = 1, len = this.nodes.length; i < len; i++) {
                if (this.nodes[i] === value && i % 2 !== 0) {
                    return this.nodes[i + 1];
                }
            }
        };

        return SqBinaryTree;
    }
);
