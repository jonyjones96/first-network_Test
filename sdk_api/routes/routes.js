var faker = require("faker");
var queryblock = require('../query.js');
var invoke = require('../invoke.js');
var admin = require('../enrollAdmin.js');
var usr = require('../enrollUser.js');

//Write to files
var fs = require('fs');


var appRouter = function (app) {

  app.set('view engine', 'ejs')
  
  //Send the user to the login Screen
  app.get("/", function (req, res) { 
	  res.render('login');
  });

  //Checks the users details and registers them
  //as a user for the Node SDK
  app.post("/main", function(req, res){
    var usrnm = req.body.username;
    var psw = req.body.password;
    var listPSW = [];
    var valid =true;
    //needs to check if they are a valid user
    //checks a textfile - this will definately need to be changed in the future
    //---insert here
    // fs.readFile('test.txt','utf8', (err, data) => {
    //   if (err) throw err;
    //   var dataLines = data.split("\n");
    //   for (var i =0; i <= dataLines.length; i++){
    //     console.log(dataLines[i]);
    //     console.log(listPSW);
    //     listPSW.push(dataLines[i]);
    //   }
      
    //   //console.log("DataLines = " + dataLines[0]);
    // });

    // console.log("listPSW = " + listPSW[0]);
    
    // for(var i = 0; i <= listPSW.length-1; i++){
    //   var str = (usr + "," + psw ); 
    //   if(listPSW[i] == str){
    //     valid = true;
    //     break;
    //   }
    //   else{
    //     console.log("incorrect details");
    //   }
    // }
    if(usrnm == "org1"){
      res.render('insert');
    }

    //Send them to the correct page
    if(valid == true){

      //log the userinto the application 
      admin.newAdmin("admin","adminpw");
      usr.newUser(usrnm);
      //query Blockchain
      var args1 = ['']
      var resp = queryblock.queryBC("mycc","queryAllBlocks",args1);
      //var weatherText = "it worked!";

      //create a 2-D array
      var blockchain = [];
      var blockSplit = resp.split("},{");
      //loop through put the important data into a new array and add it to blockchain
      for(var i = 0; i <= blockSplit.length-1; i++){
        //Example of output: 
        //Block : "Key":"BLOCK1", "Record":{"date":"02/03/2018","metadata":"Name","organisationid":"Google.com","sourceid":"Facebook.com"}
        console.log("Block : " + blockSplit[i]);

        var clean = blockSplit[i].split('":"');
        //example:
        //test = "Key,BLOCK3", "Record":{"date,03/03/2018","metadata,Name","organisationid,AirBnB","sourceid,Google.com"}}]
        //test[1] = BLOCK3", "Record":{"date
        //test[2] = 03/03/2018","metadata
        //console.log("test = " + clean[2]);
        var lastbit2 = clean[2].split('","');
        //console.log("Date : " + lastbit2[0]);

        //console.log("test = " + clean[3]);
        var lastbit3 = clean[3].split('","');
        //console.log("MetaData : " + lastbit3[0]);

        //console.log("test = " + clean[4]);
        var lastbit4 = clean[4].split('","');
        //console.log("OrganisationID : " + lastbit4[0]);

        //console.log("test = " + clean[5]);
        var lastbit5 = clean[5].split('","');
        //console.log("SourceID : " + lastbit5[0]);

        var source = lastbit5[0].split('"}');
        
        var cleanBlock = [];
        cleanBlock.push(lastbit2[0]);
        cleanBlock.push(lastbit3[0]);
        cleanBlock.push(lastbit4[0]);
        cleanBlock.push(source[0]);
        //console.log("Block = " + cleanBlock);
        blockchain.push(cleanBlock);
      }

      //console.log("blockchain= "+blockchain );
      //console.log(typeof resp);

      res.render('main', {blocks: blockchain, error: null});
      //res.status(200).send(resp);
      //---
    }else{
      res.render('login');
    }
  });


  app.post("/insertBlock", function(req,res){
    var usrnmcmpyID = req.body.companyid;
    var data = req.body.insertionData;
    var source = req.body.source;
    var date = req.body.date;
    //var block = latestBlock + 1;
    
    //var args = ['BLOCK7',date,data,source,usrnmcmpyID];
    var args = ['BLOCK6',date,data,source,usrnmcmpyID];

    invoke.newInvoke("mycc","insertBlock",args,"mychannel");
    console.log("it works");
    //res.render('login');
    //latestBlock = block;
  });

  app.post("/query/:str", function(req, res){
    var str1 = req.params.str;
    res.status(200).send(str1);
 });

  //Sends a new user to the register page
  app.get("/registerPage",function(req, res){
    res.render('register');
  });

  //Registers a user to the network and creates their details in a textfile
  app.post("/registerUser",function(req, res){

    var usrnm = req.body.username;
    var psw = req.body.password;

    var userDetails = usrnm + "," + psw + "\n";
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

