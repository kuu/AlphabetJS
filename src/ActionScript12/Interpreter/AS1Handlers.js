/**
 * @author Jason Parrott
 *
 * Copyright (C) 2012 AlphabetJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

 (function(global) {

  var AlphabetJS = global.AlphabetJS;
  var mHandlers = AlphabetJS.programs.AS1VM.handlers;

  var Math = global.Math;

  // End
  mHandlers[0x00] = function(pActionCode, pActionLength) {
    return false; // break the main loop.
  };

  // NextFrame
  mHandlers[0x04] = function(pActionCode, pActionLength) {
    this.callMapped('NextFrame');
  };

  // PreviousFrame
  mHandlers[0x05] = function(pActionCode, pActionLength) {
    this.callMapped('PreviousFrame');
  };

  // Play
  mHandlers[0x06] = function(pActionCode, pActionLength) {
    this.callMapped('Play');
  };

  // Stop
  mHandlers[0x07] = function(pActionCode, pActionLength) {
    this.callMapped('Stop');
  };

  // ToggleQuality
  mHandlers[0x08] = function(pActionCode, pActionLength) {
    this.callMapped('ToggleQuality');
  };

  // StopSounds
  mHandlers[0x09] = function(pActionCode, pActionLength) {
    this.callMapped('StopSounds');
  };

  // Add
  mHandlers[0x0A] = function(pActionCode, pActionLength) {
    this.push(this.toFloat(this.pop()) + this.toFloat(this.pop()));
  };

  // Subtract
  mHandlers[0x0B] = function(pActionCode, pActionLength) {
    this.push(-this.toFloat(this.pop()) + this.toFloat(this.pop()));
  };

  // Multiply
  mHandlers[0x0C] = function(pActionCode, pActionLength) {
    this.push(this.toFloat(this.pop()) * this.toFloat(this.pop()));
  };

  // Divide
  mHandlers[0x0D] = function(pActionCode, pActionLength) {
    var tRight = this.toFloat(this.pop());
    this.push(tRight / this.toFloat(this.pop()));
  };

  // Equals
  mHandlers[0x0E] = function(pActionCode, pActionLength) {
    this.push(this.toFloat(this.pop()) === this.toFloat(this.pop()));
  };

  // Less
  mHandlers[0x0F] = function(pActionCode, pActionLength) {
    // Switch it for popping purposes.
    this.push(this.toFloat(this.pop()) > this.toFloat(this.pop()) ? 1 : 0);
  };

  // And
  mHandlers[0x10] = function(pActionCode, pActionLength) {
    this.push(this.toFloat(this.pop()) && this.toFloat(this.pop()) ? 1 : 0);
  };

  // Or
  mHandlers[0x11] = function(pActionCode, pActionLength) {
    this.push(this.toFloat(this.pop()) || this.toFloat(this.pop()) ? 1 : 0);
  };

  // Not
  mHandlers[0x12] = function(pActionCode, pActionLength) {
    this.push((!this.toFloat(this.pop())) ? 1 : 0);
  };

  // StringEquals
  mHandlers[0x13] = function(pActionCode, pActionLength) {
    this.push(this.toString(this.pop()) === this.toString(this.pop()));
  };

  // Pop
  mHandlers[0x17] = function(pActionCode, pActionLength) {
    this.pop();
  };

  // ToInteger
  mHandlers[0x18] = function(pActionCode, pActionLength) {
    this.push(Math.floor(this.pop()));
  };

  // GetVariable
  mHandlers[0x1C] = function(pActionCode, pActionLength) {
    this.push(this.callMapped('GetVariable', this.toString(this.pop())));
  };

  // SetVariable
  mHandlers[0x1D] = function(pActionCode, pActionLength) {
    var tValue = this.pop();
    var tName = this.toString(this.pop());
    this.callMapped('SetVariable', tName, tValue);
  };

  // StringAdd
  mHandlers[0x21] = function(pActionCode, pActionLength) {
    var tRight = this.toString(this.pop());
    this.push(tRight + this.toString(this.pop()));
  };

  // GetProperty
  mHandlers[0x22] = function(pActionCode, pActionLength) {
    var tProperty = this.toInt(this.pop());
    var tName = this.toString(this.pop());
    this.push(this.callMapped('GetProperty', tName, tProperty));
  };

  // SetProperty
  mHandlers[0x23] = function(pActionCode, pActionLength) {
    var tValue = this.pop();
    var tProperty = this.toInt(this.pop());
    var tName = this.toString(this.pop());
    this.push(this.callMapped('SetProperty', tName, tProperty, tValue));
  };

  // CloneSprite
  mHandlers[0x24] = function(pActionCode, pActionLength) {
    var tDepth = this.toInt(this.pop());
    var tTarget = this.toString(this.pop());
    var tName = this.toString(this.pop());
    this.callMapped('CloneSprite', tTarget, tDepth, tName);
  };

  // RemoveSprite
  mHandlers[0x25] = function(pActionCode, pActionLength) {
    var tName = this.toString(this.pop());
    this.callMapped('RemoveSprite', tName);
  };

  // Trace
  mHandlers[0x26] = function(pActionCode, pActionLength) {
    this.callMapped('Trace', this.pop());
  };

  // StartDrag
  mHandlers[0x27] = function(pActionCode, pActionLength) {
    this.callMapped('StartDrag');
  };

  // EndDrag
  mHandlers[0x28] = function(pActionCode, pActionLength) {
    this.callMapped('EndDrag');
  };

  // StringLess
  mHandlers[0x29] = function(pActionCode, pActionLength) {
    // Switch it for popping purposes.
    this.push(this.toString(this.pop()) > this.toString(this.pop()) ? 1 : 0);
  };

  // FSCommand2
  mHandlers[0x2D] = function(pActionCode, pActionLength) {
    var tNumberOfArguments = (this.toInt(this.pop()) || 1) - 1;
    var tArguments = new Array(tNumberOfArguments);

    for (var i = tNumberOfArguments - 1; i >= 0; i--) {
      tArguments[i] = this.pop();
    }

    this.callMapped.apply(this, ['FSCommand2'].concat(tArguments));
  };

  // RandomNumber
  mHandlers[0x30] = function(pActionCode, pActionLength) {
    var tMax = this.toFloat(this.pop());
    this.push(((Math.random() * (tMax - 1)) + 0.5) | 0);
  };

  // StringLength, MBStringLength
  mHandlers[0x14] = mHandlers[0x31] = function(pActionCode, pActionLength) {
    // TODO: sjis
    this.push(this.toString(this.pop()).length);
  };

  // CharToAscii
  mHandlers[0x32] = function(pActionCode, pActionLength) {
    console.warn('CharToAscii');
  };

  // AsciiToChar
  mHandlers[0x33] = function(pActionCode, pActionLength) {
    console.warn('AsciiToChar');
  };

  // GetTime
  mHandlers[0x34] = function(pActionCode, pActionLength) {
    console.warn('GetTime');
  };

  // StringExtract, MBStringExtract
  mHandlers[0x15] = mHandlers[0x35] = function(pActionCode, pActionLength) {
    var tCount = this.toInt(this.pop());
    var tIndex = this.toInt(this.pop());
    this.push(this.toString(this.pop()).substr(tIndex - 1));
  };

  // MBCharToAscii
  mHandlers[0x36] = function(pActionCode, pActionLength) {
    console.warn('MBCharToAscii');
  };

  // MBAsciiToChar
  mHandlers[0x37] = function(pActionCode, pActionLength) {
    console.warn('MBAsciiToChar');
  };

  // GoToFrame
  mHandlers[0x81] = function(pActionCode, pActionLength) {
    this.callMapped('GoToFrame', this.reader.I16());
  };

  // GetURL
  mHandlers[0x83] = function(pActionCode, pActionLength) {
    // UrlString: The target URL string
    // TargetString: The target string. _level0 and _level1 loads SWF files to special area.
    this.callMapped('GetURL', this.reader.s(), this.reader.s());
  };

  // WaitForFrame
  mHandlers[0x8A] = function(pActionCode, pActionLength) {
    // The number of frames to wait for.
    // SkipCount: The number of actions to skip if frame is not loaded.
    this.callMapped('WaitForFrame', this.reader.I16(), this.reader.B());
  };

  // SetTarget
  mHandlers[0x8B] = function(pActionCode, pActionLength) {
    this.setTarget(this.reader.s());
  };

  // SetTarget2
  mHandlers[0x20] = function(pActionCode, pActionLength) {
    this.setTarget(this.toString(this.pop()));
  };

  // GoToLabel
  mHandlers[0x8C] = function(pActionCode, pActionLength) {
    this.callMapped('GoToLabel', this.reader.s());
  };

  // WaitForFrame2
  mHandlers[0x8D] = function(pActionCode, pActionLength) {
    // SkipCount: The number of actions to skip if frame is not loaded.
    this.callMapped('WaitForFrame2', this.reader.B());
  };

  // Push
  mHandlers[0x96] = function(pActionCode, pActionLength) {
    var tPushValue;
    var tReader = this.reader;

    // TODO: Is it possible to have multiple pushes in a single push command?? Until the end of the length
    switch (tReader.B()) {
      case 0: // String literal
        tPushValue = tReader.s();
        break;
      case 1: // Floating Point literal
        tPushValue = tReader.F32();
        break;
      case 4: // Register Number
        tPushValue = tReader.B();
        break;
      case 5: // Boolean
        tPushValue = tReader.B() ? true : false;
        break;
      case 6: // Double
        tPushValue = tReader.F64();
        break;
      case 7: // Integer
        tPushValue = tReader.I32();
        break;
      case 8: // Constant8: For constant pool index < 256
        tPushValue = tReader.B();
        break;
      case 9: // Constant16: For constant pool index >= 256
        tPushValue = tReader.I16();
        break;
    }

    this.push(tPushValue);
  };

  // Jump
  mHandlers[0x99] = function(pActionCode, pActionLength) {
    var tReader = this.reader;
    var tOffset = tReader.SI16();
    tReader.seek(tOffset);
  };

   // GetURL2
  mHandlers[0x9A] = function(pActionCode, pActionLength) {
    var tReader = this.reader;
    var tSendVarsMethod = tReader.bp(2); // SendVarsMethod (0 = none, 1 = GET, 2 = POST)
    tReader.bp(4); // Reserved
    var tLoadTargetFlag = tReader.bp(1); // LoadTargetFlag (0 = target is a browser window, 1 = target is a path to sprite)
    var tLoadVariablesFlag = tReader.bp(1); // LoadVariablesFlag (0 = no variables to load, 1 = load variables)
    tReader.a();

    this.callMapped('GetURL2', tSendVarsMethod, tLoadTargetFlag, tLoadVariablesFlag);
  };

  // If
  mHandlers[0x9D] = function(pActionCode, pActionLength) {
    var tReader = this.reader;
    var tOffset = tReader.SI16();
    var tCondition = this.pop();

    if (!tCondition) {
      tReader.seek(tOffset);
    }
  };

  // Call
  mHandlers[0x9E] = function(pActionCode, pActionLength) {
    this.callMapped('Call', this.pop());
  };

  // GoToFrame2
  mHandlers[0x9F] = function(pActionCode, pActionLength) {
    var tReader = this.reader;
    tReader.bp(6); // Reserved
    var tSceneBias = tReader.bp(1); // SceneBiasFlag
    var tPlayFlag = tReader.bp(1); // Play flag (0 = goto and stop, 1 = goto and play)

    tReader.a();

    if (tSceneBias === 1) {
      tSceneBias = tReader.I16(); // SceneBias (Number to be added to frame determined by stack argument)
    }

    this.callMapped('GoToFrame2', this.pop(), tSceneBias, tPlayFlag);
  };

}(this));