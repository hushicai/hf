/**
 * @file 二叉链表二叉树
 * @author hushicai02
 */

define(
    function(require) {
        var DcBinaryTree = require('data/DcBinaryTree');
        var data = [1, 3 ,4, 6, 8, 10, 2, 5];
        var dct;

        beforeEach(
            function() {
                dct = new DcBinaryTree(data);
            }
        );

        describe('DcBinaryTree test suite', function() {
            it('isEmptyTree', function() {
                expect(dct.isEmptyTree()).toBe(false);
                dct = new DcBinaryTree();
                expect(dct.isEmptyTree()).toBe(true);
            });
            it('getDepth', function() {
                expect(dct.getDepth()).toBe(4);
            });
        });
    }
);
