/*
var express=require("express");
var app=express();
var port=3000;
var mongoose=require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/test");
var db=mongoose.connection;
db.on('error',console.error.bind(console,'connection error:'));
db.once('open',function(){
    console.log('connected');
});

var bodyParser=require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use('/',express.static('public'));




var nameSchema=new mongoose.Schema({
  Name:String,
  url:String},
  {collection:'Cisco'});

var User=mongoose.model("NewModel",nameSchema);

app.use("/", (req,res)=>{
      //	res.send("this is a test");
     res.sendFile(__dirname + "/public/index.html");
});
app.post("/addname",(req,res)=>{
   var myData=new User(req.body);
   myData.save().then(item=>{res.send("Name saved to database");}).catch(err => {res.status(400).send("Unable to save to database");});
});

app.listen(port,()=>{console.log("Server listening on port" + port); });
*/

var express = require("express");
var app = express();

app.use("/css",express.static(__dirname + '/css'));//display css layout contents
app.use("/images",express.static(__dirname+'/images'));
app.use("/js",express.static(__dirname + '/js'));



var port = 3000;
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/test");


var subsTrck=new mongoose.Schema({
 track1:String,
 track2:String,
});

var subHost=new mongoose.Schema({
 jvm1:String,
  jvm2:String
});

var nested=mongoose.model('subtracks',subsTrck);
var hosted=mongoose.model('subhosts',subHost);
var nameSchema = new mongoose.Schema({ 
    process_state:String,
     app:{type:[String]},
/*  
     app1:String,

     app2:String,
     app3:String,
     app4:String,
     app5:String,
     app6:String,
     app7:String,
     app8:String,
   */
     consExpo:String,
     track:{type:[String] },
     sub_tracks:[subsTrck],//references the nested schema,
     appUrl:String,
  serviceOff:String,
  process:String,
  jobName:String,
  theType:String,
  database:{type:[String]},
  relTo:String,
  jvm:{type:[String]},
  hosts:[subHost],
  hostEnv:String
  


    
   // sub_tracks:{type:mongoose.Schema.Types.ObjectId,ref:'subsTrck'}
    // sub_tracks:{type:nested.schema}
  // s1:String,
   //s2:String
   
},{versionKey: false});//versionKey hides _V
var User = mongoose.model("User", nameSchema);

//app.get('/css/styles.css',function(req,res){res.send('css/styles.css');res.end();});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});
app.post("/addname", (req, res) => {
    var myData = new User(req.body);
    var childData= new nested(req.body);//variable for the child model subtrack
       //childData.save(); actually creates another collection that adds the subtracks
      myData.sub_tracks.push(childData);//adds nested subdocument to parent VERY IMPORTANT FINDING

    var childHost=new hosted(req.body);
       myData.hosts.push(childHost);

    myData.save()
        .then(item => {
            res.send("Name saved to database");
        })
        .catch(err => {
            res.status(400).send("Unable to save to database");
        });
});

app.listen(port, () => {
    console.log("Server listening on port " + port);
});
