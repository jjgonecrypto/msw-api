'use strict';

var chai = require('chai');
var expect = chai.expect;

var create = require('../../lib/util/sequencer.js').create;
var getSequenceAtIndex = require('../../lib/util/sequencer.js').getSequenceValueAtIndex;

describe('sequencer', function () {

    describe('create()', function () {
        it('must return sequence for simple array', function () {
            var compareFnc = function (item) { return item; };
            var sequence = create([true], compareFnc);
            expect(sequence).to.include.members([1]);
            expect(sequence).to.have.length(1);
            
            sequence = create([false], compareFnc);
            expect(sequence).to.include.members([0]);
            expect(sequence).to.have.length(1);
            
            sequence = create([true, false, true, true, true], compareFnc);
            expect(sequence).to.include.members([1,0,3]);
            expect(sequence).to.have.length(3);
           
            sequence = create([false, false, true], compareFnc);
            expect(sequence).to.include.members([0,1]);
            expect(sequence).to.have.length(3);

            sequence = create([false, true, false], compareFnc);
            expect(sequence).to.include.members([0,1]);
            expect(sequence).to.have.length(3);
            
            sequence = create([true, true, true], compareFnc);
            expect(sequence).to.include.members([3]);
            expect(sequence).to.have.length(1);
        });

        it('must handle more complex comparison functions', function () {
            var compareFnc = function (item) { return item % 2 === 0; };

            var sequence = create([ 2, 4, 6, 22, 106, 0, 3, 5, 77], compareFnc);
            expect(sequence).to.include.members([6, 0]);
            expect(sequence).to.have.length(4);
        });
    });

    describe('getSequenceAtIndex()', function () {
        it('must return correct sequence number at index', function () {
            expect(getSequenceAtIndex([0, 1, 0], 0)).to.equal(0);
            expect(getSequenceAtIndex([0, 1, 0], 1)).to.equal(1);
            expect(getSequenceAtIndex([0, 1, 0], 2)).to.equal(0);
            expect(getSequenceAtIndex([3, 1, 0], 3)).to.equal(1);
            expect(getSequenceAtIndex([3, 1, 0], 4)).to.equal(0);
            expect(getSequenceAtIndex([5, 4, 3], 8)).to.equal(4);
            expect(getSequenceAtIndex([5, 4, 3], 9)).to.equal(3);
            expect(getSequenceAtIndex([0, 10, 4, 3], 10)).to.equal(10);
            expect(getSequenceAtIndex([0, 0, 0,], 1)).to.equal(0);
            expect(getSequenceAtIndex([1, 1, 0], 2)).to.equal(0);
            expect(getSequenceAtIndex([4, 3, 2], 7)).to.equal(2);
                
        });
    });

});