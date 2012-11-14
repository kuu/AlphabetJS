/**
 * @author Jason Parrott
 *
 * Copyright (C) 2012 AlphabetJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

 (function(global) {

  var Breader = global.Breader;
  var AlphabetJS = global.AlphabetJS;

  /**
   * @class
   * @extends {AlphabetJS.Loader}
   */
  var ASLoader = (function(pSuper) {
    function ASLoader() {
      pSuper.call(this);
    }

    ASLoader.prototype = Object.create(pSuper.prototype);

    return ASLoader;
  })(AlphabetJS.Loader);

  AlphabetJS.loaders.AS1VM = ASLoader;
  AlphabetJS.loaders.AS2VM = ASLoader;

  function ASData(pActions, pVersion) {
    this.actions = pActions;
    this.version = pVersion;
  }

  ASLoader.prototype.load = function(pProgram, pActions, pMetadata) {
    return pProgram.load(new ASData(pActions, pMetadata.version));

  };

}(this));
