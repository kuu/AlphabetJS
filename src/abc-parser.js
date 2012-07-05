
use('io');

(function(global) {

  function Parser(pVM, pABC) {
    var mIO = new global.AlphabetJS.IO();
    mIO.input(pABC);

    var tMinor = mIO.getUI16LE(), tMajor = mIO.getUI16LE();

    console.log('Parsing ABC file of version ' + tMajor + '.' + tMinor);

    function parseConstants() {
      // Parse int constants.
      var tCount = mIO.getVUI30();
      var buffer = pVM.constants.int;
      buffer.length = tCount;
      for (var i = 1; i < tCount; i++) {
        buffer[i] = mIO.getVSI32();
      }

      // Parse uint constants.
      tCount = mIO.getVUI30();
      buffer = pVM.constants.uint;
      buffer.length = tCount;
      for (var i = 1; i < tCount; i++) {
        buffer[i] = mIO.getVUI32();
      }

      // Parse double constants.
      tCount = mIO.getVUI30();
      buffer = pVM.constants.double;
      buffer.length = tCount;
      for (var i = 1; i < tCount; i++) {
        buffer[i] = mIO.getDouble();
      }

      // Parse string constants.
      tCount = mIO.getVUI30();
      buffer = pVM.constants.str;
      buffer.length = tCount;
      for (var i = 1; i < tCount; i++) {
        buffer[i] = mIO.getString();
      }

      // Parse namespaces constants.
      tCount = mIO.getVUI30();
      buffer = pVM.constants.namespace;
      buffer.length = tCount;
      for (var i = 1; i < tCount; i++) {
        buffer[i] = [mIO.getUI8(), // kind
          mIO.getVUI30() // name
        ];
      }

      // Parse ns_set constants.
      tCount = mIO.getVUI30();
      buffer = pVM.constants.ns_set;
      buffer.length = tCount;
      for (var i = 1; i < tCount; i++) {
        buffer[i] = [];
        var tLength = mIO.getVUI30();
        for (var j = 0; j < tLength; j++) {
          buffer[i].push(mIO.getVUI30());
        }
      }

      // Parse multiname constants.
      tCount = mIO.getVUI30();
      buffer = pVM.constants.multiname;
      buffer.length = tCount;
      for (var i = 1; i < tCount; i++) {
        var tKind = mIO.getUI8();
        buffer[i] = [tKind];
        switch (tKind) {
          case 0x07: // QName
            case 0x0D: // QNameA
            buffer[i].push(mIO.getVUI30(), mIO.getVUI30());
          break;
          case 0x0F: // RTQName
            case 0x10: // RTQNameA
            buffer[i].push(mIO.getVUI30());
          break;
          case 0x11: // RTQNameL
            case 0x12: // RTQNameLA
            break;
          case 0x09: // Multiname
            case 0x0E: // MultinameA
            buffer[i].push(mIO.getVUI30(), mIO.getVUI30());
          break;
          case 0x1B: // MultinameL
            case 0x1C: // MultinameLA
            buffer[i].push(mIO.getVUI30());
          break;
          default:
            console.error('Unknown multiname type: ' + tKind);
          return;
        }
      }
    }

    function parseMethodInfo() {
      var tCount = mIO.getVUI30();
      for (var i = 0; i < tCount; i++) {
        var tParamCount = mIO.getVUI30();
        var tMethodInfo = {
          paramCount : tParamCount, // param count
          returnType : mIO.getVUI30(), // return type
          paramTypes : mIO.getArray(mIO.getVUI30, tParamCount), // param types
          name : mIO.getVUI30(), // name
          flags : mIO.getUI8(),
          options : null,
          paramNames : null
        };
        if (tMethodInfo.flags & 0x08) { // HAS_OPTIONAL is set
          var tOptionCount = mIO.getVUI30();
          tMethodInfo.options = mIO.getArrays([mIO.getVUI30, mIO.getUI8], tOptionCount);
        }
        if (tMethodInfo.flags & 0x80) { // HAS_PARAM_NAMES is set
          tMethodInfo.paramNames = mIO.getArray(mIO.getVUI30, tParamCount);
        }
        pVM.methods.push(tMethodInfo);
      }
    }

    function parseMetaData() {
      var tCount = mIO.getVUI30();
      for (var i = 0; i < tCount; i++) {
        var tItemCount = mIO.getVUI30();
        var tMeta = [
          mIO.getVUI30(), //name
          tItemCount,
          mIO.getArrays([mIO.getVUI30, mIO.getVUI30], tItemCount)
        ];
        pVM.metadata.push(tMeta);
      }
    }

    function parseTraits(pTraitCount) {
      var tTraits = new Array(pTraitCount);
      for (var j = 0; j < pTraitCount; j++) {
        var tName = mIO.getVUI30(),
        tKindAndAttr = mIO.getUI8(),
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
            tTrait.slotId = mIO.getVUI30();
          tTrait.typeName = mIO.getVUI30();
          tTrait.vIndex = mIO.getVUI30();
          if (tTrait.vIndex !== 0) {
            tTrait.vKind = mIO.getUI8();
          }
          break;
          case 4: // class
            tTrait.slotId = mIO.getVUI30();
          tTrait.classIndex = mIO.getVUI30();
          break;
          case 5: // function
            tTrait.slotId = mIO.getVUI30();
          tTrait.functionIndex = mIO.getVUI30();
          break;
          case 1: // method
            case 2: // getter
            case 3: // setter
            tTrait.dispId = mIO.getVUI30();
          tTrait.method = mIO.getVUI30();
          break;
          default:
            console.error('Unknown instance trait kind: ' + tKind);
          return;
        }
      }

      return tTraits;
    }

    function parseClassAndInstanceInfo() {
      var tCount = mIO.getVUI30();

      // First is instances.
      for (var i = 0; i < tCount; i++) {
        var tInstance = {
          name: mIO.getVUI30(),
          superName: mIO.getVUI30(),
          flags: mIO.getUI8(),
          protectedNS: mIO.getVUI30(),
          interfaceCount: mIO.getVUI30()
        };
        tInstance.interfaces = mIO.getArray(mIO.getVUI30, tInstance.interfaceCount);
        tInstance.initializer = mIO.getVUI30();
        var tTraitCount = tInstance.traitCount = mIO.getVUI30();
        tInstance.traits = parseTraits(tTraitCount);
        pVM.instances.push(tInstance);
      }

      // Next is classes.
      for (var i = 0; i < tCount; i++) {
        var tClass = {
          initializer: mIO.getVUI30(),
          traitCount: mIO.getVUI30()
        };
        tClass.traits = parseTraits(tClass.traitCount);
        pVM.classes.push(tClass);
      }
    }

    function parseScriptInfo() {
      var tCount = mIO.getVUI30();
      for (var i = 0; i < tCount; i++) {
        var tScript = {
          initializer: mIO.getVUI30(),
          traitCount: mIO.getVUI30()
        };
        tScript.traits = parseTraits(tScript.traitCount);
        pVM.scripts.push(tScript);
      }
    }

    function parseMethodBodyInfo() {
      var tCount = mIO.getVUI30();
      for (var i = 0; i < tCount; i++) {
        var tMethodBody = {
          method: mIO.getVUI30(),
          maxStack: mIO.getVUI30(),
          localCount: mIO.getVUI30(),
          initScopeDepth: mIO.getVUI30(),
          maxScopeDepth: mIO.getVUI30(),
          codeLength: mIO.getVUI30()
        };
        tMethodBody.code = mIO.getArray(mIO.getUI8, tMethodBody.codeLength);
        tMethodBody.exceptionCount = mIO.getVUI30();
        tMethodBody.exceptions = mIO.getArrays([
                                               mIO.getVUI30, // from
                                               mIO.getVUI30, // to
                                               mIO.getVUI30, // target
                                               mIO.getVUI30, // exception type
                                               mIO.getVUI30 // var name
        ], tMethodBody.exceptionCount);
        tMethodBody.traitCount = mIO.getVUI30();
        tMethodBody.traits = parseTraits(tMethodBody.traitCount);
        pVM.methodBodies.push(tMethodBody);
      }
    }

    parseConstants();
    parseMethodInfo();
    parseMetaData();
    parseClassAndInstanceInfo();
    parseScriptInfo();
    parseMethodBodyInfo();
  }

  global['AlphabetJS']['Parser'] = Parser;

}(this));
