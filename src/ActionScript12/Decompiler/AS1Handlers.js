/**
 * @author Jason Parrott
 *
 * Copyright (C) 2012 AlphabetJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

 (function(global) {

  var AlphabetJS = global.AlphabetJS;
  var mHandlers = AlphabetJS.loaders.AS1.handlers;

  // End
  mHandlers[0x00] = function(pReader, pFactory, pState) {
    var tTempStackByteOffsets = pState.tempStackByteOffsets;
    var tByteToASTMap = pState.byteToASTMap;
    var tByteToASTMapIndicies = pState.byteToASTMapIndicies;
    var i = 0, il;
    var tTempInt = 0;

    pState.currentAST = pState.astPointer[pState.astPointer.length - 1];

    for (il = tTempStackByteOffsets.length; i < il; i++) {
      tTempInt = tTempStackByteOffsets[i];
      tByteToASTMap[tTempInt] = {
        ast: tCurrentAST,
        index: tByteToASTMapIndicies.push(tTempInt) - 1
      };
    }
    tTempStackByteOffsets.length = 0;

    tByteToASTMap[pState.byteOffset] = {
      ast: tCurrentAST,
      index: tByteToASTMapIndicies.push(pState.byteOffset) - 1
    };

    return false; // break the main loop.
  };

  // NextFrame
  mHandlers[0x04] = function(pReader, pFactory, pState) {
    pState.currentAST = pFactory.createMapped('nextFrame');
  };

  // PreviousFrame
  mHandlers[0x05] = function(pReader, pFactory, pState) {
    pState.currentAST = pFactory.createMapped('previousFrame');
  };

  // Play
  mHandlers[0x06] = function(pReader, pFactory, pState) {
    pState.currentAST = pFactory.createMapped('play');
  };

  // Stop
  mHandlers[0x07] = function(pReader, pFactory, pState) {
    pState.currentAST = pFactory.createMapped('stop');
  };

  // ToggleQuality
  mHandlers[0x08] = function(pReader, pFactory, pState) {
    pState.currentAST = {
      type: 'comment',
      value: 'Unimplemented ToggleQuality here!'
    };
  };

  // StopSounds
  mHandlers[0x09] = function(pReader, pFactory, pState) {
    pState.currentAST = {
      type: 'comment',
      value: 'Unimplemented StopSounds here!'
    };
  };

  // Add
  mHandlers[0x0A] = function(pReader, pFactory, pState) {
    var tTempStack = pState.tempStack;
    var tTempStackIndex = pState.tempStackIndex;

    tTempStack[tTempStackIndex - 1] = {
      type: 'add',
      left: pState.toFloat(tTempStack[tTempStackIndex--]),
      right: pState.toFloat(tTempStack[tTempStackIndex])
    };

    pState.tempStackIndex = tTempStackIndex;
  };

  // Subtract
  mHandlers[0x0B] = function(pReader, pFactory, pState) {
    var tTempStack = pState.tempStack;
    var tTempStackIndex = pState.tempStackIndex;

    tTempStack[tTempStackIndex - 1] = {
      type: 'subtract',
      right: pState.toFloat(tTempStack[tTempStackIndex--]),
      left: pState.toFloat(tTempStack[tTempStackIndex])
    };

    pState.tempStackIndex = tTempStackIndex;
  };

  // Multiply
  mHandlers[0x0C] = function(pReader, pFactory, pState) {
    var tTempStack = pState.tempStack;
    var tTempStackIndex = pState.tempStackIndex;

    tTempStack[tTempStackIndex - 1] = {
      type: 'multiply',
      left: pState.toFloat(tTempStack[tTempStackIndex--]),
      right: pState.toFloat(tTempStack[tTempStackIndex])
    };

    pState.tempStackIndex = tTempStackIndex;
  };

  // Divide
  mHandlers[0x0D] = function(pReader, pFactory, pState) {
    var tTempStack = pState.tempStack;
    var tTempStackIndex = pState.tempStackIndex;

    tTempStack[tTempStackIndex - 1] = {
      type: 'divide',
      right: pState.toFloat(tTempStack[tTempStackIndex--]),
      left: pState.toFloat(tTempStack[tTempStackIndex])
    };

    pState.tempStackIndex = tTempStackIndex;
  };

  // Equals
  mHandlers[0x0E] = function(pReader, pFactory, pState) {
    var tTempStack = pState.tempStack;
    var tTempStackIndex = pState.tempStackIndex;

    tTempStack[tTempStackIndex - 1] = {
      type: 'equals',
      left: pState.toFloat(tTempStack[tTempStackIndex--]),
      right: pState.toFloat(tTempStack[tTempStackIndex])
    };

    pState.tempStackIndex = tTempStackIndex;
  };

  // Less
  mHandlers[0x0F] = function(pReader, pFactory, pState) {
    var tTempStack = pState.tempStack;
    var tTempStackIndex = pState.tempStackIndex;

    tTempStack[tTempStackIndex - 1] = {
      type: 'less',
      right: pState.toFloat(tTempStack[tTempStackIndex--]),
      left: pState.toFloat(tTempStack[tTempStackIndex])
    };

    pState.tempStackIndex = tTempStackIndex;
  };

  // And
  mHandlers[0x10] = function(pReader, pFactory, pState) {
    var tTempStack = pState.tempStack;
    var tTempStackIndex = pState.tempStackIndex;

    tTempStack[tTempStackIndex - 1] = {
      type: 'and',
      left: pState.toFloat(tTempStack[tTempStackIndex--]),
      right: pState.toFloat(tTempStack[tTempStackIndex])
    };

    pState.tempStackIndex = tTempStackIndex;
  };

  // Or
  mHandlers[0x11] = function(pReader, pFactory, pState) {
    var tTempStack = pState.tempStack;
    var tTempStackIndex = pState.tempStackIndex;

    tTempStack[tTempStackIndex - 1] = {
      type: 'or',
      left: pState.toFloat(tTempStack[tTempStackIndex--]),
      right: pState.toFloat(tTempStack[tTempStackIndex])
    };

    pState.tempStackIndex = tTempStackIndex;
  };

  // Not
  mHandlers[0x12] = function(pReader, pFactory, pState) {
    var tTempStack = pState.tempStack;
    var tTempStackIndex = pState.tempStackIndex;

    tTempStack[tTempStackIndex] = {
      type: 'not',
      value: pState.toFloat(tTempStack[tTempStackIndex]),
    };
  };

  // StringEquals
  mHandlers[0x13] = function(pReader, pFactory, pState) {
    var tTempStack = pState.tempStack;
    var tTempStackIndex = pState.tempStackIndex;

    tTempStack[tTempStackIndex - 1] = {
      type: 'equals',
      left: pState.toString(tTempStack[tTempStackIndex--]),
      right: pState.toString(tTempStack[tTempStackIndex])
    };

    pState.tempStackIndex = tTempStackIndex;
  };

  // Pop
  mHandlers[0x17] = function(pReader, pFactory, pState) {
    pState.currentAST = pState.tempStack[pState.tempStackIndex--];
  };

  // ToInteger
  mHandlers[0x18] = function(pReader, pFactory, pState) {
    var tTempStack = pState.tempStack;
    var tTempStackIndex = pState.tempStackIndex;

    tTempStack[tTempStackIndex] = {
      type: 'call',
      value: {
        type: 'raw',
        value: 'Math.floor'
      },
      args: [
        tTempStack[tTempStackIndex]
      ]
    };
  };

  // GetVariable
  mHandlers[0x1C] = function(pReader, pFactory, pState) {
    var tTempStack = pState.tempStack;
    var tTempStackIndex = pState.tempStackIndex;

    tTempStack[tTempStackIndex] = pFactory.createMapped('getVariable', {
      name: tTempStack[tTempStackIndex]
    });
  };

  // SetVariable
  mHandlers[0x1D] = function(pReader, pFactory, pState) {
    var tTempStack = pState.tempStack;
    var tTempStackIndex = pState.tempStackIndex;

    pState.currentAST = pFactory.createMapped('setVariable', {
      value: tTempStack[tTempStackIndex--],
      name: tTempStack[tTempStackIndex--]
    });

    pState.tempStackIndex = tTempStackIndex;
  };

  // StringAdd
  mHandlers[0x21] = function(pReader, pFactory, pState) {
    var tTempStack = pState.tempStack;
    var tTempStackIndex = pState.tempStackIndex;

    tTempStack[tTempStackIndex - 1] = {
      type: 'add',
      right: pState.toString(tTempStack[tTempStackIndex--]),
      left: pState.toString(tTempStack[tTempStackIndex])
    };

    pState.tempStackIndex = tTempStackIndex;
  };

  // GetProperty
  mHandlers[0x22] = function(pReader, pFactory, pState) {
    var tTempStack = pState.tempStack;
    var tTempStackIndex = pState.tempStackIndex;

    tTempStack[tTempStackInde - 1] = pFactory.createMapped('getProperty', {
      property: pState.toInt(tTempStack[tTempStackIndex--]),
      name: pState.toString(tTempStack[tTempStackIndex--])
    });

    pState.tempStackIndex = tTempStackIndex;
  };

  // SetProperty
  mHandlers[0x23] = function(pReader, pFactory, pState) {
    var tTempStack = pState.tempStack;
    var tTempStackIndex = pState.tempStackIndex;

    pState.currentAST = pFactory.createMapped('setProperty', {
      value: tTempStack[tTempStackIndex--],
      property: pState.toInt(tTempStack[tTempStackIndex--]),
      name: pState.toString(tTempStack[tTempStackIndex])
    });

    pState.tempStackIndex = tTempStackIndex;
  };

  // CloneSprite
  mHandlers[0x24] = function(pReader, pFactory, pState) {
    var tTempStack = pState.tempStack;
    var tTempStackIndex = pState.tempStackIndex;

    pState.currentAST = pFactory.createMapped('cloneSprite', {
      depth: pState.toInt(tTempStack[tTempStackIndex--]),
      target: pState.toString(tTempStack[tTempStackIndex--]),
      name: pState.toString(tTempStack[tTempStackIndex--])
    });

    pState.tempStackIndex = tTempStackIndex;
  };

  // RemoveSprite
  mHandlers[0x25] = function(pReader, pFactory, pState) {
    var tTempStack = pState.tempStack;
    var tTempStackIndex = pState.tempStackIndex;

    pState.currentAST = pFactory.createMapped('removeSprite', {
      name: pState.toString(tTempStack[tTempStackIndex--])
    });

    pState.tempStackIndex = tTempStackIndex;
  };

  // Trace
  mHandlers[0x26] = function(pReader, pFactory, pState) {
    var tTempStack = pState.tempStack;
    var tTempStackIndex = pState.tempStackIndex;

    pState.currentAST = pFactory.createMapped('trace', {
      message: tTempStack[pState.tempStackIndex--]
    });
  };

  // StartDrag
  mHandlers[0x27] = function(pReader, pFactory, pState) {
    pState.currentAST = {
      type: 'comment',
      value: 'Unimplemented StartDrag here!'
    };
  };

  // EndDrag
  mHandlers[0x28] = function(pReader, pFactory, pState) {
    pState.currentAST = {
      type: 'comment',
      value: 'Unimplemented EndDrag here!'
    };
  };

  // StringLess
  mHandlers[0x29] = function(pReader, pFactory, pState) {
    var tTempStack = pState.tempStack;
    var tTempStackIndex = pState.tempStackIndex;

    tTempStack[tTempStackIndex - 1] = {
      type: 'less',
      right: pState.toString(tTempStack[tTempStackIndex--]),
      left: pState.toString(tTempStack[tTempStackIndex])
    };

    pState.tempStackIndex = tTempStackIndex;
  };

  // FSCommand2
  mHandlers[0x2D] = function(pReader, pFactory, pState) {
    var tTempStack = pState.tempStack;
    var tTempStackIndex = pState.tempStackIndex;

    // We are hoping that the next value is a literal.
    // As we are executing this AST in a non-runtime context
    // things could blow up bad here. (this is also why
    // we are not passing a function map)
    var tTempFactory = new AlphabetJS.ASTFactory();
    tTempFactory.add(tTempStack[tTempStackIndex--]);

    var tNumberOfArguments = (parseInt(tTempFactory.getFunction()(), 10) || 1) - 1;

    tTempStack[tTempStackIndex - tNumberOfArguments] = pFactory.createMapped('fscommand2', {
      name: tTempStack[tTempStackIndex],
      args: {
        type: 'literal',
        what: 'array',
        value: tTempStack
          .slice(tTempStackIndex - tNumberOfArguments, tTempStackIndex)
          .reverse()
      }
    });

    tTempStackIndex -= tNumberOfArguments;

    pState.tempStackIndex = tTempStackIndex;
  };

  // RandomNumber
  mHandlers[0x30] = function(pReader, pFactory, pState) {
    var tTempStack = pState.tempStack;
    var tTempStackIndex = pState.tempStackIndex;

    tTempStack[tTempStackIndex] = {
      type: 'raw',
      value: '((Math.random() * (' + pFactory.createJavaScript(pState.toFloat(tTempStack[tTempStackIndex])) + ' - 1)) + 0.5) | 0'
    };
  };

  // StringLength, MBStringLength
  mHandlers[0x14] = mHandlers[0x31] = function(pReader, pFactory, pState) {
    var tTempStack = pState.tempStack;
    var tTempStackIndex = pState.tempStackIndex;

    tTempStack[tTempStackIndex] = {
      type: 'property',
      left: pState.toString(tTempStack[tTempStackIndex]),
      right: {
        type: 'literal',
        what: 'string',
        value: 'length'
      }
    };
  };

  // CharToAscii
  mHandlers[0x32] = function(pReader, pFactory, pState) {
    pState.currentAST = {
      type: 'comment',
      value: 'Unimplemented CharToAscii here!'
    };
  };

  // AsciiToChar
  mHandlers[0x33] = function(pReader, pFactory, pState) {
    pState.currentAST = {
      type: 'comment',
      value: 'Unimplemented AsciiToChar here!'
    };
  };

  // GetTime
  mHandlers[0x34] = function(pReader, pFactory, pState) {
    pState.currentAST = {
      type: 'comment',
      value: 'Unimplemented GetTime here!'
    };
  };

  // StringExtract, MBStringExtract
  mHandlers[0x15] = mHandlers[0x35] = function(pReader, pFactory, pState) {
    var tTempStack = pState.tempStack;
    var tTempStackIndex = pState.tempStackIndex;

    var tCount = tTempStack[tTempStackIndex--];

    tTempStack[tTempStackIndex - 1] = {
      type: 'call',
      args: [
        {
          type: 'subtract',
          left: pState.toInt(tTempStack[tTempStackIndex--]), // index
          right: {
            type: 'literal',
            what: 'number',
            value: 1
          }
        },
        tCount
      ],
      value: {
        type: 'property',
        left: pState.toString(tTempStack[tTempStackIndex]),
        right: {
          type: 'literal',
          what: 'string',
          value: 'substr'
        }
      }
    };

    pState.tempStackIndex = tTempStackIndex;
  };

  // MBCharToAscii
  mHandlers[0x36] = function(pReader, pFactory, pState) {
    pState.currentAST = {
      type: 'comment',
      value: 'Unimplemented MBCharToAscii here!'
    };
  };

  // MBAsciiToChar
  mHandlers[0x37] = function(pReader, pFactory, pState) {
    pState.currentAST = {
      type: 'comment',
      value: 'Unimplemented MBAsciiToChar here!'
    };
  };

  // GoToFrame
  mHandlers[0x81] = function(pReader, pFactory, pState) {
    pState.currentAST = pFactory.createMapped('gotoFrame', {
      frame: {
        type: 'literal',
        what: 'number',
        value: pReader.I16()
      }
    });
  };

  // GetURL
  mHandlers[0x83] = function(pReader, pFactory, pState) {
    pReader.s(); // UrlString: The target URL string
    pReader.s(); // TargetString: The target string. _level0 and _level1 loads SWF files to special area.

    pState.currentAST = {
      type: 'comment',
      value: 'Unimplemented GetURL here!'
    };
  };

  // WaitForFrame
  mHandlers[0x8A] = function(pReader, pFactory, pState) {
    pReader.I16(); // The number of frames to wait for.
    pReader.B(); // SkipCount: The number of actions to skip if frame is not loaded.

    pState.currentAST = {
      type: 'comment',
      value: 'Unimplemented WaitForFrame here!'
    };
  };

  // SetTarget, SetTarget2
  mHandlers[0x8B] = mHandlers[0x20] = function(pReader, pFactory, pState) {
    pState.currentAST = {
      type: 'assign',
      left: {
        type: 'literal',
        what: 'reference',
        value: 'tTarget'
      },
      right: pFactory.createMapped('setTarget', {
        target: pState.actionCode === 0x8B ? {
          type: 'literal',
          what: 'string',
          value: pReader.s()
        } : pState.toString(pState.tempStack[pState.tempStackIndex--])
      })
    };
  };

  // GoToLabel
  mHandlers[0x8C] = function(pReader, pFactory, pState) {
    pState.currentAST = pFactory.createMapped('gotoLabel', {
      frame: {
        type: 'literal',
        what: 'string',
        value: pReader.s()
      }
    });
  };

  // WaitForFrame2
  mHandlers[0x8D] = function(pReader, pFactory, pState) {
    pReader.B(); // SkipCount: The number of actions to skip if frame is not loaded.

    pState.currentAST = {
      type: 'comment',
      value: 'Unimplemented WaitForFrame2 here!'
    };
  };

  // Push
  mHandlers[0x96] = function(pReader, pFactory, pState) {
    var tPushValue;
    var tPushWhat;

    // TODO: Is it possible to have multiple pushes in a single push command?? Until the end of the length
    switch (pReader.B()) {
      case 0: // String literal
        tPushValue = pReader.s();
        tPushWhat = 'string';
        break;
      case 1: // Floating Point literal
        tPushValue = pReader.F32();
        tPushWhat = 'number';
        break;
      case 4: // Register Number
        tPushValue = pReader.B();
        tPushWhat = 'number';
        break;
      case 5: // Boolean
        tPushValue = pReader.B() ? true : false;
        tPushWhat = 'boolean';
        break;
      case 6: // Double
        tPushValue = pReader.F64();
        tPushWhat = 'number';
        break;
      case 7: // Integer
        tPushValue = pReader.I32();
        tPushWhat = 'number';
        break;
      case 8: // Constant8: For constant pool index < 256
        tPushValue = pReader.B();
        tPushWhat = 'number';
        break;
      case 9: // Constant16: For constant pool index >= 256
        tPushValue = pReader.I16();
        tPushWhat = 'number';
        break;
    }

    pState.tempStack[++pState.tempStackIndex] = {
      type: 'literal',
      what: tPushWhat,
      value: tPushValue
    };
  };

  // Jump
  mHandlers[0x99] = function(pReader, pFactory, pState) {
    pState.jumpCodeOffsets.push(pState.byteOffset);
    pState.jumpTargets.push(pReader.SI16());
  };

   // GetURL2
  mHandlers[0x9A] = function(pReader, pFactory, pState) {
    pReader.bp(2); // SendVarsMethod (0 = none, 1 = GET, 2 = POST)
    pReader.bp(4); // Reserved
    pReader.bp(1); // LoadTargetFlag (0 = target is a browser window, 1 = target is a path to sprite)
    pReader.bp(1); // LoadVariablesFlag (0 = no variables to load, 1 = load variables)
    pReader.a();

    pState.currentAST = {
      type: 'comment',
      value: 'Unimplemented GetURL2 here!'
    };
  };

  // If
  mHandlers[0x9D] = function(pReader, pFactory, pState) {
    var tByteOffset = pState.byteOffset;
    var tTempStack = pState.tempStack;
    var tTempStackIndex = pState.tempStackIndex;
    var tByteToASTMap = pState.byteToASTMap;
    var tByteToASTMapIndicies = pState.byteToASTMapIndicies;
    var tTempStackByteOffsets = pState.tempStackByteOffsets;
    var tTempInt;

    /*
     * - on if, create if node.
     * -- Code is all ast up to jump offset.
     * - if code at jump offset is an if, make elseif node.
     * -- Repeat from if.
     * - otherwise if previous ast was +jump, add else node until offset.
     * - otherwise if previous ast was -jump, change node to while.
     * - if -jump and next ast is not the current if's offset, add continue.
     * - if +jump and next ast is not the current if's offset, add break.
     */
    pState.ifTargetStack.push(pState.ifTarget);
    pState.ifTarget = tByteOffset + pReader.SI16() + pState.actionLength + 3;

    var tTemp = {
      type: 'branch',
      what: 'if',
      condition: tTempStack[tTempStackIndex--],
      body: []
    };

    pFactory.add(tTemp);
    pFactory.enter(tTemp);

    for (var i = 0, il = tTempStackByteOffsets.length; i < il; i++) {
      tTempInt = tTempStackByteOffsets[i];
      tByteToASTMap[tTempInt] = {
        ast: tTemp,
        index: tByteToASTMapIndicies.push(tTempInt) - 1
      };
    }
    tTempStackByteOffsets.length = 0;

    tByteToASTMap[tByteOffset] = {
      ast: tTemp,
      index: tByteToASTMapIndicies.push(tByteOffset) - 1
    };

    pState.tempStackIndex = tTempStackIndex;

    return true; // continue to main loop.
  };

  // Call
  mHandlers[0x9E] = function(pReader, pFactory, pState) {
    pState.currentAST = pFactory.createMapped('call', {
      frame: pState.tempStack[pState.tempStackIndex--]
    });
  };

  // GoToFrame2
  mHandlers[0x9F] = function(pReader, pFactory, pState) {
    pReader.bp(6); // Reserved

    var tSceneBias = pReader.bp(1); // SceneBiasFlag

    pReader.bp(1); // Play flag (0 = goto and stop, 1 = goto and play)

    pReader.a();

    if (tSceneBias === 1) {
      tSceneBias = pReader.I16(); // SceneBias (Number to be added to frame determined by stack argument)
    }

    pState.currentAST = pFactory.createMapped('gotoFrameOrLabel', {
      frame: pState.tempStack[pState.tempStackIndex--],
      bias: {
        type: 'literal',
        what: 'number',
        value: tSceneBias
      }
    });
  };

}(this));