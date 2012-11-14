/**
 * @author Jason Parrott
 *
 * Copyright (C) 2012 AlphabetJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 *
 * @todo  Make this clean.
 */

(function(global) {

  var AlphabetJS = global.AlphabetJS;

  AlphabetJS.ASTFactory = ASTFactory;

  function ASTFactory(pFunctionMap) {
    this.ast = {
      type: 'literal',
      what: 'function',
      body: []
    };
    this.previousAST = null;
    this.parentAST = this.ast;
    this.astPointer = this.ast.body;
    this.astPointerStack = [];
    this.functionMap = pFunctionMap;
  }

  ASTFactory.prototype.expression = function(pType, pData, pIndent) {
    var tExpressions = this.expressions;
    if (!(pType in tExpressions)) {
      return '';
    }
    return tExpressions[pType].call(this, pData, pIndent);
  };

  ASTFactory.prototype.literal = function(pType, pData, pIndent) {
    var tLiterals = this.literals;
    if (!(pType in tLiterals)) {
      return '';
    }
    return tLiterals[pType].call(this, pData, pIndent);
  };

  ASTFactory.prototype.expressions = {
    'raw': function(pData, pIndent) {
      return pData.value;
    },

    'declare': function(pData, pIndent) {
      return  'var ' +
              pData.name +
              (
                pData.value !== void 0 ?
                ' = ' + this.expression(pData.value.type, pData.value, pIndent) :
                ''
              ) +
              ';';
    },

    'assign': function(pData, pIndent) {
      return  this.expression(pData.left.type, pData.left, pIndent) +
              ' = ' +
              this.expression(pData.right.type, pData.right, pIndent) +
              ';'; // TODO: This could have illegal cases.
    },

    'literal': function(pData, pIndent) {
      return this.literal(pData.what, pData, pIndent);
    },

    'comment': function(pData, pIndent) {
      return '/*' + pData.value + '*/';
    },

    'call': function(pData, pIndent) {
      var tResult = this.expression(pData.value.type, pData.value, pIndent) + '(';

      if (pData.args !== void 0) {
        var tArgs = pData.args;
        for (var i = 0, il = tArgs.length; i < il; i++) {
          tResult += this.expression(tArgs[i].type, tArgs[i], pIndent);
          if (i !== il - 1) {
            tResult += ', ';
          }
        }
      }

      return tResult + ')';
    },

    'property': function(pData, pIndent) {
      return  this.expression(pData.left.type, pData.left, pIndent) +
              '[' +
              this.expression(pData.right.type, pData.right, pIndent) +
              ']';
    },

    'add': function(pData, pIndent) {
      return  this.expression(pData.left.type, pData.left, pIndent) +
              ' + ' +
              this.expression(pData.right.type, pData.right, pIndent);
    },

    'subtract': function(pData, pIndent) {
      return  this.expression(pData.left.type, pData.left, pIndent) +
              ' - ' +
              this.expression(pData.right.type, pData.right, pIndent);
    },

    'multiply': function(pData, pIndent) {
      return  this.expression(pData.left.type, pData.left, pIndent) +
              ' * ' +
              this.expression(pData.right.type, pData.right, pIndent);
    },

    'divide': function(pData, pIndent) {
      return  this.expression(pData.left.type, pData.left, pIndent) +
              ' / ' +
              this.expression(pData.right.type, pData.right, pIndent);
    },

    'equals': function(pData, pIndent) {
      return  this.expression(pData.left.type, pData.left, pIndent) +
              ' === ' +
              this.expression(pData.right.type, pData.right, pIndent);
    },

    'roughly_equals': function(pData, pIndent) {
      return  this.expression(pData.left.type, pData.left, pIndent) +
              ' == ' +
              this.expression(pData.right.type, pData.right, pIndent);
    },

    'less': function(pData, pIndent) {
      return  this.expression(pData.left.type, pData.left, pIndent) +
              ' < ' +
              this.expression(pData.right.type, pData.right, pIndent);
    },

    'and': function(pData, pIndent) {
      return  this.expression(pData.left.type, pData.left, pIndent) +
              ' && ' +
              this.expression(pData.right.type, pData.right, pIndent);
    },

    'or': function(pData, pIndent) {
      return  this.expression(pData.left.type, pData.left, pIndent) +
              ' || ' +
              this.expression(pData.right.type, pData.right, pIndent);
    },

    'not': function(pData, pIndent) {
      return  '!(' + this.expression(pData.value.type, pData.value, pIndent) + ')';
    },

    'branch': function(pData, pIndent) {
      var tResult =
        pData.what + ' (!(' +
        this.expression(pData.condition.type, pData.condition, pIndent) +
        ')) {\n';

      var tBody = pData.body;
      var tBodyLength = tBody.length;
      pIndent++;

      for (var i = 0; i < tBodyLength; i++) {
        var tBodyI = tBody[i];
        tResult += indent(pIndent) + this.expression(tBodyI.type, tBodyI, pIndent);
        if (
            tBodyI.type !== 'branch' &&
            tBodyI.type !== 'else'
          ) {
          tResult += ';';
        }
        tResult += '\n';
      }

      return tResult + indent(pIndent - 1) + '}'; // make else and else if pretty?
    },

    'else': function(pData, pIndent) {
      var tResult = 'else {\n';
      var tBody = pData.body;
      var tBodyLength = tBody.length;
      pIndent++;

      for (var i = 0; i < tBodyLength; i++) {
        var tBodyI = tBody[i];
        tResult += indent(pIndent) + this.expression(tBodyI.type, tBodyI, pIndent);
        if (
            tBodyI.type !== 'branch' &&
            tBodyI.type !== 'else'
          ) {
          tResult += ';';
        }
        tResult += '\n';
      }

      return tResult + indent(pIndent - 1) + '}';
    }

  };

  ASTFactory.prototype.literals = {
    'function': function(pData, pIndent) {
      var tBody = pData.body;
      var tBodyLength = tBody.length;
      var tCode = new Array(tBodyLength);
      pIndent++;

      for (var i = 0; i < tBodyLength; i++) {
        var tBodyI = tBody[i];
        var tCodeI = indent(pIndent) + this.expression(tBodyI.type, tBodyI, pIndent);
        if (
            tBodyI.type !== 'branch' &&
            tBodyI.type !== 'else'
          ) {
          tCodeI += ';';
        }
        tCode[i] = tCodeI;
      }

      return  indent(pIndent - 1) +
        'function' +
        (pData.name !== void 0 ? ' ' + pData.name : '') +
        '() {\n' +
        tCode.join('\n') +
        '\n' +
        indent(pIndent - 1) +
        '}';
    },

    'reference': function(pData, pIndent) {
      return pData.value;
    },

    'this': function(pData, pIndent) {
      return 'this';
    },

    'object': function(pData, pIndent) {
      var tResult = '{';

      var tIsFirst = true;
      var tData = pData.value;
      for (var k in tData) {
        if (tIsFirst) {
          tIsFirst = false;
        } else {
          tResult += ', ';
        }
        tResult += '\'' + k + '\': ' + this.expression(tData[k].type, tData[k], pIndent);
      }

      return tResult + '}';
    },

    'array': function(pData, pIndent) {
      var tResult = '[';

      var tIsFirst = true;
      var tData = pData.value;
      for (var i = 0, il = tData.length; i < il; i++) {
        if (tIsFirst) {
          tIsFirst = false;
        } else {
          tResult += ', ';
        }
        tResult += this.expression(tData[i].type, tData[i], pIndent);
      }

      return tResult + ']';
    },

    'string': function(pData, pIndent) {
      // TODO: Make sure the string is valid.
      var tValue = pData.value;
      tValue = tValue
                .replace(/\n/g, '\\n')
                .replace(/'/g, '\\\'');
      return '\'' + tValue + '\'';
    },

    'number': function(pData, pIndent) {
      // TODO: Make sure the number is valid.
      return pData.value;
    },

    'boolean': function(pData, pIndent) {
      return pData.value;
    }
  };

  ASTFactory.prototype.add = function(pAST) {
    var tPreviousAST = this.previousAST;

    pAST.parent = this.parentAST;
    tPreviousAST !== null && (tPreviousAST.next = pAST);
    pAST.previous = tPreviousAST;
    this.previousAST = pAST;
    this.astPointer.push(pAST);
  };

  ASTFactory.prototype.createMapped = function(pName, pArguments) {
    return {
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
          value: 'callMapped'
        }
      },
      args: [
        {
          type: 'literal',
          what: 'string',
          value: pName
        }
      ].concat(pArguments || [])
    };
  };

  ASTFactory.prototype.enter = function(pAST) {
    this.previousAST = null;
    this.astPointerStack.push(this.parentAST);
    this.parentAST = pAST;
    this.astPointer = pAST.body;
  };

  ASTFactory.prototype.leave = function() {
    var tParentAST = this.parentAST = this.astPointerStack.pop();
    var tASTPointer = this.astPointer = tParentAST.body;
    this.previousAST = tASTPointer[tASTPointer.length - 1] || null;
  };

  ASTFactory.prototype.createJavaScript = function(pAST) {
    var tCode = new Array(pAST.length);
    for (var i = 0, il = pAST.length; i < il; i++) {
      tCode[i] = this.expression(pAST[i].type, pAST[i], 0);
    }
    console.log(tCode.join('\n'));
    return tCode.join('\n');
  };

  ASTFactory.prototype.getFunction = function(pArgs) {
    if (!pArgs) {
      pArgs = [];
    }
    return new Function(pArgs.join(','), this.createJavaScript(this.ast.body));
  };

  function indent(pDepth) {
    return (new Array(pDepth + 1)).join('  ');
  }

}(this));
