(function(UI){

	module("Dropdown");

	test("Dropdown should be defined on UIkit object", function () {
		ok(UI["dropdown"], 'Dropdown component is defined');
	});

	test("Dropdown menu should be visible on .uk-dropdown-toggle click", function () {

		$fixture.load("dropdown").find(".uk-dropdown").uk("dropdown");

		ok($fixture.find(".uk-dropdown").length, 'Template loaded');
		ok($fixture.find(".uk-dropdown").data("dropdown"), 'Dropdown object created');

	});

})($.UIkit);