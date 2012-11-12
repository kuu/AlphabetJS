/**
 * @author Jason Parrott
 *
 * Copyright (C) 2012 AlphabetJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

 (function(global) {

  var Breader = global.Breader;
  var AlphabetJS = global.AlphabetJS;

  AlphabetJS.loaders.AS1Decompiler = ASLoader;
  AlphabetJS.loaders.AS2Decompiler = ASLoader;

  function ASLoader() {

  }

  ASLoader.handlers = new Array(256);

  ASLoader.prototype = Object.create(AlphabetJS.Loader.prototype);

  ASLoader.prototype.load = function(pProgram, pActions, pFunctionMap, pVersion) {
    var tReader = new Breader(pActions);
    var tSize = tReader.fileSize;
    var tFactory = new AlphabetJS.ASTFactory(pFunctionMap);
    var tHandlers = ASLoader.handlers;

    var tActionCode;
    var tActionLength;
    var tActionHandler;

    var tCurrentAST;

    var tState = {
      startPointer: tReader.tell(),
      byteToASTMap: new Array(tSize),
      byteToASTMapIndicies: [],
      currentAST: void 0,
      byteOffset: 0,
      ifTarget: -1,
      ifTargetStack: [],
      jumpCodeOffsets: [],
      jumpTargets: [],
      tempStack: [],
      tempStackIndex: -1,
      tempStackByteOffsets: [],
      actionCode: 0,
      actionLength: 0,

      getBooleanLiteral: function(pResult) {
        if (pVersion <= 4) {
          return {
            type: 'literal',
            what: 'number',
            value: pResult ? 1 : 0
          };
        } else {
          return {
            type: 'literal',
            what: 'boolean',
            value: pResult ? true : false
          };
        }
      },

      toNumber: function(pAST, pType) {
        return {
          type: 'or',
          left: {
            type: 'call',
            value: {
              type: 'literal',
              what: 'reference',
              value: 'parse' + pType
            },
            args: [
            pAST,
            {
              type: 'literal',
              what: 'number',
              value: 10
            }
            ]
          },
          right: {
            type: 'literal',
            what: 'number',
            value: 0
          }
        };
      },

      toFloat: function(pAST) {
        return toNumber(pAST, 'Float');
      },

      toInt: function(pAST) {
        return toNumber(pAST, 'Int');
      },

      toString: function(pAST) {
        return {
          type: 'or',
          left: pAST,
          right: {
            type: 'literal',
            what: 'string',
            value: ''
          }
        };
      }
    };

    var tByteOffset = 0;
    var tFrameIndex = 0;
    var tString = '';
    var tTemp = null;
    var tTempInt = 0;
    var tResult;
    var i, il;

    var tTempStackByteOffsets = tState.tempStackByteOffsets;
    var tByteToASTMap = tState.byteToASTMap;
    var tByteToASTMapIndicies = tState.byteToASTMapIndicies;

    tFactory.add({
      type: 'declare',
      name: 'tTarget',
      value: {
        type: 'literal',
        what: 'this'
      }
    });

    while ((tByteOffset = tState.byteOffset = tReader.tell()) <= tSize) {
      tActionCode = pState.actionCode = tReader.B();
      tActionLength = 0;

      if (tActionCode > 127) {
        tActionLength = tReader.I16();
      }

      pState.actionLength = tActionLength;

      tCurrentAST = tState.currentAST = void 0;

      if (tState.byteOffset - tState.startPointer === tState.ifTarget) {
        tState.ifTarget = tState.ifTargetStack.pop();
        tFactory.leave();
      }

      tActionHandler = tHandlers[tActionCode];
      if (tActionHandler !== void 0) {
        tResult = tActionHandler(tReader, tFactory, tState);
        if (tResult === true) {
          continue;
        } else if (tResult === false) {
          break;
        }
        tCurrentAST = tState.currentAST;
      } else {
        console.warn('Unknown action code ' + tActionCode);
        tState.currentAST = {
          type: 'comment',
          value: 'Unknown tag ' + tActionCode + ' here!'
        };
      }

      if (tCurrentAST !== void 0) {
        for (i = 0, il = tTempStackByteOffsets.length; i < il; i++) {
          tTempInt = tTempStackByteOffsets[i];
          tByteToASTMap[tTempInt] = {
            ast: tCurrentAST,
            index: tByteToASTMapIndicies.push(tTempInt) - 1
          };
        }
        tTempStackByteOffsets.length = 0;

        tByteToASTMap[tByteOffset] = {
          ast: tCurrentAST,
          index: tByteToASTMapIndicies.push(tByteOffset) - 1
        };

        tFactory.add(tCurrentAST);
      } else {
        tTempStackByteOffsets.push(tByteOffset);
      }
    }

    var tTempAST;
    var tTargetAST;
    var tTempBody;
    var tIndex1, tIndex2;
    var tJumpCodeOffsets = tState.jumpCodeOffsets;
    var tJumpTargets = tState.jumpTargets;

    // After parsing everything, we resolve all jumps.
    for (i = tJumpCodeOffsets.length - 1; i >= 0; i--) {
      tByteOffset = tJumpCodeOffsets[i];
      var tASTObject = tByteToASTMap[tByteOffset];

      if (tASTObject === void 0) {
        console.error('AS Byte map is bad with offset ' + tByteOffset);
        continue;
      }

      tTempAST = tASTObject.ast;

      var tJumpOffset = tJumpTargets[i];
      var tFinalJumpTarget = tByteOffset + tJumpOffset + 5; // 5 because that is the guarunteed length of a jump instruction.

      // If code at a jump offset is an if, make it and else if.
      if (tTempAST.type === 'branch' && tTempAST.what === 'if' || tTempAST.what === 'else if') {
        if (tJumpOffset < 0) {
          tTempAST.what = 'while';
        } else {
          tTempAST.what = 'else if';
        }
        continue;
      }

      if (tJumpOffset > 0) {
        // This is an else statement.

        tTargetAST = tByteToASTMap[tByteToASTMapIndicies[tByteToASTMap[tFinalJumpTarget].index - 1]].ast;
        tTempBody = tTempAST.parent.body;
        tIndex1 = tTempBody.indexOf(tTempAST);
        tIndex2 = tTempBody.indexOf(tTargetAST);
        if (tIndex2 < 0) {
          console.error('Bad jump target for else.');
          continue;
        }

        tTempAST = {
          type: 'else'
        };

        tTempAST.body = tTempBody.splice(tIndex1, tIndex2 + 1 - tIndex1, tTempAST);
      } else {
        // The previous if was actually a while loop.
        tByteToASTMap[tFinalJumpTarget].ast.what = 'while';
      }
    }

    pProgram.run = tFactory.getFunction();
  };

}(this));
