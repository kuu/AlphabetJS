/**
 * @author Jason Parrott
 *
 * Copyright (C) 2012 AlphabetJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  var Breader = global.Breader;
  var mProto = Breader.prototype;

  mProto.ABCVUI30 = function() {
    var tValue = 0;
    var tByte;
    var i;
    var tBuffer = this.b;
    var tIndex = this.i;

    for (i = 0; i < 6; i++) {
      tByte = tBuffer[tIndex++];
      tValue |= (tByte & 0x7F) << i;
      if (tByte >>> 7 === 0) {
        this.i = tIndex;
        return tValue;
      }
    }

    this.i = tIndex;

    return tValue;
  };

  mProto.ABCVUI32 = function() {
    var tValue = 0;
    var tByte;
    var i;
    var tBuffer = this.b;
    var tIndex = this.i;

    for (i = 0; i < 6; i++) {
      tByte = tBuffer[tIndex++];
      tValue |= (tByte & 0x7F) << i;
      if (tByte >>> 7 === 0) {
        this.i = tIndex;
        return tValue;
      }
    }

    this.i = tIndex;

    return tValue;
  };

  mProto.ABCVSI32 = function() {
    var tValue = 0;
    var tByte;
    var i;
    var tBuffer = this.b;
    var tIndex = this.i;

    for (i = 0; i < 6; i++) {
      tByte = tBuffer[tIndex++];
      tValue |= (tByte & 0x7F) << i;
      if (tByte >>> 7 === 0) {
        this.i = tIndex;
        return tValue;
      }
    }

    if (tValue >> 31 === 1) {
      tValue -= Math.pow(2, 32) - 1;
    }

    this.i = tIndex;

    return tValue;
  };

  mProto.ABCs = function() {
    var tLength = this.ABCVUI30();
    return this.sp(tLength);
  };

  mProto.getArray = function(pFunction, pLength) {
    var tReturn = new Array(pLength);
    for (var i = 0; i < pLength; i++) {
      tReturn[i] = pFunction.call(this);
    }
    return tReturn;
  };

  mProto.getArrays = function(pFunctions, pLength) {
    var tReturn = new Array(pLength);
    var tFunctionsLength = pFunctions.length;
    var i, j;

    for (i = 0; i < pLength; i++) {
      tReturn[i] = new Array(tFunctionsLength);
      for (j = 0; j < tFunctionsLength; j++) {
        tReturn[i][j] = pFunctions[j].call(this);
      }
    }
    return tReturn;
  };

}(this));