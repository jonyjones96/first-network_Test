'use strict';
/*
*How to set up the SDK*
- Secondly, do the following things, in this order to connect your app to the network:
1 - Create a new `Client` and `Channel` object
2 - Create a default key/val store
3 - Set the client to use the above key/val store
4 - Connect to the CA
5 - Enrol an admin user
6 - Connect to the orderer, peer and eventhub
7 - Initialise the channel
*/

var Fabric_Client = require('fabric-client');
var Fabric_CA_Client = require('fabric-ca-client');
var Channel = require('fabric-client/lib/Channel.js')

var path = require('path');
var util = require('util');
var os = require('os');

var fabric_client = new Fabric_Client();
var channel = new Channel("mychannel", fabric_client)
var fabric_ca_client = null;
var admin_user = null;
var member_user = null;
var store_path = path.join(__dirname, 'hfc-key-store');
console.log(' Store path:'+store_path);