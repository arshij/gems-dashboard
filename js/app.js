// jQuery Document
var bar = document.getElementById("status");
var percent = 0;
//var formData = "";

//Selects all required elements
var reqelements = document.getElementsByClassName("required");
var reqElementIds = [];
for(var i=0; i<reqelements.length; i++){
	reqElementIds[i] = reqelements[i].id;
}

/*function init(){
	formData = '{';
	//formData += "\"psn\": \"\", ";
	//formData += "\"appUrl\": \"\" ";
	formData += '}';
}*/
//init();
var formJson = {};//JSON.parse(formData);

//Populates the multi-select dropdowns
function populateMultiSelect(fieldName, length, target){
	target = "#" +target;
	for(var i=1; i<=length; i++){
		var content = fieldName +" " +i;
		var nameId = fieldName +i;
		var addfield = "<div class=\"multi-select-element\"><input id=\"" +nameId +"\" name=\"" +nameId +"\" type=\"checkbox\"/> <label class=\"multi-label multi-label-full\" for=\"" +nameId +"\">" +content +"</label></div>";
		$(target).append(addfield);
	}
}


function populateMultiSelectChild(fieldName, length, target){
	//target = "#" +target;
	$("div[name=\"" +target +"\"]").each(function(){
		for(var i=1; i<=length; i++){
			var content = fieldName +" " +i;
			var nameId = fieldName +i;
			var addfield = "<div class=\"multi-select-element\"><input id=\"" +nameId +"\" name=\"" +nameId +"\" type=\"checkbox\"/> <label class=\"multi-label multi-labal-full\" for=\"" +nameId +"\">" +content +"</label></div>";
		}
	});
}

populateMultiSelect("app", 6, "appName");
populateMultiSelect("database", 8, "db");

//Populates the dropdown menus
function populateDropdown(fieldName, length, target){
	target = "#" +target;
	$(target).append("<option value=\"0\">-- Please Select --</option>");
	for(var i=1; i<length; i++){
		$(target).append("<option value=\""+ fieldName +i +"\">" + fieldName +" " +i +"</option>");
	}
}

//Moves the progress bar forward
function progress(){
	var barwidth = bar.style.width;
	barwidth = barwidth.substr(0, barwidth.length -1);
	if(Number(barwidth) < 100){
		percent += 1/reqelements.length * 100;
		bar.style.width = percent+"%";
	}
}

//Moves the progress bar backward
function regress(){
	var barwidth = bar.style.width;
	barwidth = barwidth.substr(0, barwidth.length -1);
	if(Number(barwidth) > 0){
		percent -= 1/reqelements.length * 100;
		bar.style.width = percent+"%";
	}
}

//Validates form
function validate(){
	var idstyle;
	$(".required").each(function(){
		$(this).removeClass("req-show");
	});
	if(reqElementIds.length>0){
		alert("Some fields were not filled out. Please check all 3 tabs.");
		for(var i=0; i<reqElementIds.length; i++){
			idstyle = "#" +reqElementIds[i];
			$(idstyle).addClass("req-show");
		}
		return;
	}
	else{
		$("#dash").slideUp(500);
		$("#success").slideDown(500);
		$("#success").prepend("<p>" +JSON.stringify(formJson) +"</p>");
	}
	
	return;
}



///////////////////////   onChange Events for Form Elements //////////////////////

//====== Text boxes
$("input[type=\"text\"]").on("mouseleave blur", function(){
	/* When the user moves the mouse away from the text field (drag and drop) or when they click away from it, check if we need to 
	 * progress the bar
	 */
	formJson[$(this).attr("id")] = $(this).val();
	
	if($(this).is(".required")){
		if($(this).val() == "" && !reqElementIds.includes($(this).attr("id"))){
			regress();
			reqElementIds.push($(this).attr("id"));
		}
		else if(reqElementIds.includes($(this).attr("id")) && $(this).val() != ""){
			progress();
			reqElementIds.splice(reqElementIds.indexOf($(this).attr("id")), 1);
		}
	}
	
});

//====== Dropdown-menus
$("select").change(function(){
	
	formJson[$(this).attr("id")] = $(this).val();
	
	if($(this).is(".required")){
		if($(this).val().length > 1 && reqElementIds.includes($(this).attr("id"))){
			progress();
			reqElementIds.splice(reqElementIds.indexOf($(this).attr("id")), 1);
		}
		else if($(this).val().length <= 1){
			regress();
			reqElementIds.push($(this).attr("id"));
		}	
	}
});

//====== Toggle dropdown buttons in multi-select menus
$(".dropdown-toggle").click(function(){
	$(this).siblings(".multi-select").toggle(1000);
	var rotation;
	if($(this).attr("style")){
		rotation = parseInt($(this).attr("style").substr(18, 3));
	}
	else{
		rotation = 0;
	}
	console.log(rotation);
	rotation = 180 - rotation;
	$(this).css("transform", "rotate(" +rotation +"deg)");
});

//====== Parent multi-selects
$(".multi-select-element > input").change(function(){
	var addedBox = $(this).attr("id");
	var parent = $(this).parent().parent().attr("id");
	var nested = $(this).siblings(".multi-select").attr("name");
	
	if($(this).is(":checked")){
		$(this).siblings(".multi-select").show();
		$(this).siblings(".dropdown-toggle").css("transform", "rotate(180deg)");
	}
	
	/* This block runs if the multi-select does not have a nested multi-select. It only runs once per session,  
	 * to initialize the JSON object
	 */
	if(typeof(nested) == "undefined"){
		//Initialize array
		if(typeof(formJson[parent]) == "undefined"){
			formJson[parent] = [];
		}
		//If the array exists and the current checkbox is in it, delete it.
		if(formJson[parent].indexOf(addedBox) >= 0){
			formJson[parent].splice(formJson[parent].indexOf(addedBox), 1);
			if($("#" +parent).is(".required") && formJson[parent].length == 0){
				regress();
				reqElementIds.push(parent);
			}
		}
		//Else the array exists and the current element is not in it, so we add it in.
		else{
			formJson[parent].push(addedBox);
			if($("#" +parent).is(".required") && formJson[parent].length == 1){
				progress();
				reqElementIds.splice(reqElementIds.indexOf(parent), 1);
			}
			
		}
	}
	
	//If there is a nested multi-select, checking a parent checkbox does not progress the slider.
	else{
		//This block initializes the JSON object and runs once per session.
		if(typeof(formJson[parent]) == "undefined"){
			formJson[parent] = {};
		}
		//This block initializes the JSON object for the nested multi-select. It runs every time the object is deleted.
		if(typeof(formJson[parent][addedBox]) == "undefined"){
			formJson[parent][addedBox] = {};
			formJson[parent][addedBox][nested] = [];
		}
		//This block runs if the parent checkbox is unchecked. It unchecks all nested checkboxes.
		else{
			delete formJson[parent][addedBox];
			
			$(".multi-select-element > .multi-select > input").each(function(){
				$(this).prop("checked", false);
			});
			
			if($("#" +parent).is(".required") && Object.keys(formJson[parent]).length == 0){
				regress();
				reqElementIds.push(parent);
			}
		}
		
		//Bind the options in the relTo dropdown menu to whatever is checked in the "track" multi-select
		if(parent == "track"){
			var inpName = $(this).siblings("label").html();
			if($(this).is(":checked")){
				$("#relTo").append("<option value=\"" +addedBox +"\">" +inpName +"</option>")
			}
			else{
				//alert("unchecked");
				$("#relTo option[value=\"" +addedBox +"\"]").remove();
			}
		}
	}
	
	console.log(JSON.stringify(formJson));
	
});

//====== Child/Nested multi-selects
$(".multi-select-element > .multi-select > input").change(function(){
	var parent = $(this).parent().parent().parent().attr("id");
	var relative = $(this).parent().siblings("input").attr("id");
	var subset = $(this).parent().attr("name");
	var thisBox = $(this).attr("id");
	
	if(!$("#" +relative).is(":checked")){
		$("#" +relative).prop("checked", true);
		$("#" +relative).trigger("change");
	}
	
	//If the checkbox has already been logged, then the user wants to delete it.
	if(formJson[parent][relative][subset].includes(thisBox)){
		var delInd = formJson[parent][relative][subset].indexOf(thisBox);
		formJson[parent][relative][subset].splice(delInd, 1);
		if($(this).parent().parent().parent().is(".required") && formJson[parent][relative][subset].length == 0){
			regress();
			reqElementIds.push(parent);
		}
	}
	//Otherwise, add it to the JSON object
	else{
		formJson[parent][relative][subset].push(thisBox);
		if($(this).parent().parent().parent().is(".required") && formJson[parent][relative][subset].length == 1){
			progress();
			reqElementIds.splice(reqElementIds.indexOf(parent), 1);
		}
	}
	console.log(JSON.stringify(formJson));
});


//////////////////////////////////////////// END //////////////////////////////////////////////////
