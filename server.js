/* MongoDB database information:
 * "dummydatabase": contains the populated data
 * "userinput": contains modified user input data (add 'process_state_code', 'NAME', 'process')
    from which the Excel sheets will be created
 */

var express = require("express"); //require for expressing css,jquery, bootstrap
var bodyparser = require("body-parser"); //returns middleware that parses json
var mongoose = require("mongoose"); //mongoose middleware
var MongoClient = require('mongodb').MongoClient; //connect using a server instance
var urlencodedParser = bodyparser.urlencoded({extended: false}); //need bodyparser if want form data to be available  in req.body

var app = express(); //calling the express module to import applications to our app
app.set("view engine", "ejs"); //Tells express to render .ejs files in the views directory as html and not plain text.
app.use(bodyparser.json()); //telling our system that we want to read json from the UI

var url = "mongodb://gems:Cisco123@ds261917.mlab.com:61917/gemsdashboard"; //url to connect to mongo

mongoose.connect(url, {useNewUrlParser: true});

var gemsGetSchema = new mongoose.Schema({ //layout of our data structuring model for getting data to populate UI
	application_name: [String],
	consumed_exposed: [String],
	track: [
		{"name": String, "subtrack": [String]}
	],
	service_offering_name: [String],
	type: [String],
	database: [String],
	related_to: [String],
	jvm_name: [
		{"name": String, "host": [String]}
	],
	host_env: [String]
});

/*var gemsPostSchema = new mongoose.Schema({
	process_state_code: String,
	process_state_name: String,
	application_name: String,
	consumed_exposed: String,
	track: String,
	subtrack: String,
	app_url: String,
	service_offering_name: String,
	process_name: String,
	job_name: String,
	type: String,
	database: String,
	related_to: String,
	jvm_name: String,
	host: String,
	host_env: String
}); *///LEGACY

var gemsPostJobs = new mongoose.Schema({ //data schema  structure for jobs excel sheet
	application_name: String,
	service_offering_name: String,
	process_state_name: String,
	process_state_code: String,
	process_name: String,
	job_name: String,
	type: String,
	database: String,
	process: String,
	related_to: String,
	versionKey: false
});

var gemsPostService = new mongoose.Schema({//data schema structure for service, one of the four excel templates
	application_name: String,
	name: String,
	value: String,
	consumed_exposed: String,
	process_state_name: String
});

var gemsPostJvms = new mongoose.Schema({//data schema structure for JVM, one of the four excel templates
	application_name: String,
	jvm_name: String,
	host: String,
	host_env: String,
	process_state_code: String,
	process: String
});

var gemsPostProcessFlow = new mongoose.Schema({//data schema  structure for process flow state, one of the excel sheets
	process_state_name: String,
	process_state_code: String,
	track: String,
	subtrack: String,
	process: String
});


var gemsGetModel = mongoose.model("gemsGetModel", gemsGetSchema, "dummydatabase"); //The third parameter is the collection of the database. Change as necessary

var gemsPostJobsModel = mongoose.model("gemsPostJobsModel", gemsPostJobs, "job");//a model is a copy of our structure schema, in this case job
var gemsPostServiceModel = mongoose.model("gemsPostServiceModel", gemsPostService, "serviceurl");
var gemsPostJVMSModel = mongoose.model("gemsPostJVMSModel", gemsPostJvms, "jvm");
var gemsPostProcessFlowModel = mongoose.model("gemsPostProcessFlowModel", gemsPostProcessFlow, "processflowmodel");

app.listen(3000); //Arbitrarily make the app listen to port 3000.

//Initialize all files and dependencies.
app.get("/", function(req, res){
	//res.sendFile(__dirname +"/index.html");
	gemsGetModel.find().then(function(doc){
		//console.log(doc[0]);
		res.render("home", {data: doc[0]});
	});
});

app.get("/index.html", function(req, res){ //get our homepage
	gemsGetModel.find().then(function(doc){
		res.render("home", {data: doc[0]});
	});
});


app.get("/css/style.css", function(req, res){//showcase our css for homepage
	res.sendFile(__dirname +"/css/style.css");
});

app.get("/js/app.js", function(req, res){//showcase js
	res.sendFile(__dirname +"/js/app.js");
});

app.get("/readme.md", function(req, res){//get our readme
	res.sendFile(__dirname +"/readme.md");
});

app.get("/images/Cisco_logo_blue_2016.png", function(req, res){//get our Cisco picture logo
	res.sendFile(__dirname +"/images/Cisco_logo_blue_2016.png");
});


app.get("/populateUI", function(req, res){ //grab inputs to our form fields. NOTE: This is legacy code
	gemsGetModel.find().then(function(doc){
		res.send(doc[0]);
	});
});

//The almighty send function that posts everything to MongoDB.
app.post("/send", urlencodedParser, function(req, res){//Summary: this function will use json, retrieve all user data, and put in in our mongoose model schema*/
	var formJson = req.body; //main object that handles HTTP requests
	var tempJson = JSON.parse(JSON.stringify(formJson));//make json and convert to string to handle server requests

	//This block deletes the array elements in tempJson. Now there are only Strings
	delete tempJson.track;
	delete tempJson.jvm_name;
	delete tempJson.application_name;
	delete tempJson.database;

	/* Nested loops
	 *    - Each for loop gets each element from the four arrays listed above, as
	 *      well as for track and jvm_name's nested arrays "subtracks" and "hosts"
	 *    - In the innermost loop, we add tempJson's contents to MongoDB
	 */
	for(var i=0; i < formJson.track.length; i++){//the nested for loops assigns all combinations of user inputs ,of  multiselect forms ,in our row in excel sheets
		tempJson.track = formJson.track[i]["name"];
		var process_state_code = tempJson.process_state_name.replace(/ /g, "_").toLowerCase() +"_" +tempJson.track.replace(/ /g, "_").toLowerCase();
		tempJson.process_state_code = process_state_code;

		for(var j=0; j < formJson.jvm_name.length; j++){
			tempJson.jvm_name = formJson.jvm_name[j]["name"];

			for(var k=0; k < formJson.application_name.length; k++){
				tempJson.application_name = formJson.application_name[k];

				for(var m=0; m < formJson.database.length; m++){
					tempJson.database = formJson.database[m];

					for(var ii=0; ii<formJson.track[i]["subtracks"].length; ii++){
						tempJson.subtrack = formJson.track[i]["subtracks"][ii];

						for(var jj=0; jj< formJson.jvm_name[j]["hosts"].length; jj++){
							tempJson.host = formJson.jvm_name[j]["hosts"][jj];

							// Four save functions are for the four spreadsheets that will be generated. Each
							// has its own schema, as listed on lines 56-93
							gemsPostJobsModel(tempJson).save(function(err, data){
								if(err) throw err;
							});

							gemsPostServiceModel(tempJson).save(function(err, data){
								if(err) throw err;
							});

							gemsPostJVMSModel(tempJson).save(function(err, data){
								if(err) throw err;
							});

							gemsPostProcessFlowModel(tempJson).save(function(err, data){
								if(err) throw err;
							});

							//console.log(JSON.stringify(tempJson));
							//console.log("=================================================");
						}

					}

				}

			}
		}
	}

	res.json(tempJson); //Optional. But if you remove this, remove the parameter from the success function in app.js
});

/* Excel Sheets */

var Excel = require('exceljs');//need to npm install exceljs

var jobs = new Excel.Workbook();//create worbook and worksheet for excel
var jobsws = jobs.addWorksheet('Jobs');
var jvms = new Excel.Workbook();
var jvmsws = jvms.addWorksheet('JVMs');
var processflow = new Excel.Workbook();
var processflowws = processflow.addWorksheet('Process Flow States');
var serviceurl = new Excel.Workbook();
var serviceurlws = serviceurl.addWorksheet('Service URL');

MongoClient.connect(url, {useNewUrlParser: true}, function(err, db) {//connect mongo with url, which has mongo name, port, etc
    if (err) throw err;
    var dbo = db.db("gemsdashboard");//gemsdashboard is our database

	var distinctProcessStateCode = [];//initialize arrays for capturing distinct inputs from all multiselect category
	var distinctApplicationName = [];
	var distinctDatabase = [];
	var distinctJVMName = [];
	var distinctHost = [];
	var distinctTrack = [];
	var distinctSubtrack = [];

	// Removing duplicates from database for JOBS
	// Else Excel populates with duplicate rows

	dbo.collection("job").distinct('process_state_code', function(err, docs) {
		docs.forEach(function(doc) {
			distinctProcessStateCode.push(doc);
		});

		dbo.collection("job").distinct('application_name', function(err, docs) {
		docs.forEach(function(doc) {
			distinctApplicationName.push(doc);
		});

			dbo.collection("job").distinct('database', function(err, docs) {
				docs.forEach(function(doc) {
					distinctDatabase.push(doc);
				});
			// At this point, have gotten all distinct process state codes, application names, and databases.

			for (var i = 0; i < distinctProcessStateCode.length; i++) {
				for (var j = 0; j < distinctApplicationName.length; j++) {
					for (var k = 0; k < distinctDatabase.length; k++) {
						dbo.collection("job").aggregate([
							{ $match: { "process_state_code" : distinctProcessStateCode[i], "application_name" : distinctApplicationName[j], "database" : distinctDatabase[k]}}
						]).toArray().then(function(result) {
        					if (result.length > 1) {
        						for (var l = 0; l < result.length-1; l++) {
									var deleteID = result[l]._id;
									dbo.collection("job").remove({ "_id" : deleteID });
        						}
							}
    					})
					}
				}
			}
      		});
      	});
	});

	// Removing duplicates from database for JVM
	// Else Excel populates with duplicate rows
	dbo.collection("jvm").distinct('process_state_code', function(err, docs) {
		docs.forEach(function(doc) {
			distinctProcessStateCode.push(doc);
		});

		dbo.collection("jvm").distinct('application_name', function(err, docs) {
		docs.forEach(function(doc) {
			distinctApplicationName.push(doc);
		});

			dbo.collection("jvm").distinct('jvm_name', function(err, docs) {
				docs.forEach(function(doc) {
					distinctJVMName.push(doc);
				});

				dbo.collection("jvm").distinct('host', function(err, docs) {
					docs.forEach(function(doc) {
						distinctHost.push(doc);
					});

					 // At this point, have gotten all distinct process state codes, application names, JVMS, and hosts.

					for (var i = 0; i < distinctProcessStateCode.length; i++) {
						for (var j = 0; j < distinctApplicationName.length; j++) {
							for (var k = 0; k < distinctJVMName.length; k++) {
								for (var m = 0; m < distinctHost.length; m++) {
									dbo.collection("jvm").aggregate([
										{ $match: { "process_state_code" : distinctProcessStateCode[i], "application_name" : distinctApplicationName[j], "jvm_name" : distinctJVMName[k], "host" : distinctHost[m]}}
									]).toArray().then(function(result) {
										if (result.length > 1) {
											for (var l = 0; l < result.length-1; l++) {
												var deleteID = result[l]._id;
												dbo.collection("jvm").remove({ "_id" : deleteID });
											}
										}
									})
								}
							}
						}
					}
				});
      		});
      	});
	});

	// Removing duplicates from database for Process Flow Model
	// Else Excel populates with duplicate rows
	dbo.collection("processflowmodel").distinct('process_state_code', function(err, docs) {
		docs.forEach(function(doc) {
			distinctProcessStateCode.push(doc);
		});

		dbo.collection("processflowmodel").distinct('track', function(err, docs) {
		docs.forEach(function(doc) {
			distinctTrack.push(doc);
		});

			dbo.collection("processflowmodel").distinct('subtrack', function(err, docs) {
				docs.forEach(function(doc) {
					distinctSubtrack.push(doc);
				});
			// At this point, have gotten all distinct process state codes, tracks, and subtracks.

			for (var i = 0; i < distinctProcessStateCode.length; i++) {
				for (var j = 0; j < distinctTrack.length; j++) {
					for (var k = 0; k < distinctSubtrack.length; k++) {
						dbo.collection("processflowmodel").aggregate([
							{ $match: { "process_state_code" : distinctProcessStateCode[i], "track" : distinctTrack[j], "subtrack" : distinctSubtrack[k]}}
						]).toArray().then(function(result) {
        					if (result.length > 1) {
        						for (var l = 0; l < result.length-1; l++) {
									var deleteID = result[l]._id;
									dbo.collection("processflowmodel").remove({ "_id" : deleteID });
        						}
							}
    					})
					}
				}
			}
      		});
      	});
	});

	// Removing duplicates from database for Service URL
	// Else Excel populates with duplicate rows
	dbo.collection("serviceurl").distinct('application_name', function(err, docs) {
		docs.forEach(function(doc) {
			distinctApplicationName.push(doc);
		});

		// At this point, have gotten all distinct application names.

		for (var i = 0; i < distinctApplicationName.length; i++) {
			dbo.collection("serviceurl").aggregate([
				{ $match: { "application_name" : distinctApplicationName[i]}}
			]).toArray().then(function(result) {
				if (result.length > 1) {
					for (var j = 0; j < result.length-1; j++) {
						var deleteID = result[j]._id;
						dbo.collection("serviceurl").remove({ "_id" : deleteID });
					}
				}
			})
		}
	});
	makeExcelSheets();
});

function makeExcelSheets() {
	MongoClient.connect(url, {useNewUrlParser: true}, function(err, db) {
		if (err) throw err;
		var dbo = db.db("gemsdashboard");

		// Get documents from job collection and write to excel
		dbo.collection("job").find().toArray(function(err, docs) {
			docs.forEach(function(doc) {
				jobsExcel(doc.application_name,doc.service_offering_name,doc.process_state_name,doc.process_state_code,doc.process_name,doc.job_name,doc.type,doc.database,doc.process,doc.related_to,jobsws);
			});
			writeToExcel(jobs,"Jobs.xlsx");
			db.close();
		});

		// Get documents from jvm collection and write to excel
		dbo.collection("jvm").find().toArray(function(err, docs) {
			docs.forEach(function(doc) {
				jvmsExcel(doc.application_name,doc.jvm_name,doc.host,doc.host_env,doc.process_state_code,doc.process,jvmsws);
			});
			writeToExcel(jvms,"JVMs.xlsx");
			db.close();
		});

		// Get documents from service URL collection and write to excel
		dbo.collection("processflowmodel").find().toArray(function(err, docs) {
			docs.forEach(function(doc) {
				processFlowExcel(doc.process_state_name,doc.process_state_code,doc.track,doc.subtrack,doc.process,processflowws);
			});
			writeToExcel(processflow,"ProcessFlowStates.xlsx");
			db.close();
		});

		// Get documents from service URL collection and write to excel
		dbo.collection("serviceurl").find().toArray(function(err, docs) {
			docs.forEach(function(doc) {
				serviceURLExcel(doc.application_name,doc.value,doc.consumed_exposed,doc.process_state_name,serviceurlws)
			});
			writeToExcel(serviceurl,"ServiceURL.xlsx");
			db.close();
		});
	});
}
/* four functions with parameters to pass and write to our excel, with columns initialized*/
function jobsExcel(application_name,service_offering_name,process_state_name,process_state_code,process_name,job_name,type,database,process,related_to,worksheet) {
	worksheet.columns = [
		{ header: 'application_name', key: 'application_name', width: 20 },
		{ header: 'service_offering_name', key: 'service_offering_name', width: 25 },
		{ header: 'process_state_name', key: 'process_state_name', width: 20},
		{ header: 'process_state_code', key: 'process_state_code', width: 60},
		{ header: 'process_name', key: 'process_name', width: 15},
		{ header: 'job_name', key: 'job_name', width: 30},
		{ header: 'type', key: 'type', width: 20},
		{ header: 'database', key: 'database', width: 15},
		{ header: 'process', key: 'process', width: 10},
		{ header: 'related_to', key: 'related_to', width: 30}
	];
	worksheet.addRow([application_name,service_offering_name,process_state_name,process_state_code,process_name,job_name,type,database,process,related_to]);
}

function jvmsExcel(application_name,jvm_name,host,host_env,process_state_code,process,worksheet) {
	worksheet.columns = [
		{ header: 'application_name', key: 'application_name', width: 20 },
		{ header: 'jvm_name', key: 'jvm_name', width: 25 },
		{ header: 'host', key: 'host', width: 15},
		{ header: 'host_env', key: 'host_env', width: 10},
		{ header: 'process_state_code', key: 'process_state_code', width: 60},
		{ header: 'process', key: 'process', width: 10}
	];
	worksheet.addRow([application_name,jvm_name,host,host_env,process_state_code,process]);
}

function processFlowExcel(process_state_name,process_state_code,track,subtrack,process,worksheet){
	worksheet.columns = [
		{ header: 'process_state_name', key: 'process_state_name', width: 20 },
		{ header: 'process_state_code', key: 'process_state_code', width: 60 },
		{ header: 'track', key: 'track', width: 30},
		{ header: 'subtrack', key: 'subtrack', width: 30},
		{ header: 'process', key: 'process', width: 10}
	];
	worksheet.addRow([process_state_name,process_state_code,track,subtrack,process]);
}

function serviceURLExcel(application_name,value,consumed_exposed,process_state_name,worksheet){
	worksheet.columns = [
		{ header: 'application_name', key: 'process_state', width: 20 },
		{ header: 'NAME', key: 'name', width: 20 },
		{ header: 'VALUE', key: 'value', width: 20},
		{ header: 'consumed_exposed', key: 'consumed_exposed', width: 20},
		{ header: 'process_state_name', key: 'process_state_name', width: 10}
	];
	var name = application_name;
	worksheet.addRow([application_name,name,value,consumed_exposed,process_state_name]);
}

function writeToExcel(workbook, filename) {
	workbook.xlsx.writeFile(filename).then(function(){});
}
