// jQuery Document
var bar = document.getElementById("status");
var percent = 0;

//Selects all required elements
var elements = document.getElementsByClassName("required");
var elementid = [];
for(var i=0; i<elements.length; i++){
	elementid[i] = elements[i].id;
}

//Populates the multi-select dropdowns
function populateMultiSelect(fieldName, length, target){
	target = "#" +target;
	for(var i=1; i<=length; i++){
		$(target).append("<input name=\""+ fieldName+i +"\" type=\"checkbox\" id=\""+ fieldName+i +"\" selected=\"\"/><label class=\"multi-label\" for=\""+ fieldName+i +"\">"+ fieldName+i +"</label><br>");
	}
}
populateMultiSelect("app", 3, "appName");
populateMultiSelect("host", 6, "hostName");

//Populates the dropdown menus
function populateDropdown(fieldName, length, target){
	target = "#" +target;
	for(var i=1; i<length; i++){
		$(target).append("<option value=\""+ fieldName +i +"\">" + fieldName +" " +i +"</option>");
	}
}

//Moves the progress bar forward
function progress(){
	var barwidth = bar.style.width;
	barwidth = barwidth.substr(0, barwidth.length -1);
	if(Number(barwidth) < 100){
		percent += 1/elements.length * 100;
		bar.style.width = percent+"%";
	}
}

//Moves the progress bar backward
function regress(){
	var barwidth = bar.style.width;
	barwidth = barwidth.substr(0, barwidth.length -1);
	if(Number(barwidth) > 0){
		percent -= 1/elements.length * 100;
		bar.style.width = percent+"%";
	}
}

//Validates form
function validate(){
	var idstyle;
	if(elementid.length>0){
		alert("Some fields were not filled out. Please check all 3 tabs.");
		for(var i=0; i<elementid.length; i++){
			idstyle = "#" +elementid[i];
			$(idstyle).addClass("req-show");
		}
		return;
	}
	else{
		$(".required").each(function(){
			$(this).removeClass("req-show");
		});
		$("#dash").slideUp(500);
		$("#success").slideDown(500);
	}
	var postConsExpo, postAppUrl, postService, postProcess, postJobName, postType, postRel, postHostEnv;
	postConsExpo = $("#consExpo").val();
	postAppUrl = $("#appUrl").val();
	postService = $("#serviceOff").val();
	postProcess = $("#process").val();
	postJobName = $("#jobName").val();
	postType = $("#type").val();
	postRel = $("#relTo").val();
	postHostEnv = $("#hostEnv").val();
	
	console.log(appNames +", " +postConsExpo +", " +tracknames +", " +subnames +", " +postAppUrl +", " +postService +", " +postProcess +", " +postJobName +", " +postType +", " +dbnames +", " +postRel +", " +jvmNames +", " +hostNames +", " +postHostEnv);
	
	return;
}


///////////////////////   onChange Events for Form Elements (Excluding multi-select) //////////////////////
$("input[type=\"text\"].required").change(function(){
	if($(this).val() == "" && !elementid.includes($(this).attr("id"))){
		regress();
		elementid.push($(this).attr("id"));
	}
	else if(elementid.includes($(this).attr("id"))){
		progress();
		elementid.splice(elementid.indexOf($(this).attr("id")), 1);
	}
});

$("select.required").change(function(){
	if($(this).val().length > 1 && elementid.includes($(this).attr("id"))){
		progress();
		elementid.splice(elementid.indexOf($(this).attr("id")), 1);
	}
	else if($(this).val().length <= 1){
		regress();
		elementid.push($(this).attr("id"));
	}
});

/////////////////////////////////////    Multi-Select Dropdowns   ///////////////////////////////////////
//====== Application Names
var appNames = [];
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

//====== Tracks
var tracknames = [];
var trackI = 0;
$("#track input").each(function(){
	if($(this).is(":checked")){
		tracknames.push($(this).attr("name"));
		trackI++;
	}
});
$("#track input").change(function(){
	var addedBox = $(this).attr("name");
	if(!$(this).is(":checked")){
		var delInd = tracknames.indexOf(addedBox);
		tracknames.splice(delInd, 1);
		trackI--;
		if(tracknames.length == 0 && !elementid.includes("track")){
			regress();
			elementid.push("track");
		}
	}
	else{
		tracknames[trackI] = addedBox;
		trackI++;
		if(elementid.includes("track")){
			progress();
			elementid.splice(elementid.indexOf("track"), 1);
		}
	}
	//console.log(tracknames);
	
});

//====== Subtracks
var subnames = [];
var subI = 0;
$("#subtrack input").each(function(){
	if($(this).is(":checked")){
		subnames.push($(this).attr("name"));
		subI++;
	}
});
$("#subtrack input").change(function(){
	var addedBox = $(this).attr("name");
	if(!$(this).is(":checked")){
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

////////////////////////////////////////////////////////////////////////////////////////////////////
