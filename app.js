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
var nameSchema=new mongoose.Schema({
  Name:String,
  url:String},
  {collection:'Cisco'});

var User=mongoose.model("NewModel",nameSchema);

app.use("/", (req,res)=>{
      //	res.send("this is a test");
     res.sendFile(__dirname + "/index.html");
});
app.post("/addname",(req,res)=>{
   var myData=new User(req.body);
   myData.save().then(item=>{res.send("Name saved to database");}).catch(err => {res.status(400).send("Unable to save to database");});
});

app.listen(port,()=>{console.log("Server listening on port" + port); });
*/

var express = require("express");
var app = express();
var port = 3000;
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/test");
var nameSchema = new mongoose.Schema({
    Name: String,
    url: String
});
var User = mongoose.model("User", nameSchema);

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.post("/addname", (req, res) => {
    var myData = new User(req.body);
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
