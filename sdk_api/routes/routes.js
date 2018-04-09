var faker = require("faker");
var queryblock = require('../query.js');
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
   var array = query.split(",");
   
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
   queryblock.queryBC(ccid[1],fcn[1],args1);
   //sleep.sleep(5)

   res.status(200).send("Success!");

 }

 

);
}
module.exports = appRouter;

