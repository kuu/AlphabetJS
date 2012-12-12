/**
 * @author Jason Parrott
 *
 * Copyright (C) 2012 AlphabetJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

 (function(global) {

  var AlphabetJS = global.AlphabetJS;
  var mHandlers = AlphabetJS.loaders.AS1Decompiler.handlers;

  // End
  mHandlers[0x00] = function(pReader, pFactory, pState) {
    var tTempStackByteOffsets = pState.tempStackByteOffsets;
    var tByteToASTMap = pState.byteToASTMap;
    var tByteToASTMapIndicies = pState.byteToASTMapIndicies;
    var i = 0, il;
    var tTempInt = 0;

    var tCurrentAST = pFactory.astPointer[pFactory.astPointer.length - 1];

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
    pState.add(pFactory.createMapped('NextFrame'));
    pState.add(pFactory.createMapped('Stop'));
  };

  // PreviousFrame
  mHandlers[0x05] = function(pReader, pFactory, pState) {
    pState.add(pFactory.createMapped('PreviousFrame'));
    pState.add(pFactory.createMapped('Stop'));
  };

  // Play
  mHandlers[0x06] = function(pReader, pFactory, pState) {
    pState.add(pFactory.createMapped('Play'));
  };

  // Stop
  mHandlers[0x07] = function(pReader, pFactory, pState) {
    pState.add(pFactory.createMapped('Stop'));
  };

  // ToggleQuality
  mHandlers[0x08] = function(pReader, pFactory, pState) {
    pState.add(pFactory.createMapped('ToggleQuality'));
  };

  // StopSounds
  mHandlers[0x09] = function(pReader, pFactory, pState) {
    pState.add(pFactory.createMapped('StopSounds'));
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
    pState.add(pState.tempStack[pState.tempStackIndex--]);
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

    tTempStack[tTempStackIndex] = pFactory.createMapped('GetVariable', [
      pState.toString(tTempStack[tTempStackIndex]) //name
    ]);
  };

  // SetVariable
  mHandlers[0x1D] = function(pReader, pFactory, pState) {
    var tTempStack = pState.tempStack;
    var tTempStackIndex = pState.tempStackIndex;

    var tValue = tTempStack[tTempStackIndex--];
    var tName = pState.toString(tTempStack[tTempStackIndex--]);

    pState.add(pFactory.createMapped('SetVariable', [
      tName,
      tValue
    ]));

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

    var tProperty = pState.toInt(tTempStack[tTempStackIndex--]);
    var tName = pState.toString(tTempStack[tTempStackIndex--], true);

    tTempStack[tTempStackIndex - 1] = pFactory.createMapped('GetProperty', [
      tName,
      tProperty
    ]);

    pState.tempStackIndex = tTempStackIndex;
  };

  // SetProperty
  mHandlers[0x23] = function(pReader, pFactory, pState) {
    var tTempStack = pState.tempStack;
    var tTempStackIndex = pState.tempStackIndex;

    var tValue = tTempStack[tTempStackIndex--];
    var tProperty = pState.toInt(tTempStack[tTempStackIndex--]);
    var tName = pState.toString(tTempStack[tTempStackIndex], true);

    pState.add(pFactory.createMapped('SetProperty', [
      tName,
      tProperty,
      tValue
    ]));

    pState.tempStackIndex = tTempStackIndex;
  };

  // CloneSprite
  mHandlers[0x24] = function(pReader, pFactory, pState) {
    var tTempStack = pState.tempStack;
    var tTempStackIndex = pState.tempStackIndex;

    var tDepth = pState.toInt(tTempStack[tTempStackIndex--]);
    var tTarget = pState.toString(tTempStack[tTempStackIndex--], true);
    var tName = pState.toString(tTempStack[tTempStackIndex--], true);

    pState.add(pFactory.createMapped('CloneSprite', [
      tTarget,
      tDepth,
      tName
    ]));

    pState.tempStackIndex = tTempStackIndex;
  };

  // RemoveSprite
  mHandlers[0x25] = function(pReader, pFactory, pState) {
    pState.add(pFactory.createMapped('RemoveSprite', [
      pState.toString(pState.tempStack[pState.tempStackIndex--], true) //name
    ]));
  };

  // Trace
  mHandlers[0x26] = function(pReader, pFactory, pState) {
    pState.add(pFactory.createMapped('Trace', [
      pState.tempStack[pState.tempStackIndex--]
    ]));
  };

  // StartDrag
  mHandlers[0x27] = function(pReader, pFactory, pState) {
    pState.add(pFactory.createMapped('StartDrag'));
  };

  // EndDrag
  mHandlers[0x28] = function(pReader, pFactory, pState) {
    pState.add(pFactory.createMapped('EndDrag'));
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

    tTempStack[tTempStackIndex - tNumberOfArguments] = pFactory.createMapped('FSCommand2', [
      tTempStack[tTempStackIndex], //name
      { //args
        type: 'literal',
        what: 'array',
        value: tTempStack
          .slice(tTempStackIndex - tNumberOfArguments, tTempStackIndex)
          .reverse()
      }
    ]);

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
    var tTempStack = pState.tempStack;
    var tTempStackIndex = pState.tempStackIndex;

    console.warn('Unimplemented CharToAscii');
  };

  // AsciiToChar
  mHandlers[0x33] = function(pReader, pFactory, pState) {
    var tTempStack = pState.tempStack;
    var tTempStackIndex = pState.tempStackIndex;

    console.warn('Unimplemented AsciiToChar');
  };

  // GetTime
  mHandlers[0x34] = function(pReader, pFactory, pState) {
    pState.tempStack[++pState.tempStackIndex] = {
      type: 'raw',
      value: '(Date.now() - ' + Date.now() + ')'
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
    console.warn('Unimplemented MBCharToAscii');
  };

  // MBAsciiToChar
  mHandlers[0x37] = function(pReader, pFactory, pState) {
    console.warn('Unimplemented MBAsciiToChar');
  };

  // GoToFrame
  mHandlers[0x81] = function(pReader, pFactory, pState) {
    pState.add(pFactory.createMapped('GoToFrame', [
      {
        type: 'literal',
        what: 'number',
        value: pReader.I16()
      }
    ]));

    pState.add(pFactory.createMapped('Stop'));
  };

  // GetURL
  mHandlers[0x83] = function(pReader, pFactory, pState) {
    pState.add(pFactory.createMapped('GetURL', [
      {
        type: 'literal',
        what: 'string',
        value: pReader.s() // UrlString: The target URL string
      },
      {
        type: 'literal',
        what: 'string',
        value: pReader.s() // TargetString: The target string. _level0 and _level1 loads SWF files to special area.
      }
    ]));
  };

  // WaitForFrame
  mHandlers[0x8A] = function(pReader, pFactory, pState) {
    pState.add(pFactory.createMapped('WaitForFrame', [
      {
        type: 'literal',
        what: 'number',
        value: pReader.I16() // The number of frames to wait for.
      },
      {
        type: 'literal',
        what: 'number',
        value: pReader.B() // SkipCount: The number of actions to skip if frame is not loaded.
      }
    ]));
  };

  // SetTarget, SetTarget2
  mHandlers[0x8B] = mHandlers[0x20] = function(pReader, pFactory, pState) {
    pState.add({
      type: 'call',
      value: {
        type: 'property',
        left: {
          type: 'literal',
          what: 'this'
        },
        right: {
          type: 'literal',
          what: 'string',
          value: 'setTarget'
        }
      },
      args: [
        pState.actionCode === 0x8B ?
          {
            type: 'literal',
            what: 'string',
            value: pReader.s()
          } :
          pState.toString(pState.tempStack[pState.tempStackIndex--], true)
      ]
    });
  };

  // GoToLabel
  mHandlers[0x8C] = function(pReader, pFactory, pState) {
    pState.add(pFactory.createMapped('GoToLabel', [
      {
        type: 'literal',
        what: 'string',
        value: pReader.s()
      }
    ]));

    pState.add(pFactory.createMapped('Stop'));
  };

  // WaitForFrame2
  mHandlers[0x8D] = function(pReader, pFactory, pState) {
    pState.add(pFactory.createMapped('WaitForFrame2', [
      {
        type: 'literal',
        what: 'number',
        value: pReader.B() // SkipCount: The number of actions to skip if frame is not loaded.
      }
    ]));
  };

  // Push
  mHandlers[0x96] = function(pReader, pFactory, pState) {
    var tPushValue;
    var tPushWhat;
    var tStartIndex = pReader.tell();
    var tActionLength = pState.actionLength;

    while (pReader.tell() - tStartIndex < tActionLength) {
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
        case 255: // 255 is internally used for asynchronously decoded string literals.
          pState.tempStack[++pState.tempStackIndex] = pFactory.createMapped('GetPushString', [
            pState.toString(tReader.I16())
          ]);
          continue;
      }

      pState.tempStack[++pState.tempStackIndex] = {
        type: 'literal',
        what: tPushWhat,
        value: tPushValue
      };
    }
  };

  // Jump
  mHandlers[0x99] = function(pReader, pFactory, pState) {
    pState.jumpCodeOffsets.push(pState.byteOffset);
    pState.jumpTargets.push(pReader.SI16());
  };

   // GetURL2
  mHandlers[0x9A] = function(pReader, pFactory, pState) {
    var tTempStack = pState.tempStack;
    var tTempStackIndex = pState.tempStackIndex;

    var tSendVarsMethod = pReader.bp(2); // SendVarsMethod (0 = none, 1 = GET, 2 = POST)
    pReader.bp(4); // Reserved
    var tLoadTargetFlag = pReader.bp(1); // LoadTargetFlag (0 = target is a browser window, 1 = target is a path to sprite)
    var tLoadVariablesFlag = pReader.bp(1); // LoadVariablesFlag (0 = no variables to load, 1 = load variables)
    pReader.a();

    var tTarget = pState.toString(tTempStack[tTempStackIndex--]);
    var tURL = pState.toString(tTempStack[tTempStackIndex--]);

    pState.add(pFactory.createMapped('GetURL2', [
      tTarget,
      tURL,
      {
        type: 'literal',
        what: 'number',
        value: tSendVarsMethod,
      },
      {
        type: 'literal',
        what: 'number',
        value: tLoadTargetFlag,
      },
      {
        type: 'literal',
        what: 'number',
        value: tLoadVariablesFlag
      }
    ]));

    pState.tempStackIndex = tTempStackIndex;
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
    pState.add(pFactory.createMapped('Call', [
      pState.toString(pState.tempStack[pState.tempStackIndex--]) //name
    ]));
  };

  // GoToFrame2
  mHandlers[0x9F] = function(pReader, pFactory, pState) {
    pReader.bp(6); // Reserved

    var tSceneBias = pReader.bp(1); // SceneBiasFlag

    var tPlayFlag = pReader.bp(1); // Play flag (0 = goto and stop, 1 = goto and play)

    pReader.a();

    if (tSceneBias === 1) {
      tSceneBias = pReader.I16(); // SceneBias (Number to be added to frame determined by stack argument)
    }

    pState.add(pFactory.createMapped('GoToFrame2', [
      pState.tempStack[pState.tempStackIndex--], //frame or label
      {
        type: 'literal',
        what: 'number',
        value: tSceneBias
      },
      {
        type: 'literal',
        what: 'number',
        value: tPlayFlag
      }
    ]));
  };

}(this));
