'use strict';

//Returns an array where each member is the count of the sequence of elements that pass the 
//isInSequence callback
//@param source array to test
//@param boolean returning function to determine if element is in sequence or not
exports.create = function (array, isInSequence) {
    var output = [];

    function getCurrentSequenceLength(i) {
        if (i >= array.length || !isInSequence(array[i])) return 0;
        else return 1 + getCurrentSequenceLength(i + 1);
    }

    function updateLengthForSequenceAt(index) {
        if (index >= array.length) return;
        var length = getCurrentSequenceLength(index);
        output.push(length);
        updateLengthForSequenceAt(index + Math.max(length, 1));
    }

    updateLengthForSequenceAt(0);
    return output;
};

//Given an array of sequence entries, returns the sequence entry at the given index.
//E.g. [4, 3, 2] at index 7 is 2 because it's [4, 4, 4, 4, 3, 3, 3, 2, 2][7] = 2
exports.getSequenceValueAtIndex = function (sequenceArray, index) {
    var currentSequenceValue, currentIndex = 0;
    
    for (var i = 0; i < sequenceArray.length; i++) {
        currentSequenceValue = sequenceArray[i];
        currentIndex += Math.max(1, currentSequenceValue);
        if (currentIndex > index) return currentSequenceValue;
    }

    return undefined;
};