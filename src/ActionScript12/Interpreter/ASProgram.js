/**
 * @author Jason Parrott
 *
 * Copyright (C) 2012 AlphabetJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  var AlphabetJS = global.AlphabetJS;
  var Breader = global.Breader;

  var parseFloat = global.parseFloat;
  var parseInt = global.parseInt;

  /**
   * @class
   * @extends {AlphabetJS.Program}
   */
  var ASProgram = (function(pSuper) {
    function ASProgram(pFunctionMap) {
      pSuper.call(this, pFunctionMap);
      this.target = null;
      this.targetStack = [];
      this.reader = null;
      this.version = 0;
      this.stack = [];
      this.stackIndex = 0;
      this.stateStack = [];
      this.runCounter = 0;
    }

    ASProgram.prototype = Object.create(pSuper.prototype);

    return ASProgram;
  })(AlphabetJS.Program);

  AlphabetJS.programs.AS1VM = ASProgram;
  AlphabetJS.programs.AS2VM = ASProgram;

  ASProgram.handlers = new Array(256);

  ASProgram.prototype.reset = function() {
    this.target = null;
    this.targetStack = [];
    this.reader = null;
    this.version = 0;
    this.stack = [];
    this.stackIndex = 0;
    this.stateStack = [];
    this.runCounter = 0;
  };

  ASProgram.prototype.push = function(pValue) {
    this.stack[this.stackIndex++] = pValue;
  }

  ASProgram.prototype.pop = function() {
    return this.stack[--this.stackIndex];
  }

  ASProgram.prototype.toFloat = function(pValue) {
    return parseFloat(pValue, 10) || 0;
  };

  ASProgram.prototype.toInt = function(pValue) {
    return parseInt(pValue, 10) || 0;
  };

  ASProgram.prototype.toString = function(pValue) {
    return pValue || '';
  };

  ASProgram.prototype.run = function(pId, pTarget) {
    var tASData = this.loadedData[pId];

    if (tASData === void 0) {
      return;
    }

    if (this.runCounter++ === 0) {
      this.target = pTarget;
    }

    var tActions = tASData.actions;
    var tVersion = this.version = tASData.version;

    var tReader = this.reader = new Breader(tActions);
    var tSize = tReader.fileSize;
    var tHandlers = ASProgram.handlers;

    var tActionCode;
    var tActionLength;
    var tActionHandler;

    var tResult;

    while (tReader.tell() <= tSize) {
      tActionCode = tReader.B();
      tActionLength = 0;

      if (tActionCode > 127) {
        tActionLength = tReader.I16();
      }

      tActionHandler = tHandlers[tActionCode];
      if (tActionHandler !== void 0) {
        tResult = tActionHandler.call(this, tActionCode, tActionLength);
        if (tResult === true) {
          continue;
        } else if (tResult === false) {
          break;
        }
      } else {
        console.warn('Unknown action code ' + tActionCode);
      }
    }

    if (--this.runCounter === 0) {
      this.reset();
    }
  };

  ASProgram.prototype.setTarget = function(pSelector) {
    if (!pSelector) {
      if (this.targetStack.length > 0) {
        this.target = this.targetStack.pop();
      }
    } else {
      var tNewTarget = this.functionMap.GetTargetAndData.call(this, pSelector).target;
      this.targetStack.push(this.target);
      this.target = tNewTarget;
    }
  };

}(this));
