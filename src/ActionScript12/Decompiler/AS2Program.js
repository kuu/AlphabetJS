/**
 * @author Jason Parrott
 *
 * Copyright (C) 2012 AlphabetJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  var AlphabetJS = global.AlphabetJS;

  AlphabetJS.programs.AS2 = AS2Program;

  function AS2Program() {

  }

  AS2Program.prototype = Object.create(AlphabetJS.programs.AS1Program.prototype);

}(this));
