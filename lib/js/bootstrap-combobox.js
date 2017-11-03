'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Combobox = function () {

	/**
  * --------------------------------------------------------------------
  * Constants
  * --------------------------------------------------------------------
  */
	var NAME = 'combobox';
	var VERSION = '4.0.0-beta.2';
	var DATA_KEY = 'bs.combobox';
	var EVENT_KEY = '.' + DATA_KEY;
	var DATA_API_KEY = '.data-api';
	var JQUERY_NO_CONFLICT = _jquery2.default.fn[NAME];

	var Event = {
		CLICK: 'click'
	};

	var ClassName = {
		COMBOBOX: 'combobox',
		CONTAINER: 'combobox-container'
	};

	var Selector = {
		COMBOBOX: '.combobox',
		CONTAINER: '.combobox-container'

		/**
   * --------------------------------------------------------------------
   * Class Definition
   * --------------------------------------------------------------------
   */
	};
	var Combobox = function () {
		function Combobox(element) {
			_classCallCheck(this, Combobox);

			this._element = element;
			_build();
		}

		// GETTERS


		_createClass(Combobox, [{
			key: 'set',


			// PUBLIC
			value: function set(text) {
				var $input = (0, _jquery2.default)(this._element).closest(".combobox-container").find("input");

				$input.val(text);
				_filter();
			}

			// PRIVATE

		}, {
			key: '_build',
			value: function _build() {
				var $select = (0, _jquery2.default)(this._element);

				// Flag to include an "Add New" button in the dropdown.
				var addNewBtn = $select.data("add");

				// Grab the important bits so we can use them later.
				var $combobox = (0, _jquery2.default)("<div/>").addClass(ClassName.CONTAINER).appendTo($select.parent());
				var $input = (0, _jquery2.default)("<input/>");

				$combobox.append($select);

				// Create the input-group wrapper and put it in the combobox container.
				var $inputGroup = (0, _jquery2.default)("<div/>").addClass("input-group").appendTo($combobox);

				// Add the Bootstrap class to the input so it styles correctly.
				$input.addClass("form-control");

				// Put the original input inside the input-group wrapper.
				$inputGroup.append($input);

				// Hide the original select. It won't style well and we're going to convert it to a button dropdown.
				$select.hide();

				// Create the button group and put it in the input-group wrapper, after the input because we want it on the right.
				var $btnGroup = (0, _jquery2.default)("<span/>").addClass("input-group-btn").appendTo($inputGroup);

				// Create the main button for the button dropdown and add it to the group
				var $btn = (0, _jquery2.default)("<button/>");
				$btn.attr("type", "button").addClass("btn btn-secondary dropdown-toggle");
				$btnGroup.append($btn);

				// Generate the content of the dropdown menu based on what is in the original select.
				var dropdownList = "<div class='dropdown-menu' tabindex='-1'>";

				// Include an add new button if the feature was selected.
				if (addNewBtn) {
					dropdownList += "<a href='#' class='add-new-btn dropdown-item'>Add New</a>";
					dropdownList += "<div role='separator' class='dropdown-divider'></div>";
				}

				// Convert all options to combobox li's
				$select.find("option").each(function () {
					dropdownList += "<a href='#' class='dropdown-item' data-value='" + (0, _jquery2.default)(this).val().toLowerCase() + "'>";
					dropdownList += (0, _jquery2.default)(this).html();
					dropdownList += "</a>";
				});
				dropdownList += "</div>";

				// Add the new dropdown menu to our button group wrapper.
				$combobox.append(dropdownList);
			}
		}, {
			key: '_filter',
			value: function _filter() {
				var $combobox = (0, _jquery2.default)(this._element).closest(".combobox-container");

				// Save the searched value outside of the filter so we can access it later.
				var searchedValue = $combobox.find("input").val().toLowerCase();

				// Show the dropdown.
				$combobox.find(".dropdown-menu").show();

				// Return focus to the input.
				//$combobox.find("input").focus();

				// Show all options (in case we are searching for something new)
				$combobox.find("a").show();

				// Filter the options based on the search input and hide the ones that don't match.
				$combobox.find("a").filter(function () {
					if (!(0, _jquery2.default)(this).hasClass("add-new-btn")) {
						var existingValue = (0, _jquery2.default)(this).data("value");
						return !existingValue.match(searchedValue);
					}
				}).hide();
			}
		}], [{
			key: 'VERSION',
			get: function get() {
				return VERSION;
			}
		}]);

		return Combobox;
	}();

	// static


	function _jQueryInterface(config) {
		return this.each(function () {
			var $this = (0, _jquery2.default)(this);
			var data = $this.data(DATA_KEY);

			if (!data) {
				data = new Combobox(this);
				$this.data(DATA_KEY, data);
			}

			if (typeof config === 'string') {
				if (typeof data[config] === 'undefined') {
					throw new Error('No method named "' + config + '"');
				}
				data[config]();
			}
		});
	}

	/**
  * Events
  */
	(0, _jquery2.default)(document).on("click", ".combobox-container a:not(.add-new-btn)", function (event) {
		event.preventDefault();

		var $combobox = (0, _jquery2.default)(this).closest(".combobox-container");
		var $select = $combobox.find("select");
		var value = (0, _jquery2.default)(this).data("value");

		set(value);
		$select.find("option[value='" + value + "']").prop("selected", true);
		$combobox.find(".dropdown-menu").hide();
	});

	(0, _jquery2.default)(document).on("click", ".combobox-container .btn, .combobox-container input", function () {
		(0, _jquery2.default)(this).closest(".combobox-container").find(".dropdown-menu").toggle();
	});

	(0, _jquery2.default)(document).on("keyup", ".combobox-container input", function () {
		FilterDropdownResults((0, _jquery2.default)(this).closest(".combobox-container"));
	});

	/**
  * --------------------------------------------------------------------
  * jQuery
  * --------------------------------------------------------------------
  */
	_jquery2.default.fn[NAME] = Combobox._jQueryInterface;
	_jquery2.default.fn[NAME].Constructor = Combobox;
	_jquery2.default.fn[NAME].noConflict = function () {
		_jquery2.default.fn[NAME] = JQUERY_NO_CONFLICT;
		return Combobox._jQueryInterface;
	};

	/**
  * --------------------------------------------------------------------
  * Global Events
 	 * --------------------------------------------------------------------
  */
	(0, _jquery2.default)(document).mouseup(function (e) {
		(0, _jquery2.default)(".combobox-container").each(function () {
			var $this = (0, _jquery2.default)(this);
			if (!$this.is(e.target) && $this.has(e.target).length === 0) $this.find(".dropdown-menu").hide();
		});
	});

	return Combobox;
}(_jquery2.default);

exports.default = Combobox;