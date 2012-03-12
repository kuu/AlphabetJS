(function(){

function VM() {
	this.constants = {
		int: [0],
		uint: [0],
		double: [0.],
		str: [''],
		namespace: [''],
		ns_set: [''],
		multiname: ['']
	};
}

var AJS = window.AlphabetJS;
if (!AJS) {
	AJS = window.AlphabetJS = {};
}

AJS.VM = VM;

})();