
use('io', 'abc-parser');

(function(global) {

  function VM() {
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

  global['AlphabetJS']['VM'] = VM;

}(this));
