(function(UI){

	module("Button");

	test("Button should be defined on UIkit object", function () {
		ok(UI["button"], 'Button component is defined');
	});

	test("Button should toogle .uk-active on click", function () {
		
		$fixture.load("buttons");

		ok($fixture.find("#obj-button,#obj-checkbox-group,#obj-radio-group").length==3, 'Template loaded');
		ok($fixture.find("#obj-button").uk("button").data("button"), 'Button object created');
		ok($fixture.find("#obj-checkbox-group").uk("button-checkbox").data("button-checkbox"), 'Button checkbox group object created');
		ok($fixture.find("#obj-radio-group").uk("button-radio").data("button-radio"), 'Button radio group object created');

		ok($fixture.find("#obj-button").trigger("click").hasClass("uk-active"), 'Button: add .uk-active on click');

		$fixture.find("#obj-checkbox-group").find(".uk-button").eq(0).trigger("click").end().eq(1).trigger("click");

		ok($fixture.find("#obj-checkbox-group").find(".uk-button.uk-active").length==2, 'Button checkbox group: activate two buttons');

		$fixture.find("#obj-radio-group").find(".uk-button").eq(0).trigger("click").end().eq(1).trigger("click");

		ok($fixture.find("#obj-radio-group").find(".uk-button.uk-active").length==1, 'Button radio group: activate only one button');

	});

})($.UIkit);