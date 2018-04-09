'use strict';
// Central file that does the following:
//1) enrolls an Admin "admin"
//2) enrolls a User "user1"
//3) Querys the blockchain

/*
############### Need to do ######################
In the invoke.js file create an exported method to insert a block

In the query.js file create an exported method to query the blockchain

In the main.js (this file) set up the network and call the functions

################################################
*/

var query = require('./query.js');
var invoke = require('./invoke.js');
var admin = require('./enrollAdmin.js');
var usr = require('./enrollUser.js');

var Fabric_Client = require('fabric-client');
var Fabric_CA_Client = require('fabric-ca-client');

var path = require('path');
var util = require('util');
var os = require('os');

var fabric_client = new Fabric_Client();

//enroll Admin
admin.newAdmin("admin","adminpw");

//enroll User
usr.newUser("user1");

//query Blockchain
var args1 = ['']
query.queryBC("mycc","queryAllBlocks",args1);


var args2 = ['BLOCK5','E','F','G','H']
invoke.newInvoke("mycc","insertBlock",args2,"mychannel");


query.queryBC("mycc","queryAllBlocks",args1);