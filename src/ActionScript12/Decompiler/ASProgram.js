/**
 * @author Jason Parrott
 *
 * Copyright (C) 2012 AlphabetJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  var AlphabetJS = global.AlphabetJS;

  /**
   * @class
   * @extends {AlphabetJS.Program}
   */
  var ASProgram = (function(pSuper) {
    function ASProgram(pFunctionMap) {
      pSuper.call(this, pFunctionMap);
      this.target = null;
      this.targetStack = [];
    }

    ASProgram.prototype = Object.create(pSuper.prototype);

    return ASProgram;
  })(AlphabetJS.Program);

  AlphabetJS.programs.AS1Decompiler = ASProgram;
  AlphabetJS.programs.AS2Decompiler = ASProgram;

  ASProgram.prototype.run = function(pId, pTarget) {
    var tActions = this.loadedData[pId];

    if (tActions === void 0) {
      return;
    }

    this.target = pTarget;
    this.targetStack.length = 0;
    tActions.call(this, pTarget);
    this.targetStack.length = 0;
    this.target = null;
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
