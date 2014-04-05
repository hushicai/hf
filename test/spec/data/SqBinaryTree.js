/**
 * @file 顺序存储二叉树
 * @author hushicai02
 */

 define(
     function(require) {
         var SqBinaryTree = require('data/SqBinaryTree');
         var data = [1, 3 ,4, 6, 8, 10, 2, 5];
         var sbt = new SqBinaryTree(data);

         describe('SeqBinaryTree test suite', function() {
             it('isEmptyTree', function() {
                 expect(sbt.isEmptyTree()).toBe(false);
             });
             it('getDepth', function() {
                 expect(sbt.getDepth()).toBe(4);
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
         });
     }
 );
