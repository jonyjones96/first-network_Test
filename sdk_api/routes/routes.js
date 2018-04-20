var faker = require("faker");
var queryblock = require('../query.js');
var invoke = require('../invoke.js');
//var admin = require('../enrollAdmin.js');
var usr = require('../enrollUser.js');
//var sleep = require('sleep');
//WRite to files
var fs = require('fs');


var appRouter = function (app) {

  app.set('view engine', 'ejs')
  
  //Send the user to the login Screen
  app.get("/", function (req, res) { 
	  res.render('login');
  });

  //Checks the users details and registers them
  //as a user for the Node SDK
  app.post("/signin", function(req, res){
    var usr = req.body.username;
    var psw = req.body.password;

    //needs to check if they are a valid user
    //checks a textfile - this will definately need to be changed in the future
    //---insert here
    fs.readFile('test.txt','utf8', (err, data) => {
      if (err) throw err;
      console.log(data);
    });
    var valid =true;
    //Send them to the correct page
    if(valid == true){
      //---change this
      var weatherText = "it worked!";
      res.render('main', {weather: weatherText, error: null});
      //---
    }else{
      res.render('login');
    }
  });

  //Sends a new user to the register page
  app.get("/registerPage",function(req, res){
    res.render('register');
  });

  //Registers a user to the network and creates their details in a textfile
  app.post("/registerUser",function(req, res){

    var usr = req.body.username;
    var psw = req.body.password;

    var userDetails = usr + "," + psw + "\n";
    //insert them into the text file
    fs.appendFile('test.txt', userDetails, function (err) {
      if (err) {
        // append failed
        console.log(err);
      } 
    })

    //Send them to a new page
    var weatherText = "it worked!";
    res.render('main', {weather: weatherText, error: null});
    //res.render('main');
  });



 app.get("/query/:str", function(req, res){
   var query = req.params.str;
   var array = query.split("&");
   
   var chainCodeID = array[0]; 
   var ccid = chainCodeID.split("=");

   var fcnName = array[1];
   var fcn =  fcnName.split("=");

   var args = array[2]; 
  
   

   //enroll Admin
   //admin.newAdmin("admin","adminpw");
   //sleep.sleep(5)
   //enroll User
   usr.newUser("user1");
   //sleep.sleep(5)
   var args1 = ['']
   var resp = queryblock.queryBC(ccid[1],fcn[1],args1);
   
	//sleep.sleep(5)

   res.status(200).send(resp);

 });


 app.post("/invoke/:str", function(req, res){

   var query = req.params.str;

   //invoke.newInvoke("mycc","insertBlock",args2,"mychannel");
   var array = query.split("&");
   
   var chainCodeID = array[0]; 
   var ccid = chainCodeID.split("=");

   var fcnName = array[1];
   var fcn =  fcnName.split("=");

   var channelName = array[2];
   var channel = channelName.split("=");
  
   var totalArgs = array[3];
   var argsArray = totalArgs.split("=");
   var splitArgs = argsArray[1].split(",");
	
   var args = [splitArgs[0], splitArgs[1], splitArgs[2], splitArgs[3], splitArgs[4]]; 

  console.log("splitArgs = " + splitArgs + ", argsArray = " + argsArray + ", TotalArgs = " + totalArgs);
  //	args = ['BLOCK4','A','B','C','D'];
   invoke.newInvoke(ccid[1],fcn[1],args,channel[1]);

   var output = "ccid= " +ccid[1] +" fcn= " +fcn[1]+ " channel= " + channel[1];
   res.status(200).send("Success!"+ output);

  });




/* 
          Template -- GET
 app.get("/query/:str", function(req, res){
    var str1 = req.params.str;
    res.status(200).send(str1);
 });

           Template -- POST
 app.post("/query/:str", function(req, res){
    var str1 = req.params.str;
    res.status(200).send(str1);
 });


*/

 
}
module.exports = appRouter;

