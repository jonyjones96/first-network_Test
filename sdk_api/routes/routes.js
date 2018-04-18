var faker = require("faker");
var queryblock = require('../query.js');
var invoke = require('../invoke.js');
//var admin = require('../enrollAdmin.js');
var usr = require('../enrollUser.js');
//var sleep = require('sleep');

var appRouter = function (app) {



  app.get("/", function (req, res) {
    res.status(200).send({ message: 'Welcome to our restful API' });
  });

  app.get("/user", function (req, res) {
    var data = ({
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      username: faker.internet.userName(),
      email: faker.internet.email()
    });
    res.status(200).send(data);
  });

 app.get("/users/:num", function (req, res) {
   var users = [];
   var num = req.params.num;

   if (isFinite(num) && num  > 0 ) {
     for (i = 0; i <= num-1; i++) {
       users.push({
           firstName: faker.name.firstName(),
           lastName: faker.name.lastName(),
           username: faker.internet.userName(),
           email: faker.internet.email()
        });
     }

     res.status(200).send(users);
    
   } else {
     res.status(400).send({ message: 'invalid number supplied' });
   }

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

