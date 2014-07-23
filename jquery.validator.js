(function ($) {

	/**
	 * Create a capitalize method because JavaScript is lame and doesn't have one
	 * @returns {string}
	 * @example console.log("foo".capitalize()) prints "Foo" to the console
	 */
	String.prototype.capitalize = function () {
		return this.charAt(0).toUpperCase() + this.slice(1);
	};

	/**
	 * The jQuery plugin that starts the validation
	 * @param options
	 */
	$.fn.validator = function (options) {
		var defaults = $.extend($.fn.validator.defaults, options);

		var $formSelection = "#" + this[0].id;
		if(!this[0].id) {
			if(!this[0].className) {
				$formSelection = this[0].localName;
			} else {
				$formSelection = "." + this[0].className;
			}
		}

		var $selectors = $formSelection + " input[required], " + $formSelection + " select[required], " + $formSelection + " textarea[required]";

		$(this).submit(function (e) {
			e.preventDefault();
			$($selectors).each(function (index) {
				if( !$(this).hasClass($.fn.validator.defaults.class) ) {
					$(this).basicValidation($(this));
					$(this).clearFields($(this));
				}
			});

			return true;
		});
	};

	/**
	 * Our basic validation rules
	 * @param data
	 */
	$.fn.basicValidation = function (data) {
		if (data.val() === "") {
			var errorMessage = data.attr("name").capitalize() + " cannot be empty";
			data.addClass($.fn.validator.defaults.class).val(errorMessage);
		} else {
			if (data.attr("type") === "email") {
				if ($.fn.validator.defaults.validateEmail && !isValidEmail($('input[type="email"]').val())) {
					var $org = $('input[type="email"]').val();
					data.addClass($.fn.validator.defaults.class).val("Invalid email address entered");
					data.on($.fn.validator.defaults.clearValidationOn, function () {
						$(this).val($org).removeClass($.fn.validator.defaults.class);
					});
				}
			}
		}
	};

	/**
	 * The logic involved in clearing the fields after an error has occurred
	 */
	$.fn.clearFields = function () {
		$(this).on($.fn.validator.defaults.clearValidationOn, function () {
			if ($(this).hasClass($.fn.validator.defaults.class)) {
				$(this).val("").removeClass($.fn.validator.defaults.class);
			}
		});
	};

	function isValidEmail (email) {
		var pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

		return pattern.test(email);
	}

	/**
	 * The defaults of the plugin
	 * @type {{class: string, validateEmail: boolean, clearValidationOn: string, debug: boolean}}
	 */
	$.fn.validator.defaults = {
		class: "invalid",
		validateEmail: true,
		clearValidationOn: "focus",
	};

})(jQuery);
