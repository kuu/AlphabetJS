/**
 * @author Jason Parrott
 * @preserve
 *
 * Copyright (C) 2012 AlphabetJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {
  var AlphabetJS = global.AlphabetJS = {
    createProgram: createProgram,
    createLoader: createLoader,
    programs: {},
    loaders: {}
  };

  function createProgram(pType, pFunctionMap) {
    var tClass = AlphabetJS.programs[pType];
    if (tClass !== void 0) {
      return new tClass(pFunctionMap);
    }
    return null;
  }

  function createLoader(pType) {
    var tClass = AlphabetJS.loaders[pType];
    if (tClass !== void 0) {
      return new tClass();
    }
    return null;
  }

}(this));
