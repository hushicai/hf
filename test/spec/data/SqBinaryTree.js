/**
 * @file 顺序存储二叉树
 * @author hushicai02
 */

 define(
     function(require) {
         var SqBinaryTree = require('data/SqBinaryTree');
         var data = [1, 3 ,4, 6, 8, 10, 2, 5];
         var sbt;

         beforeEach(
             function() {
                 // 每次都重新生成一颗二叉树
                 sbt = new SqBinaryTree(data);
             }
         );

         describe('SeqBinaryTree test suite', function() {
             it('isEmptyTree', function() {
                 expect(sbt.isEmptyTree()).toBe(false);
                 sbt = new SqBinaryTree();
                 expect(sbt.isEmptyTree()).toBe(true);
             });
             it('getDepth', function() {
                 expect(sbt.getDepth()).toBe(4);

                 // 弄一个满二叉树来检查看看
                 sbt = new SqBinaryTree([1, 3, 4]);
                 expect(sbt.getDepth()).toBe(2);
                 // 再搞一个满二叉树来试试
                 sbt = new SqBinaryTree([1, 3, 4, 6, 8, 10, 2]);
                 expect(sbt.getDepth()).toBe(3);
             });
             it('getRoot', function() {
                 expect(sbt.getRoot()).toBe(1);
             });
             it('getNode', function() {
                 expect(sbt.getNode(1, 1)).toBe(1);
                 expect(sbt.getNode(1, 1)).toBe(sbt.getRoot());
                 expect(sbt.getNode(2, 1)).toBe(3);
                 expect(sbt.getNode(2, 2)).toBe(4);
                 expect(sbt.getNode(3, 3)).toBe(10);
                 expect(sbt.getNode(4, 1)).toBe(5);
                 expect(sbt.getNode(4, 2)).toBe(undefined);
                 expect(sbt.getNode(5, 1)).toBe(undefined);
             });
             it('setNode', function() {
                 expect(sbt.setNode(4, 3, 11)).toBe(9);
                 expect(sbt.setNode(5, 3, 11)).toBe(false);
             });
             it('deleteNode', function() {
                 // 先增加几个节点
                 sbt.setNode(4, 4, 11);
                 sbt.setNode(5, 7, 21);
                 sbt.setNode(5, 8, 31);
                 // 检查一下是否成功插入节点
                 expect(sbt.getDepth()).toBe(5);
                 // 删除一个节点试试
                 expect(sbt.deleteNode(3, 2)).toBe(true);
                 // 检查一下删除结果
                 expect(sbt.getNode(3, 2)).toBe(undefined);
                 expect(sbt.getNode(4, 4)).toBe(undefined);
                 expect(sbt.getNode(5, 7)).toBe(undefined);
                 expect(sbt.getNode(5, 8)).toBe(undefined);
                 expect(sbt.getDepth()).toBe(4);
                 // 再删一个试试
                 expect(sbt.deleteNode(2, 1)).toBe(true);
                 expect(sbt.getNode(2, 1)).toBe(undefined);
                 expect(sbt.getNode(3, 1)).toBe(undefined);
                 expect(sbt.getNode(4, 1)).toBe(undefined);
                 expect(sbt.getDepth()).toBe(3);
             });
             it('parent', function() {
                 expect(sbt.parent(8)).toBe(3);
                 expect(sbt.parent(4)).toBe(1);
                 expect(sbt.parent(1)).toBe(undefined);
             });
             it('leftChild', function() {
                 expect(sbt.leftChild(6)).toBe(5);
                 expect(sbt.leftChild(8)).toBe(undefined);
             });
             it('rightChild', function() {
                 expect(sbt.rightChild(6)).toBe(undefined);
                 expect(sbt.rightChild(4)).toBe(2);
             });
             it('leftSibling', function() {
                 expect(sbt.leftSibling(8)).toBe(6);
                 expect(sbt.leftSibling(6)).toBe(undefined);
             });
             it('rightSibling', function() {
                 expect(sbt.rightSibling(10)).toBe(2);
                 expect(sbt.rightSibling(2)).toBe(undefined);
             });
         });
     }
 );
