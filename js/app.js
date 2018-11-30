// jQuery Document
var bar = document.getElementById("status");
var percent = 0;

//===== Selects all required elements
var reqelements = document.getElementsByClassName("required");
var reqElementIds = [];
for(var i=0; i<reqelements.length; i++){
	reqElementIds[i] = reqelements[i].id;
}

var formJson = {"process": "Y"};

//===== Check if a multi-select object is already in formJson (which means it should be deleted)
function jsonElementId(element, section){
	for(var i=0; i<formJson[section].length; i++){
		if(formJson[section][i]["name"] == element){
			return i;
		}
	}
	return -1;
}

//===== Validates and processes form. VERY important.
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
		$(".spinner").show(); //Shows loading wheel
		$("#dash").slideUp(500);
		$("#success").slideDown(500);

		$("#notifications").append("<em>Sending Data...</em><br>");

		$.ajax({
			type: "POST",
			contentType: "application/JSON",
			data: JSON.stringify(formJson),
			url: "/send",
			success: function(data){ //The parameter "data" is the response from server.js. If you delete the response, delete "data".
				$("#notifications").append("<em>Finished!</em><br>");
				$(".spinner").hide();
			},
			error: function(err){
				$("#notifications").append("<strong>Back-end error: There was a problem writing to the database.</strong><br>");
				$(".spinner").hide();
				console.log(JSON.stringify(err));
				throw err;
			}
		});
	}

	return;
}


///////////////////////   onChange Events for Form Elements //////////////////////

//===== Moves the progress bar forward
function progress(){
	var barwidth = bar.style.width;
	barwidth = barwidth.substr(0, barwidth.length -1);
	if(Number(barwidth) < 100){
		percent += 1/reqelements.length * 100;
		bar.style.width = percent+"%";
	}
}

//===== Moves the progress bar backward
function regress(){
	var barwidth = bar.style.width;
	barwidth = barwidth.substr(0, barwidth.length -1);
	if(Number(barwidth) > 0){
		percent -= 1/reqelements.length * 100;
		bar.style.width = percent+"%";
	}
}

//====== Text boxes
$("input[type=\"text\"]").on("mouseleave blur", function(){
	/* When the user moves the mouse away from the text field (drag and drop) or when
	 * they click away from it, check if we need to progress the bar
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

//====== Toggle dropdown caret in multi-select menus
$(".dropdown-toggle").click(function(){
	$(this).siblings(".multi-select").toggle();
	var rotation;
	if($(this).attr("style")){
		rotation = parseInt($(this).attr("style").substr(18, 3));
	}
	else{
		rotation = 0;
	}
	//console.log(rotation);
	rotation = 180 - rotation;
	$(this).css("transform", "rotate(" +rotation +"deg)");
});

//====== Parent multi-selects
$(".multi-select-element > input").change(function(){
	var addedBox = $(this).attr("id");
	var parent = $(this).parent().parent().attr("id");
	var nested = $(this).siblings(".multi-select").attr("name");
	var inpName = $(this).siblings("label").html();

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
			formJson[parent] = [];
		}
		//This block initializes the JSON object for the nested multi-select. It runs every time the checkbox is checked.
		if(jsonElementId(inpName, parent) == -1){
			var tempJson = "{\"name\": \"" +inpName +"\", \"" +nested +"\": []}";
			console.log(tempJson);
			formJson[parent].push(JSON.parse(tempJson));
		}
		//This block runs if the parent checkbox is unchecked by the user. It unchecks all nested checkboxes.
		else{
			formJson[parent].splice(jsonElementId(inpName, parent), 1);

			$(".multi-select-element > .multi-select > input").each(function(){
				$(this).prop("checked", false);
			});

			if($("#" +parent).is(".required") && formJson[parent].length == 0){
				regress();
				reqElementIds.push(parent);
			}

			if(parent == "track"){
				$("#related_to option[value=\"" +inpName +"\"]").remove();
			}
		}

		//Bind the options in the relTo dropdown menu to whatever is checked in the "track" multi-select
	}

	console.log(JSON.stringify(formJson));

});

//====== Child/Nested multi-selects
$(".multi-select-element > .multi-select > input").change(function(){
	var parent = $(this).parent().parent().parent().attr("id");
	var relative = $(this).parent().siblings("input").attr("id");
	var subset = $(this).parent().attr("name");
	var thisBox = $(this).attr("id");
	var thisLabel = $("label[for=\"" +thisBox +"\"]").html();
	var inpName = $("#" +relative).siblings("label").html();

	if(!$("#" +relative).is(":checked")){
		$("#" +relative).prop("checked", true);
		$("#" +relative).trigger("change");
	}

	var relativeInd = jsonElementId(inpName, parent);
	//If the checkbox has already been logged, then the user wants to delete it.
	if(formJson[parent][relativeInd][subset].includes(thisLabel)){
		var delInd = formJson[parent][relativeInd][subset].indexOf(thisLabel);
		formJson[parent][relativeInd][subset].splice(delInd, 1);
		if(formJson[parent][relativeInd][subset].length == 0){
			formJson[parent].splice(relativeInd, 1);
			$("#" +relative).prop("checked", false);
			if($("#" +parent).is(".required") && formJson[parent].length == 0){
				regress();
				reqElementIds.push(parent);
			}

			if(parent == "track"){
				$("#related_to option[value=\"" +inpName +"\"]").remove();
			}
		}
	}
	//Otherwise, add it to the JSON object
	else{
		if(!$("#" +relative).is(":checked")){
			$("#" +relative).prop("checked", true);
			$("#" +relative).trigger("change");
		}

		formJson[parent][relativeInd][subset].push(thisLabel);
		if($("#" +parent).is(".required") && reqElementIds.includes(parent)){
			progress();
			reqElementIds.splice(reqElementIds.indexOf(parent), 1);
		}

		//If the user checks a box in the track menu, add it to the relTo dropdown.
		if(formJson[parent][relativeInd][subset].length == 1 && parent == "track"){
			$("#related_to").append("<option value=\"" +inpName +"\">" +inpName +"</option>");
		}
	}
	console.log(JSON.stringify(formJson));
});


//////////////////////////////////////////// END //////////////////////////////////////////////////
