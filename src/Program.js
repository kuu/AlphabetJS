/**
 * @author Jason Parrott
 *
 * Copyright (C) 2012 AlphabetJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  var AlphabetJS = global.AlphabetJS;

  AlphabetJS.Program = Program;

  function Program(pFunctionMap) {
    this.functionMap = pFunctionMap;
    this.loadedData = [];
  }

  Program.prototype.load = function(pData) {
    var tId = this.loadedData.length;

    this.loadedData[tId] = pData;

    return tId;
  };

  Program.prototype.callMapped = function(pName) {
    var tMapped = this.functionMap[pName];

    if (typeof tMapped !== 'function') {
      return;
    };

    return tMapped.apply(this, Array.prototype.slice.call(arguments, 1));
  };

  Program.prototype.run = function(pId) {
    // implement this
  };

}(this));
