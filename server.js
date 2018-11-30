/* Sample Input JSON data
{
    'process_state': 'LPN Pack for BTS',
    'application_name': 'Cisco Production Fulfillment',
    'consumed_exposed': 'Consumed',
    'track': 'Test Environment - Supply Chain TS3',
    'subtrack': 'TS3 Supply Chain - Non Prod',
    'VALUE': 'test.com',
    'service_offering_name': 'Outsourced Product Fulfillment (1.0)',
    'process_name': 'BTS Flow',
    'process': 'Y',
    'job_name': 'Cisco Make Pack LPN for BTS',
    'type': 'Concurrent Program',
    'database': 'TS1,TS3',
    'related_to': 'Test Environment - Supply Chain TS3',
    'jvm_name': 'sbpservices-kw88wf3icst1-1',
    'host': 'lae-rtp1-li-159',
    'host_env': 'LAE',
}
*/

/* On submit, generate field process_state_code by concatenating process_state + track
 * Example:
 * track = Test_Environment - Supply Chain TS3 --> sc_nonprod_ts3
 * process_state = LPN Pack for BTS --> lpn_pack_for_bts
 * process_state_code = lpn_pack_for_bts_sc_nonprod_ts3
*/

// Add field process = 'Y'

/* Sample Modified Input JSON data
{
    'process_state': 'LPN Pack for BTS',
    'application_name': 'Cisco Production Fulfillment',
    'consumed_exposed': 'Consumed',
    'track': 'Test Environment - Supply Chain TS3',
    'subtrack': 'TS3 Supply Chain - Non Prod',
    'VALUE': 'test.com',
    'service_offering_name': 'Outsourced Product Fulfillment (1.0)',
    'process_name': 'BTS Flow',
    'process': 'Y',
    'job_name': 'Cisco Make Pack LPN for BTS',
    'type': 'Concurrent Program',
    'database': 'TS1,TS3',
    'related_to': 'Test Environment - Supply Chain TS3',
    'jvm_name': 'sbpservices-kw88wf3icst1-1',
    'host': 'lae-rtp1-li-159',
    'host_env': 'LAE',
    'process_state_code': 'lpn_pack_for_bts_sc_nonprod_ts3',
    'process': 'Y'
}
*/

/* MongoDB database information:
 * "dummydatabase": contains the populated data
 * "userinput": contains modified user input data (add 'process_state_code', 'NAME', 'process')
    from which the Excel sheets will be created
 */

var express = require("express");
var bodyparser = require("body-parser");
var mongoose = require("mongoose");
//var MongoClient = require('mongodb').MongoClient;

var urlencodedParser = bodyparser.urlencoded({extended: false});

var app = express();
app.set("view engine", "ejs");
app.use(bodyparser.json());

//var url = "mongodb://localhost:27017/"; // Current URL is local host
var url = "mongodb://gems:Cisco123@ds261917.mlab.com:61917/gemsdashboard";

mongoose.connect(url, {useNewUrlParser: true});

var gemsGetSchema = new mongoose.Schema({
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

var gemsPostSchema = new mongoose.Schema({
	process_state_name: String,
	app_name: String,
	consumed_exposed: String,
	track: String,
	subtracks: String,
	app_url: String,
	service_offering_name: String,
	process: String,
	job: String,
	type: String,
	database: String,
	related_to: String,
	jvm_name: String,
	hosts: [String],
	host_env: String
});

var gemsGetModel = mongoose.model("gemsGetModel", gemsGetSchema, "dummydatabase"); //The third parameter is the collection. Change as necessary

var gemsPostModel = mongoose.model("gemsPostModel", gemsPostSchema, "userinput");

app.listen(3000); //Arbitrarily make the app listen to port 3000.

//Initialize all files and dependencies.
app.get("/", function(req, res){
	//res.sendFile(__dirname +"/index.html");
	gemsGetModel.find().then(function(doc){
		//console.log(doc[0]);
		res.render("home", {data: doc[0]});
	});
});

app.get("/index.html", function(req, res){
	gemsGetModel.find().then(function(doc){
		res.render("home", {data: doc[0]});
	});
});


app.get("/css/style.css", function(req, res){
	res.sendFile(__dirname +"/css/style.css");
});

app.get("/js/app.js", function(req, res){
	res.sendFile(__dirname +"/js/app.js");
});

app.get("/readme.md", function(req, res){
	res.sendFile(__dirname +"/readme.md");
});

app.get("/images/Cisco_logo_blue_2016.png", function(req, res){
	res.sendFile(__dirname +"/images/Cisco_logo_blue_2016.png");
});


app.get("/populateUI", function(req, res){
	gemsGetModel.find().then(function(doc){
		res.send(doc[0]);
	});
});

app.post("/send", urlencodedParser, function(req, res){
	var formJson = req.body;
	var tempJson = JSON.parse(JSON.stringify(formJson));

	delete tempJson.track;
	delete tempJson.jvm_name;
	delete tempJson.app_name;
	delete tempJson.database;

	for(var i=0; i < formJson.track.length; i++){
		tempJson.track = formJson.track[i]["name"];

		for(var j=0; j < formJson.jvm_name.length; j++){
			tempJson.jvm_name = formJson.jvm_name[j]["name"];

			for(var k=0; k < formJson.app_name.length; k++){
				tempJson.app_name = formJson.app_name[k];

				for(var m=0; m < formJson.database.length; m++){
					tempJson.database = formJson.database[k];

					for(var ii=0; ii<formJson.track[i]["subtracks"].length; ii++){
						tempJson.subtrack = formJson.track[i]["subtracks"][ii];

						for(var jj=0; jj< formJson.jvm_name[j]["hosts"].length; jj++){
							tempJson.host = formJson.jvm_name[j]["hosts"][jj];

							gemsPostModel(tempJson).save(function(err, data){
								if(err) throw err;
								//===== TODO: At this point, tempJson is a JSON object that can be used to dynamically create the spreadsheets.
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

/*
// Takes field from the dummy database and returns the entire array
MongoClient.connect(url, function(err, db) {
	if (err) throw err;
	var dbo = db.db("test");

	// Application Name
	var applicationName = dbo.collection("users").distinct('application_name');
	applicationName.then(function (item) {
		console.log(item);
	});

	// Consumed or Exposed
	var applicationName = dbo.collection("dummydatabase").distinct('consumed_exposed');
	applicationName.then(function (item) {
		console.log(item);
	});

	// Track
	var applicationName = dbo.collection("dummydatabase").distinct('track');
	applicationName.then(function (item) {
		console.log(item);
	});

	// Subtrack
	var applicationName = dbo.collection("dummydatabase").distinct('subtrack');
	applicationName.then(function (item) {
		console.log(item);
	});

	// Service Offering Name
	var applicationName = dbo.collection("dummydatabase").distinct('service_offering_name');
	applicationName.then(function (item) {
		console.log(item);
	});

	// Type
	var applicationName = dbo.collection("dummydatabase").distinct('type');
	applicationName.then(function (item) {
		console.log(item);
	});

	// Database
	var applicationName = dbo.collection("dummydatabase").distinct('database');
	applicationName.then(function (item) {
		console.log(item);
	});

	// Related To
	var applicationName = dbo.collection("dummydatabase").distinct('related_to');
	applicationName.then(function (item) {
		console.log(item);
	});

	// JVM Name
	var applicationName = dbo.collection("dummydatabase").distinct('jvm_name');
	applicationName.then(function (item) {
		console.log(item);
	});

	// Host
	var applicationName = dbo.collection("dummydatabase").distinct('host');
	applicationName.then(function (item) {
		console.log(item);
	});

	// Host Environment
	var applicationName = dbo.collection("dummydatabase").distinct('host_env');
	applicationName.then(function (item) {
		console.log(item);
	});
});
*/

// Modified dummy user input as JSON data sent from UI
/*
var input = [{
    'process_state': 'LPN Pack for BTS',
    'application_name': 'Cisco Production Fulfillment',
    'consumed_exposed': 'Consumed',
    'track': 'Test Environment - Supply Chain TS3',
    'subtrack': 'TS3 Supply Chain - Non Prod',
    'VALUE': 'test.com',
    'service_offering_name': 'Outsourced Product Fulfillment (1.0)',
    'process_name': 'BTS Flow',
    'process': 'Y',
    'job_name': 'Cisco Make Pack LPN for BTS',
    'type': 'Concurrent Program',
    'database': 'TS1,TS3',
    'related_to': 'Test Environment - Supply Chain TS3',
    'jvm_name': 'sbpservices-kw88wf3icst1-1',
    'host': 'lae-rtp1-li-159',
    'host_env': 'LAE',
    'process_state_code': 'process_state_code',
}];

MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("gemsdashboard");
    dbo.collection("userinput").insertMany({input}, function(err, result) {
        if (err) throw err;
        console.log(result.name);
        db.close();
    });
});
*/
/*
var MongoClient=require('mongodb').MongoClient;
var url="mongodb://localhost:27017/test";
/* Excel Sheets */
/*
var Excel = require('exceljs');

var jobs = new Excel.Workbook();
var jobsws = jobs.addWorksheet('Jobs');
var jvms = new Excel.Workbook();
var jvmsws = jvms.addWorksheet('JVMs');
var processflow = new Excel.Workbook();
var processflowws = processflow.addWorksheet('Process Flow States');
var serviceurl = new Excel.Workbook();
var serviceurlws = serviceurl.addWorksheet('Service URL');

MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("test");
    console.log("connected");//connected!
    var app=dbo.collection("users").find().toArray(function(err,docs){
        console.log(docs);   });


	dbo.collection("users").find().toArray(function(err, docs) {
		docs.forEach(function(doc) {
			jobsExcel(doc.app,doc.serviceOff,doc.process_state,doc.process_state,doc.process,doc.jobName,doc.theType,doc.database,doc.process,doc.relTo,jobsws);
			jvmsExcel(doc.app,doc.jvm,doc.hosts,doc.hostEnv,doc.process_state,doc.process,jvmsws);
			processFlowExcel(doc.process,doc.process_state,doc.track,doc.sub_tracks,doc.process,processflowws);
			serviceURLExcel(doc.app,doc.appUrl,doc.consExpo,doc.process,serviceurlws)
		});
		writeToExcel(jobs, "Jobs.xlsx");
		writeToExcel(jvms, "JVMs.xlsx");
		writeToExcel(processflow, "ProcessFlowStates.xlsx");
		writeToExcel(serviceurl, "ServiceURL.xlsx");
		db.close();
	});


});

function jobsExcel(application_name,service_offering_name,process_state,process_state_code,process_name,job_name,type,database,process,related_to,worksheet) {
	worksheet.columns = [
		{ header: 'application_name', key: 'application_name', width: 20 },
		{ header: 'service_offering_name', key: 'service_offering_name', width: 25 },
		{ header: 'process_state', key: 'process_state', width: 20},
		{ header: 'process_state_code', key: 'process_state_code', width: 30},
		{ header: 'process_name', key: 'process_name', width: 15},
		{ header: 'job_name', key: 'job_name', width: 30},
		{ header: 'type', key: 'type', width: 20},
		{ header: 'database', key: 'database', width: 15},
		{ header: 'process', key: 'process', width: 10},
		{ header: 'related_to', key: 'related_to', width: 30}
	];
	worksheet.addRow([application_name,service_offering_name,process_state,process_state_code,process_name,job_name,type,database,process,related_to]);
}

function jvmsExcel(application_name,jvm_name,host,host_env,process_state_code,process,worksheet) {
	worksheet.columns = [
		{ header: 'application_name', key: 'application_name', width: 20 },
		{ header: 'jvm_name', key: 'jvm_name', width: 25 },
		{ header: 'host', key: 'host', width: 15},
		{ header: 'host_env', key: 'host_env', width: 10},
		{ header: 'process_state_code', key: 'process_state_code', width: 30},
		{ header: 'process', key: 'process', width: 10}
	];
	worksheet.addRow([application_name,jvm_name,host,host_env,process_state_code,process]);
}

function processFlowExcel(process_state,process_state_code,track,subtrack,process,worksheet){
	worksheet.columns = [
		{ header: 'process_state', key: 'process_state', width: 20 },
		{ header: 'process_state_code', key: 'process_state_code', width: 30 },
		{ header: 'track', key: 'track', width: 30},
		{ header: 'subtrack', key: 'subtrack', width: 30},
		{ header: 'process', key: 'process', width: 10}
	];
	worksheet.addRow([process_state,process_state_code,track,subtrack,process]);
}

function serviceURLExcel(application_name,application_url,consumed_exposed,process_state,worksheet){
	worksheet.columns = [
		{ header: 'application_name', key: 'process_state', width: 20 },
		{ header: 'NAME', key: 'name', width: 20 },
		{ header: 'VALUE', key: 'value', width: 20},
		{ header: 'consumed_exposed', key: 'consumed_exposed', width: 15},
		{ header: 'process_state', key: 'process_state', width: 10}
	];
	var name = application_name;// =============================================== I added the word "var" here. Is it necessary?
	worksheet.addRow([application_name,name,application_url,consumed_exposed,process_state]);
}

function writeToExcel(workbook, filename) {
	workbook.xlsx.writeFile(filename).then(function(){});
}
*/
