/**
 * @author Jason Parrott
 *
 * Copyright (C) 2012 AlphabetJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  var AlphabetJS = global.AlphabetJS;

  AlphabetJS.programs.ABC = ABCProgram;

  function ABCProgram() {
    this.constants = {
      int: [0],
      uint: [0],
      double: [0.0],
      str: [''],
      namespace: [null],
      ns_set: [null],
      multiname: [null]
    };

    this.methods = new Array();

    this.metadata = new Array();

    this.instances = new Array();

    this.classes = new Array();

    this.scripts = new Array();

    this.methodBodies = new Array();
  }

  ABCProgram.prototype = Object.create(AlphabetJS.Program.prototype);

}(this));
