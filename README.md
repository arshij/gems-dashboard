# gems-dashboard
Hello, World!
It's Pranav. I have decided to try editing on desktop.
 
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
	    * If the field is required, only the nested checkboxes satisfy the requirement
		* Simply checking the outer checkbox counts the field as empty
		* __CAUTION:__ Unchecking the outer checkbox automatically clears all nested checkboxes

2. Text Entry Fields
    * Drag-and-drop *is* allowed
	* Entering the field using the "tab" key *is* allowed
	
3. Dropdown menus
    * Only one item can be selected
	* Make sure to change the menu from the default value, "Please Select"
	
----

### Errors

1. Required Error
	* Occurs when not all required fields have been filled out
	* All required fields that are empty or invalid will be outlined in red
	* __Make sure you check all three tabs before clicking "submit" again

2. Validation Error
	* Occurs when text-entry fields have characters that look like code injection
	* Please write letters, numbers, and underscores *only*