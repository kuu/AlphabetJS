/**
 * @author Jason Parrott
 *
 * Copyright (C) 2012 AlphabetJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  var AlphabetJS = global.AlphabetJS;
  var Breader = global.Breader;

  /**
   * @class
   * @extends {AlphabetJS.Loader}
   */
  var ABCLoader = (function(pSuper) {
    function ABCLoader() {
      pSuper.call(this);
    }

    ABCLoader.prototype = Object.create(pSuper.prototype);

    return ABCLoader;
  })(AlphabetJS.Loader);

  AlphabetJS.loaders.ABC = ABCLoader;

  ABCLoader.prototype.load = function(pProgram, pABC, pFunctionMap) {
    var mIO = new Breader(pABC);

    var tMinor = mIO.I16(), tMajor = mIO.I16();

    console.log('Parsing ABC file of version ' + tMajor + '.' + tMinor);

    function parseConstants() {
      // Parse int constants.
      var tCount = mIO.ABCVUI30();
      var buffer = pProgram.constants.int;
      buffer.length = tCount;
      for (var i = 1; i < tCount; i++) {
        buffer[i] = mIO.ABCVSI32();
      }

      // Parse uint constants.
      tCount = mIO.ABCVUI30();
      buffer = pProgram.constants.uint;
      buffer.length = tCount;
      for (var i = 1; i < tCount; i++) {
        buffer[i] = mIO.ABCVUI32();
      }

      // Parse double constants.
      tCount = mIO.ABCVUI30();
      buffer = pProgram.constants.double;
      buffer.length = tCount;
      for (var i = 1; i < tCount; i++) {
        buffer[i] = mIO.F64();
      }

      // Parse string constants.
      tCount = mIO.ABCVUI30();
      buffer = pProgram.constants.str;
      buffer.length = tCount;
      for (var i = 1; i < tCount; i++) {
        buffer[i] = mIO.ABCs();
      }

      // Parse namespaces constants.
      tCount = mIO.ABCVUI30();
      buffer = pProgram.constants.namespace;
      buffer.length = tCount;
      for (var i = 1; i < tCount; i++) {
        buffer[i] = [mIO.B(), // kind
          mIO.ABCVUI30() // name
        ];
      }

      // Parse ns_set constants.
      tCount = mIO.ABCVUI30();
      buffer = pProgram.constants.ns_set;
      buffer.length = tCount;
      for (var i = 1; i < tCount; i++) {
        buffer[i] = [];
        var tLength = mIO.ABCVUI30();
        for (var j = 0; j < tLength; j++) {
          buffer[i].push(mIO.ABCVUI30());
        }
      }

      // Parse multiname constants.
      tCount = mIO.ABCVUI30();
      buffer = pProgram.constants.multiname;
      buffer.length = tCount;
      for (var i = 1; i < tCount; i++) {
        var tKind = mIO.B();
        buffer[i] = [tKind];
        switch (tKind) {
          case 0x07: // QName
            case 0x0D: // QNameA
            buffer[i].push(mIO.ABCVUI30(), mIO.ABCVUI30());
          break;
          case 0x0F: // RTQName
            case 0x10: // RTQNameA
            buffer[i].push(mIO.ABCVUI30());
          break;
          case 0x11: // RTQNameL
            case 0x12: // RTQNameLA
            break;
          case 0x09: // Multiname
            case 0x0E: // MultinameA
            buffer[i].push(mIO.ABCVUI30(), mIO.ABCVUI30());
          break;
          case 0x1B: // MultinameL
            case 0x1C: // MultinameLA
            buffer[i].push(mIO.ABCVUI30());
          break;
          default:
            console.error('Unknown multiname type: ' + tKind);
          return;
        }
      }
    }

    function parseMethodInfo() {
      var tCount = mIO.ABCVUI30();
      for (var i = 0; i < tCount; i++) {
        var tParamCount = mIO.ABCVUI30();
        var tMethodInfo = {
          paramCount : tParamCount, // param count
          returnType : mIO.ABCVUI30(), // return type
          paramTypes : mIO.getArray(mIO.ABCVUI30, tParamCount), // param types
          name : mIO.ABCVUI30(), // name
          flags : mIO.B(),
          options : null,
          paramNames : null
        };
        if (tMethodInfo.flags & 0x08) { // HAS_OPTIONAL is set
          var tOptionCount = mIO.ABCVUI30();
          tMethodInfo.options = mIO.getArrays([mIO.ABCVUI30, mIO.B], tOptionCount);
        }
        if (tMethodInfo.flags & 0x80) { // HAS_PARAM_NAMES is set
          tMethodInfo.paramNames = mIO.getArray(mIO.ABCVUI30, tParamCount);
        }
        pProgram.methods.push(tMethodInfo);
      }
    }

    function parseMetaData() {
      var tCount = mIO.ABCVUI30();
      for (var i = 0; i < tCount; i++) {
        var tItemCount = mIO.ABCVUI30();
        var tMeta = [
          mIO.ABCVUI30(), //name
          tItemCount,
          mIO.getArrays([mIO.ABCVUI30, mIO.ABCVUI30], tItemCount)
        ];
        pProgram.metadata.push(tMeta);
      }
    }

    function parseTraits(pTraitCount) {
      var tTraits = new Array(pTraitCount);
      for (var j = 0; j < pTraitCount; j++) {
        var tName = mIO.ABCVUI30(),
        tKindAndAttr = mIO.B(),
        tAttributes = tKindAndAttr >>> 4,
        tKind = tKindAndAttr & 0xF,
        tTrait = {
          name: tName,
          attributes: tAttributes,
          tKind: tKind
        };

        tTraits[j] = tTrait;

        switch (tKind) {
          case 0: // slot
          case 6: // const
            tTrait.slotId = mIO.ABCVUI30();
            tTrait.typeName = mIO.ABCVUI30();
            tTrait.vIndex = mIO.ABCVUI30();
            if (tTrait.vIndex !== 0) {
              tTrait.vKind = mIO.B();
            }
            break;
          case 4: // class
            tTrait.slotId = mIO.ABCVUI30();
            tTrait.classIndex = mIO.ABCVUI30();
            break;
          case 5: // function
            tTrait.slotId = mIO.ABCVUI30();
            tTrait.functionIndex = mIO.ABCVUI30();
            break;
          case 1: // method
          case 2: // getter
          case 3: // setter
            tTrait.dispId = mIO.ABCVUI30();
            tTrait.method = mIO.ABCVUI30();
            break;
          default:
            console.error('Unknown instance trait kind: ' + tKind);
          return;
        }
      }

      return tTraits;
    }

    function parseClassAndInstanceInfo() {
      var tCount = mIO.ABCVUI30();

      // First is instances.
      for (var i = 0; i < tCount; i++) {
        var tInstance = {
          name: mIO.ABCVUI30(),
          superName: mIO.ABCVUI30(),
          flags: mIO.B(),
          protectedNS: mIO.ABCVUI30(),
          interfaceCount: mIO.ABCVUI30()
        };
        tInstance.interfaces = mIO.getArray(mIO.ABCVUI30, tInstance.interfaceCount);
        tInstance.initializer = mIO.ABCVUI30();
        var tTraitCount = tInstance.traitCount = mIO.ABCVUI30();
        tInstance.traits = parseTraits(tTraitCount);
        pProgram.instances.push(tInstance);
      }

      // Next is classes.
      for (var i = 0; i < tCount; i++) {
        var tClass = {
          initializer: mIO.ABCVUI30(),
          traitCount: mIO.ABCVUI30()
        };
        tClass.traits = parseTraits(tClass.traitCount);
        pProgram.classes.push(tClass);
      }
    }

    function parseScriptInfo() {
      var tCount = mIO.ABCVUI30();
      for (var i = 0; i < tCount; i++) {
        var tScript = {
          initializer: mIO.ABCVUI30(),
          traitCount: mIO.ABCVUI30()
        };
        tScript.traits = parseTraits(tScript.traitCount);
        pProgram.scripts.push(tScript);
      }
    }

    function parseMethodBodyInfo() {
      var tCount = mIO.ABCVUI30();
      for (var i = 0; i < tCount; i++) {
        var tMethodBody = {
          method: mIO.ABCVUI30(),
          maxStack: mIO.ABCVUI30(),
          localCount: mIO.ABCVUI30(),
          initScopeDepth: mIO.ABCVUI30(),
          maxScopeDepth: mIO.ABCVUI30(),
          codeLength: mIO.ABCVUI30()
        };
        tMethodBody.code = mIO.getArray(mIO.B, tMethodBody.codeLength);
        tMethodBody.exceptionCount = mIO.ABCVUI30();
        tMethodBody.exceptions = mIO.getArrays([
          mIO.ABCVUI30, // from
          mIO.ABCVUI30, // to
          mIO.ABCVUI30, // target
          mIO.ABCVUI30, // exception type
          mIO.ABCVUI30 // var name
        ], tMethodBody.exceptionCount);
        tMethodBody.traitCount = mIO.ABCVUI30();
        tMethodBody.traits = parseTraits(tMethodBody.traitCount);
        pProgram.methodBodies.push(tMethodBody);
      }
    }

    parseConstants();
    parseMethodInfo();
    parseMetaData();
    parseClassAndInstanceInfo();
    parseScriptInfo();
    parseMethodBodyInfo();
  }

}(this));
