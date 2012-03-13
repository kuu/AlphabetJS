(function(){

function Parser(pVM, pABC) {
	var mIO = new BitIO();
	mIO.input(pABC);	
	var tMinor = mIO.getUI16LE(),
		tMajor = mIO.getUI16LE();	
	console.log('Parsing ABC file of version ' + tMajor + '.' + tMinor);	
	// Parse int constants.
	var tCount = mIO.getVUI30();	var buffer = pVM.constants.int;
	buffer.length = tCount;	for (var i = 1; i < tCount; i++) {
		buffer[i] = mIO.getVSI32();
	}	
	// Parse uint constants.
	tCount = mIO.getVUI30();	buffer = pVM.constants.uint;
	buffer.length = tCount;	for (var i = 1; i < tCount; i++) {
		buffer[i] = mIO.getVUI32();
	}
	
	// Parse double constants.
	tCount = mIO.getVUI30();	buffer = pVM.constants.double;
	buffer.length = tCount;	for (var i = 1; i < tCount; i++) {
		buffer[i] = mIO.getDouble();
	}
}

var AJS = window.AlphabetJS;
if (!AJS) {
	AJS = window.AlphabetJS = {};
}

AJS.Parser = Parser;

})();