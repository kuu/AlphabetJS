(function(){

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
	
	this.methods = [];
	
	this.metadata = [];
	
	this.instances = [];
	
	this.classes = []; 
	
	this.scripts = [];
	
	this.methodBodies = [];
}

var AJS = window.AlphabetJS;
if (!AJS) {
	AJS = window.AlphabetJS = {};
}

AJS.VM = VM;

})();