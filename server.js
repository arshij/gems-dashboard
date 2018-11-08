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

var MongoClient = require('mongodb').MongoClient;

// Current URL is local host
var url = "mongodb://localhost:27017/";

/*
// Takes field from the dummy database and returns the entire array
MongoClient.connect(url, function(err, db) {
	if (err) throw err;
	var dbo = db.db("gemsdashboard");
	
	// Application Name
	var applicationName = dbo.collection("dummydatabase").distinct('application_name');
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

/* Excel Sheets */

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
    var dbo = db.db("gemsdashboard");
	dbo.collection("userinput").find().toArray(function(err, docs) {
		docs.forEach(function(doc) {
			jobsExcel(doc.application_name,doc.service_offering_name,doc.process_state,doc.process_state_code,doc.process_name,doc.job_name,doc.type,doc.database,doc.process,doc.related_to,jobsws);
			jvmsExcel(doc.application_name,doc.jvm_name,doc.host,doc.host_env,doc.process_state_code,doc.process,jvmsws);
			processFlowExcel(doc.process_state,doc.process_state_code,doc.track,doc.subtrack,doc.process,processflowws);
			serviceURLExcel(doc.application_name,doc.application_url,doc.consumed_exposed,doc.process_state,serviceurlws)
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
	name = application_name;
	worksheet.addRow([application_name,name,application_url,consumed_exposed,process_state]);
}

function writeToExcel(workbook, filename) {
	workbook.xlsx.writeFile(filename)
    	.then(function() {});
}
