/**
 * @file 顺序存储方式的二叉树实现
 * @author hushicai02
 */

 define(
     function(require) {
         function smf(level, order) {
             if (level < 1 && order < 1) {
                 throw new Error('level、order参数都从1开始！');
             }

             return Math.pow(2, level - 1) - 1 + order - 1;
         }

         function SqBinaryTree(data) {
             data = data || [];
             // js会自动扩充数组，不需要预先分配好存储空间
             // 比如`var a = []; a[10]; console.log(a); // [undefined x 9, 10]`
             this.nodes = data.slice(0);
             data = null;
         }

         // 判断是否空树
         SqBinaryTree.prototype.isEmptyTree = function() {
             return !this.nodes.length;
         }

         // 获取树的深度
         SqBinaryTree.prototype.getDepth = function() {
             var n = this.nodes.length;
             var k = -1;

             // 深度为k的二叉树最多有2^k - 1个节点
             do {
                 k++;
             } while (n >= Math.pow(2, k) - 1);

             return k;
         }

         // 获取根节点
         SqBinaryTree.prototype.getRoot = function() {
             if (this.isEmptyTree()) {
                 return null;
             }

             return this.nodes[0];
         }

         // level、order都从1开始
         SqBinaryTree.prototype.getNode = function(level, order) {
             var idx = smf(level, order);

             return this.nodes[idx];
         }

         // level、order都从1开始
         SqBinaryTree.prototype.setNode = function(level, order, value) {
             var idx = smf(level, order);

             if (value === undefined) {
                 throw new Error('请指定节点值！');
             }

             if (this.nodes[Math.floor(i - 1) / 2] === undefined) {
                 throw new Error('父节点为空，不能在该位置上插入节点！');
             }

             return this.nodes[idx] = value;
         }

         // 删除节点
         SqBinaryTree.prototype.deleteNode = function(value) {}

         SqBinaryTree.prototype.parent = function(value) {
             // 从1开始比较，0是根节点，根节点没有父节点
             for(var i = 1, len = this.nodes.length; i < len; i++) {
                 if (this.nodes[i] === value) {
                     return this.nodes[Math.floor(i - 1) / 2];
                 }
             }

             return;
         }


         SqBinaryTree.prototype.leftChild = function(value) {}

         SqBinaryTree.prototype.rightChild = function(value) {}

         SqBinaryTree.prototype.prevSibling = function(value) {}

         SqBinaryTree.prototype.nextSibling = function(value) {}

         return SqBinaryTree;
     }
 );
