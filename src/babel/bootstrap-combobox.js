import $ from 'jquery'

const Combobox = (() => {

	/**
	 * --------------------------------------------------------------------
	 * Constants
	 * --------------------------------------------------------------------
	 */
	const NAME = 'combobox';
	const VERSION = '4.0.0-beta.2';
	const DATA_KEY = 'bs.combobox';
	const EVENT_KEY = `.${DATA_KEY}`;
	const DATA_API_KEY = '.data-api';
	const JQUERY_NO_CONFLICT = $.fn[NAME]

	const Event = {
		CLICK : 'click'
	}

	const ClassName = {
		COMBOBOX  : 'combobox',
		CONTAINER : 'combobox-container'
	}

	const Selector = {
		COMBOBOX  : '.combobox',
		CONTAINER : '.combobox-container'
	}

	/**
	 * --------------------------------------------------------------------
	 * Class Definition
	 * --------------------------------------------------------------------
	 */
	class Combobox {

		constructor(element) {
			this._element = element;
			_build();
		}

		// GETTERS
		static get VERSION() {
			return VERSION
		}

		// PUBLIC
		set(text) {
			var $input = $(this._element).closest(".combobox-container").find("input");

			$input.val(text);
			_filter();
		}

		// PRIVATE
		_build() {
			var $select = $(this._element);

			// Flag to include an "Add New" button in the dropdown.
			var addNewBtn = $select.data("add");

			// Grab the important bits so we can use them later.
			var $combobox = $("<div/>").addClass(ClassName.CONTAINER).appendTo($select.parent());
			var $input  = $("<input/>");

			$combobox.append($select);

			// Create the input-group wrapper and put it in the combobox container.
			var $inputGroup = $("<div/>").addClass("input-group").appendTo($combobox);

			// Add the Bootstrap class to the input so it styles correctly.
			$input.addClass("form-control");

			// Put the original input inside the input-group wrapper.
			$inputGroup.append($input);

			// Hide the original select. It won't style well and we're going to convert it to a button dropdown.
			$select.hide();

			// Create the button group and put it in the input-group wrapper, after the input because we want it on the right.
			var $btnGroup = $("<span/>").addClass("input-group-btn").appendTo($inputGroup);

			// Create the main button for the button dropdown and add it to the group
			var $btn = $("<button/>");
			$btn.attr("type", "button")
					.addClass("btn btn-secondary dropdown-toggle");
			$btnGroup.append($btn);

			// Generate the content of the dropdown menu based on what is in the original select.
			var dropdownList = "<div class='dropdown-menu' tabindex='-1'>";

			// Include an add new button if the feature was selected.
			if(addNewBtn)
			{
				dropdownList += "<a href='#' class='add-new-btn dropdown-item'>Add New</a>";
				dropdownList += "<div role='separator' class='dropdown-divider'></div>";
			}

			// Convert all options to combobox li's
			$select.find("option").each(function() {
				dropdownList += "<a href='#' class='dropdown-item' data-value='" + $(this).val().toLowerCase() + "'>";
				dropdownList += $(this).html();
				dropdownList += "</a>";
			});
			dropdownList += "</div>";

			// Add the new dropdown menu to our button group wrapper.
			$combobox.append(dropdownList);
		}

		_filter() {
			var $combobox = $(this._element).closest(".combobox-container");

			// Save the searched value outside of the filter so we can access it later.
			var searchedValue = $combobox.find("input").val().toLowerCase();

			// Show the dropdown.
			$combobox.find(".dropdown-menu").show();

			// Return focus to the input.
			//$combobox.find("input").focus();

			// Show all options (in case we are searching for something new)
			$combobox.find("a").show();

			// Filter the options based on the search input and hide the ones that don't match.
			$combobox.find("a")
			         .filter(function() {
			              if(!$(this).hasClass("add-new-btn"))
			              {
			                  var existingValue = $(this).data("value");
			                  return !existingValue.match(searchedValue);
			              }
			          })
			         .hide();
		}
	}

	// static
	function _jQueryInterface(config) {
		return this.each(function() {
			const $this = $(this)
			let data = $this.data(DATA_KEY)

			if(!data) {
				data = new Combobox(this)
				$this.data(DATA_KEY, data)
			}

			if(typeof config === 'string') {
				if (typeof data[config] === 'undefined') {
					throw new Error(`No method named "${config}"`)
				}
				data[config]()
			}
		})
	}

	/**
	 * Events
	 */
	 $(document).on("click", ".combobox-container a:not(.add-new-btn)", function(event){
		event.preventDefault();

		var $combobox = $(this).closest(".combobox-container");
		var $select = $combobox.find("select");
		var value = $(this).data("value");

		set(value);
		$select.find("option[value='" + value + "']").prop("selected", true);
		$combobox.find(".dropdown-menu").hide();
	});

	$(document).on("click", ".combobox-container .btn, .combobox-container input", function() {
		$(this).closest(".combobox-container").find(".dropdown-menu").toggle();
	});

	$(document).on("keyup", ".combobox-container input", function() {
		FilterDropdownResults($(this).closest(".combobox-container"));
	});


	/**
	 * --------------------------------------------------------------------
	 * jQuery
	 * --------------------------------------------------------------------
	 */
	$.fn[NAME]             = Combobox._jQueryInterface
	$.fn[NAME].Constructor = Combobox
	$.fn[NAME].noConflict  = function()
	                         {
	                         	$.fn[NAME] = JQUERY_NO_CONFLICT
	                         	return Combobox._jQueryInterface
	                         }

	/**
	 * --------------------------------------------------------------------
	 * Global Events
 	 * --------------------------------------------------------------------
	 */
	 $(document).mouseup(function(e) {
		 $(".combobox-container").each(function(){
			 var $this = $(this);
			 if(!$this.is(e.target) && $this.has(e.target).length === 0)
				 $this.find(".dropdown-menu").hide();
		 });
	 });


	return Combobox

})($)

export default Combobox
