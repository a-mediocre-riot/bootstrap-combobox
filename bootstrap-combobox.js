// *****************************************************************************
// *****************************************************************************
// *****************************************************************************
// COMBOBOX
// TODO: Add new documentation.
// TODO: "Add-new" documentation.
(function($) {

	/*****************************************************************************
	 * Initialize the combobox for all divs with the .combobox class.
	 */
	$(".combobox").each(function(){
		BuildCombobox($(this));
	});

	$(document).mouseup(function(e) {
		$(".combobox").each(function(){
			var $this = $(this);
			if(!$this.is(e.target) && $this.has(e.target).length === 0)
				$this.find(".dropdown-menu").hide();
		});
	});

	/*****************************************************************************
	 * When an option is selected from the dropdown, update the underlying select
	 *   element to have that option selected. Also set the input to contain the
	 *   selected value.
	 * @callback
	 */
	$(document).on("click", ".combobox a:not(.add-new-btn)", function(event){
		event.preventDefault();

		var $combobox = $(this).closest(".combobox");
		var $select = $combobox.find("select");
		var value = $(this).data("value");

		$combobox.find("input").val($(this).html());
		$select.find("option[value='" + value + "']").prop("selected", true);

		$combobox.find(".dropdown-menu").hide();
	}); // On Click .combobox li a

	$(document).on("click", ".combobox .btn, .combobox input", function() {
		$(this).closest(".combobox").find(".dropdown-menu").toggle();
	});

	/*****************************************************************************
	 * When any key is pressed within a combobox input, update the dropdown to
	 *   only show those options that match the input value.
	 * @callback
	 */
	$(document).on("keyup", ".combobox input", function() {
		FilterDropdownResults($(this).closest(".combobox"));
	});

	/*****************************************************************************
	 * Builds a combobox from a div containing an input and select element.
	 * @param [jQuery] $combobox The div containing the input and select element.
	 */
	function BuildCombobox($combobox) {
		// Flag to include an "Add New" button in the dropdown.
		var addNewBtn = $combobox.data("add");

		// Grab the important bits so we can use them later.
		var $select = $combobox.find("select");
		var $input  = $combobox.find("input");

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

	/*****************************************************************************
	 * Filters the contents of a combobox's dropdown based on the current value
	 *   of the input.
	 * @param [jQuery] $combobox The div containing the input and select element.
	 */
	function FilterDropdownResults($combobox) {
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
})(jQuery);
