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
    this.resetState();
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
    if (typeof pValue === 'number') {
      return pValue;
    } else if (typeof pValue === 'boolean') {
      return pValue ? 1 : 0;
    }
    return parseFloat(pValue, 10) || 0;
  };

  ASProgram.prototype.toInt = function(pValue) {
    if (typeof pValue === 'number') {
      return pValue;
    } else if (typeof pValue === 'boolean') {
      return pValue ? 1 : 0;
    }
    return parseInt(pValue, 10) || 0;
  };

  ASProgram.prototype.toString = function(pValue) {
    if (typeof pValue === 'string') {
      return pValue;
    } else if (typeof pValue === 'number') {
      return pValue + '';
    }
    return '';
  };

  ASProgram.prototype.resetState = function() {
    this.target = null;
    this.targetStack = [];
    this.reader = null;
    this.version = 0;
    this.stack = [];
    this.stackIndex = 0;
  }

  ASProgram.prototype.pushState = function() {
    this.stateStack.push({
      target: this.target,
      targetStack : this.targetStack,
      reader: this.reader,
      version: this.version,
      stack: this.stack,
      stackIndex: this.stackIndex
    });
  };

  ASProgram.prototype.popState = function() {
    var tState = this.stateStack.pop();
    this.target = tState.target;
    this.targetStack = tState.targetStack;
    this.reader = tState.reader;
    this.version = tState.version;
    this.stack = tState.stack;
    this.stackIndex = tState.stackIndex;
  };

  ASProgram.prototype.run = function(pId, pTarget) {
    var tASData = this.loadedData[pId];

    if (tASData === void 0) {
      return;
    }

    if (this.runCounter++ !== 0) {
      this.pushState();
      this.resetState();
    }

    this.target = pTarget;

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
    } else {
      this.popState();
    }
  };

  ASProgram.prototype.getLastValidTarget = function() {
    if (this.target !== null) {
      return this.target;
    } else {
      var tTargetStack = this.targetStack;
      for (var i = tTargetStack.length - 1; i >= 0; i--) {
        if (tTargetStack[i] !== null) {
          return tTargetStack[i];
        }
      }

      return null;
    }
  }

  ASProgram.prototype.setTarget = function(pSelector) {
    if (!pSelector) {
      if (this.targetStack.length > 0) {
        this.target = this.targetStack.pop();
      }
    } else {
      var tNewTarget = this.functionMap.GetTargetAndData.call(this, pSelector, this.target).target;
      this.targetStack.push(this.target);
      this.target = tNewTarget;
    }
  };

}(this));
