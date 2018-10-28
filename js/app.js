// JavaScript Document
var bar = document.getElementById("status");
var percent = 0;
var elements = document.getElementsByClassName("required"); //Selects all required elements
var elementid = [];
for(var i=0; i<elements.length; i++){
	elementid[i] = elements[i].id;
}
//console.log(elementid);

function progress(){
	var barwidth = bar.style.width;
	barwidth = barwidth.substr(0, barwidth.length -1);
	if(Number(barwidth) < 100){
		percent += 1/elements.length * 100;
		bar.style.width = percent+"%";
	}
}

function regress(){
	var barwidth = bar.style.width;
	barwidth = barwidth.substr(0, barwidth.length -1);
	if(Number(barwidth) > 0){
		percent -= 1/elements.length * 100;
		bar.style.width = percent+"%";
	}
}

function validate(){
	var idstyle;
	if(elementid.length>0){
		alert("Some fields were not filled out. Please check all 3 tabs.");
		for(var i=0; i<elementid.length; i++){
			idstyle = "#" +elementid[i];
			$(idstyle).addClass("req-show");
			return;
		}
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
	postService = $("#soname").val();
	postProcess = $("#pname").val();
	postJobName = $("#jname").val();
	postType = $("#type").val();
	postRel = $("#relto").val();
	postHostEnv = $("#hostEnv").val();
	
	console.log(appnames +", " +postConsExpo +", " +tracknames +", " +subnames +", " +postAppUrl +", " +postService +", " +postProcess +", " +postJobName +", " +postType +", " +dbnames +", " +postRel +", " +jvmnames +", " +hostnames +", " +postHostEnv);
	
	return;
}

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
var appnames = [];
var appI = 0;
$("#appname input").each(function(){
	if($(this).is(":checked")){
		appnames.push($(this).attr("name"));
		appI++;
	}
});
$("#appname input").change(function(){
	var addedBox = $(this).attr("name");
	if(!$(this).is(":checked")){
		var delInd = appnames.indexOf(addedBox);
		appnames.splice(delInd, 1);
		appI--;
		
		if(appnames.length == 0 && !elementid.includes("appname")){
			regress();
			elementid.push("appname");
		}
	}
	else{
		appnames[appI] = addedBox;
		appI++;
		if(elementid.includes("appname")){
			progress();
			elementid.splice(elementid.indexOf("appname"), 1);
		}
	}
	//console.log(appnames);
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
var jvmnames = [];
var jvmI = 0;
$("#jvmname input").each(function(){
	if($(this).is(":checked")){
		jvmnames.push($(this).attr("name"));
		jvmI++;
	}
});
$("#jvmname input").change(function(){
	var addedBox = $(this).attr("name");
	if(!$(this).is(":checked")){
		var delInd = jvmnames.indexOf(addedBox);
		jvmnames.splice(delInd, 1);
		jvmI--;
		if(jvmnames.length == 0 && !elementid.includes("jvmname")){
			regress();
			elementid.push("jvmname");
		}
	}
	else{
		jvmnames[jvmI] = addedBox;
		jvmI++;
		if(elementid.includes("jvmname")){
			progress();
			elementid.splice(elementid.indexOf("jvmname"), 1);
		}
	}
	//console.log(jvmnames);
});

//====== Host Names
var hostnames = [];
var hostI = 0;
$("hostname input").each(function(){
	if($(this).is(":checked")){
		hostnames.push($(this).attr("name"));
		hostI++;
	}
});
$("#hostname input").change(function(){
	var addedBox = $(this).attr("name");
	if(!$(this).is(":checked")){
		var delInd = hostnames.indexOf(addedBox);
		hostnames.splice(delInd, 1);
		hostI--;
		if(hostnames.length == 0 && !elementid.includes("hostname")){
			regress();
			elementid.push("hostname");
		}
	}
	else{
		hostnames[hostI] = addedBox;
		hostI++;
		if(elementid.includes("hostname")){
			progress();
			elementid.splice(elementid.indexOf("hostname"), 1);
		}
	}
	//console.log(hostnames);
});

////////////////////////////////////////////////////////////////////////////////////////////////////
