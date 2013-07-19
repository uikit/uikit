(function(UI){

	module("Core");
	
	test("$.UIkit and $.fn.uk exists", function() {
		equal(typeof UI, "object", "$.UIkit is a object");
		equal(typeof $.fn.uk, "function", "$.fn.ui is a function");
	});

	test("$.UIkit.fn and $.fn.uk are equal", function() {
		equal(UI.fn, $.fn.uk, "$.UIkit.fn and $.fn.uk are equal");
	});

})($.UIkit);