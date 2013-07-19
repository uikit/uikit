(function(UI){

	module("Alert");

	test("Alert should be defined on UIkit object", function () {
		ok(UI["alert"], 'Alert component is defined');
	});

	test("Alert should be closed on .uk-alert-close click", function () {

		expect(5);
		
		$fixture.load("alert").find(".uk-alert").uk("alert", { fade: false });

		ok($fixture.find(".uk-alert").length, 'Template loaded');
		ok($fixture.find(".uk-alert").data("alert"), 'Alert object created');

		$fixture.find(".uk-alert").bind("close", function (e) {
			ok(true, "Close event fired");
		});

		$fixture.find(".uk-alert").bind("closed", function (e) {
			ok(true, "Closed event fired");
		});

		$fixture.find(".uk-alert-close:first").trigger("click");

		ok(!$fixture.find(".uk-alert").length, 'Alert removed');
	});

})($.UIkit);