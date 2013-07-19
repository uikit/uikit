(function(UI){

	module("Modal");

	test("Modal should be defined on UIkit object", function () {
		ok(UI["modal"], 'Modal component is defined');
	});

	test("Modal functionality", function () {

		$fixture.load("modal").find("a:first").uk("modal");

		ok($fixture.find("a:first").length, 'Template loaded');
		ok($fixture.find("a:first").data("modal"), 'Modal object created');

		$fixture.find("a:first").trigger("click");

		ok($fixture.find("a:first").data("modal").isActive(), 'Modal is shown on trigger click');

		$fixture.find(".uk-modal-close").trigger("click");
	});

})($.UIkit);