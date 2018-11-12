// jQuery Document
var bar = document.getElementById("status");
var percent = 0;
var formData = "";

//Selects all required elements
var reqelements = document.getElementsByClassName("required");
var reqElementIds = [];
for(var i=0; i<reqelements.length; i++){
	reqElementIds[i] = reqelements[i].id;
}

function init(){
	formData = '{';
	//formData += "\"psn\": \"\", ";
	//formData += "\"appUrl\": \"\" ";
	formData += '}';
}
init();
var formJson = JSON.parse(formData);

//Populates the multi-select dropdowns
function populateMultiSelect(fieldName, length, target){
	target = "#" +target;
	for(var i=1; i<=length; i++){
		var content = fieldName +" " +i;
		var nameId = fieldName +i;
		var addfield = "<div class=\"multi-select-element\"><input id=\"" +nameId +"\" name=\"" +nameId +"\" type=\"checkbox\"/> <label class=\"multi-label\" for=\"" +nameId +"\">" +content +"</label></div>";
		$(target).append(addfield);
	}
}


function populateMultiSelectChild(fieldName, length, target){
	//target = "#" +target;
	$("div[name=\"" +target +"\"]").each(function(){
		for(var i=1; i<=length; i++){
			var content = fieldName +" " +i;
			var nameId = fieldName +i;
			var addfield = "<div class=\"multi-select-element\"><input id=\"" +nameId +"\" name=\"" +nameId +"\" type=\"checkbox\"/> <label class=\"multi-label\" for=\"" +nameId +"\">" +content +"</label></div>";
		}
	});
}
//populateMultiSelect("app", 3, "appName");
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
	}
	
	return;
}

///////////////////////   onChange Events for Form Elements //////////////////////
$("input[type=\"text\"]").on("mouseleave blur", function(){
	formJson[$(this).attr("id")] = $(this).val();
	console.log(formJson);
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

$("select").change(function(){
	
	formJson[$(this).attr("id")] = $(this).val();
	console.log(formJson);
	
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

//====== Parent multi-selects
$(".multi-select-element > input").change(function(){
	var addedBox = $(this).attr("id");
	var parent = $(this).parent().parent().attr("id");
	var nested = $(this).siblings(".multi-select").attr("name");
	
	if(typeof(formJson[parent]) == "undefined" && typeof(nested) == "undefined"){
		formJson[parent] = [];
		formJson[parent].push(addedBox);
		if($(this).parent().parent().is(".required")){
			progress();
			reqElementIds.splice(reqElementIds.indexOf(parent), 1);
		}
	}
	else if(typeof(nested) != "undefined"){
		if(typeof(formJson[parent]) == "undefined"){
			formJson[parent] = {};
		}
		
		if(typeof(formJson[parent][addedBox]) == "undefined"){
			formJson[parent][addedBox] = {};
			formJson[parent][addedBox][nested] = [];
		}
		else{
			delete formJson[parent][addedBox];
			//alert("Clearing all checkboxes!");
			$(".multi-select-element > .multi-select > input").each(function(){
				$(this).prop("checked", false);
			});
			if(Object.keys(formJson[parent]).length == 0){
				regress();
				reqElementIds.push(parent);
			}
		}
	}
	else if(formJson[parent].includes(addedBox)){
		var delInd = formJson[parent].indexOf(addedBox);
		formJson[parent].splice(delInd, 1);
		if($(this).parent().parent().is(".required") && formJson[parent].length == 0){
			regress();
			reqElementIds.push(parent);
		}
	}
	else if(formJson[parent].length > 0){
		formJson[parent].push(addedBox);
	}
	else{
		delete formJson[parent];
		regress();
		reqElementIds.push(parent);
	}
	console.log(JSON.stringify(formJson));
	
});

//====== Child/Nested multi-selects
$(".multi-select-element > .multi-select > input").change(function(){
	var parent = $(this).parent().parent().parent().attr("id");
	var relative = $(this).parent().siblings("input").attr("id");
	var subset = $(this).parent().attr("name");
	var thisBox = $(this).attr("id");
	
	if(formJson[parent][relative][subset].includes(thisBox)){
		var delInd = formJson[parent][relative][subset].indexOf(thisBox);
		formJson[parent][relative][subset].splice(delInd, 1);
		if($(this).parent().parent().parent().is(".required") && formJson[parent][relative][subset].length == 0){
			regress();
			reqElementIds.push(parent);
		}
	}
	else{
		formJson[parent][relative][subset].push(thisBox);
		if($(this).parent().parent().parent().is(".required") && formJson[parent][relative][subset].length == 1){
			progress();
			reqElementIds.splice(reqElementIds.indexOf(parent), 1);
		}
	}
	console.log(JSON.stringify(formJson));
});



//====== Application Names
/*var appNames = [];
var appI = 0;
$("#appName input").each(function(){
	if($(this).is(":checked")){
		appNames.push($(this).attr("name"));
		appI++;
	}
});
$("#appName input").change(function(){
	var addedBox = $(this).attr("name");
	if(!$(this).is(":checked")){
		var delInd = appNames.indexOf(addedBox);
		appNames.splice(delInd, 1);
		appI--;
		
		if(appNames.length == 0 && !elementid.includes("appName")){
			regress();
			elementid.push("appName");
		}
	}
	else{
		appNames[appI] = addedBox;
		appI++;
		if(elementid.includes("appName")){
			progress();
			elementid.splice(elementid.indexOf("appName"), 1);
		}
	}
	//console.log(appNames);
});
*/
//====== Tracks
/*formJson.track = {};
$("#track > .multi-select-element > input").change(function(){
	var addedBox = $(this).attr("name");
	if($(this).is(":checked")){
		formJson.track[addedBox] = {};
		if(typeof(formJson.track[addedBox]["subtracks"]) == "undefined"){
			formJson.track[addedBox]["subtracks"] = [];
		}
	}
	else{
		delete formJson.track[addedBox];
	}
	console.log(JSON.stringify(formJson));
	
});
/*
$("#subtrack > .multi-select-element > input").change(function(){
	
	var addedBox = $(this).attr("name");
	formJson.track.subtrack = addedBox;
	if($(this).is(":checked")){
		var delInd = subnames.indexOf(addedBox);
		subnames.splice(delInd, 1);
		subI--;
		if(subnames.length == 0 && !elementid.includes("subtrack")){
			regress();
			elementid.push("subtrack");
		}
	}
	else{
		subnames[subI] = addedBox;
		subI++;
		if(elementid.includes("subtrack")){
			progress();
			elementid.splice(elementid.indexOf("subtrack"), 1);
		}
	}
	//console.log(subnames);
});

//====== Databases
var dbnames = [];
var dbI = 0;
$("#db input").each(function(){
	if($(this).is(":checked")){
		dbnames.push($(this).attr("name"));
		dbI++;
	}
});
$("#db input").change(function(){
	var addedBox = $(this).attr("name");
	if(!$(this).is(":checked")){
		var delInd = dbnames.indexOf(addedBox);
		dbnames.splice(delInd, 1);
		dbI--;
		if(dbnames.length == 0 && !elementid.includes("db")){
			regress();
			elementid.push("db");
		}
	}
	else{
		dbnames[dbI] = addedBox;
		dbI++;
		if(elementid.includes("db")){
			progress();
			elementid.splice(elementid.indexOf("db"), 1);
		}
	}
	//console.log(dbnames);
});

//====== JVM Names
var jvmNames = [];
var jvmI = 0;
$("#jvmName input").each(function(){
	if($(this).is(":checked")){
		jvmNames.push($(this).attr("name"));
		jvmI++;
	}
});
$("#jvmName input").change(function(){
	var addedBox = $(this).attr("name");
	if(!$(this).is(":checked")){
		var delInd = jvmNames.indexOf(addedBox);
		jvmNames.splice(delInd, 1);
		jvmI--;
		if(jvmNames.length == 0 && !elementid.includes("jvmName")){
			regress();
			elementid.push("jvmName");
		}
	}
	else{
		jvmNames[jvmI] = addedBox;
		jvmI++;
		if(elementid.includes("jvmName")){
			progress();
			elementid.splice(elementid.indexOf("jvmName"), 1);
		}
	}
	//console.log(jvmNames);
});

//====== Host Names
var hostNames = [];
var hostI = 0;
$("hostName input").each(function(){
	if($(this).is(":checked")){
		hostNames.push($(this).attr("name"));
		hostI++;
	}
});
$("#hostName input").change(function(){
	var addedBox = $(this).attr("name");
	if(!$(this).is(":checked")){
		var delInd = hostNames.indexOf(addedBox);
		hostNames.splice(delInd, 1);
		hostI--;
		if(hostNames.length == 0 && !elementid.includes("hostName")){
			regress();
			elementid.push("hostName");
		}
	}
	else{
		hostNames[hostI] = addedBox;
		hostI++;
		if(elementid.includes("hostName")){
			progress();
			elementid.splice(elementid.indexOf("hostName"), 1);
		}
	}
	//console.log(hostNames);
});
*/

////////////////////////////////////////////////////////////////////////////////////////////////////
