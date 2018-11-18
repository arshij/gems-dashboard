# gems-dashboard
 
***
# User Guide 

_____

### Form Elements

1. Multi-select menus
    * List of checkboxes with labels
	* Either the checkbox or the label can be clicked
	* The label turns blue when the checkbox is checked
	* __If there is a nested multi-select menu__ (A multi-select menu *within* another multi-select menu):
		* Clicking the outer checkbox reveals the inner multi-select menu
		* Clicking the arrow to the right of the label reveals and hides the inner multi-select menu
	    * If the field is required, only the nested checkboxes satisfy the requirement
		* Simply checking the outer checkbox counts the field as empty
		* __CAUTION:__ Unchecking the outer checkbox automatically clears all nested checkboxes
		
2. Text Entry Fields
    * Drag-and-drop *is* allowed
	* Entering the field using the "tab" key *is* allowed
	
3. Dropdown menus
    * Only one item can be selected
	* Make sure to change the menu from the default value, "Please Select"
	* __For the "Related To" dropdown:__
		* The options are populated from whatever is selected in the "track" multi-select menu
		* Unchecking a box from "track" removes it form "Related To"
		* If you selected a track in "Related To" but unchecked it from "Track", then the "Related To" will revert to the default value
	
----

### Errors

1. Required Error
	* Occurs when not all required fields have been filled out
	* All required fields that are empty will be outlined in red
	* __Make sure you check all three tabs before clicking "submit" again__

2. Validation Error
	* Occurs when text-entry fields have characters that look like code injection
	* All fields that are invalid will be outlined in red
	* Please write letters, numbers, and underscores *only*