'use strict';

var httpStatusCode = require('../utils/httpStatusCode');
var messages = require('../utils/messages');
var validate = require('../middlewares/validate');
var FCM = require('fcm-push');

var serverKey = 'AAAAPS3yofA:APA91bG0LLTT3g0dQQkYiZur9qjp0tXb1y3p1z7iH79eWN0sos-TtVy1If4xQ_p0-Z9byo6BLFWEwfx2Cz8bxWfNP-zgX08CPQALszmoV-LOq3UOiDOWRWg8OjwRedwQqE7OL6SctnsAv89B7VVKvzA09PH8H3gn1A';
var fcm = new FCM(serverKey);


function showError (err) {
  if (err) {
    console.log(err);
  }
}

function createUpdatePositionMessage(tokens, carId, latitude, longitude, speed, isEmergency, isProgrammedStop, isLeader){
  var message = {
      "registration_ids": tokens, // required fill with device token or topics
      "priority": "high",
      "data": {
        "carId": carId,
        "latitude":  latitude,
        "longitude": longitude,
        "lastSpeed": speed,
        "isEmergency": isEmergency ,
        "isProgrammedStop": isProgrammedStop,
        "isLeader": isLeader
      }
  };

  return message;
}


function createEmergencyMessage(tokens, carId, isEmergency, isLeader){
  var message = {
      "registration_ids": tokens, // required fill with device token or topics
      "priority": "high",
      "data": {
        'carId': carId,
        'isEmergency': isEmergency,
        'isLeader': isLeader
      }
  };

  return message;
}

var deviceTokenList = [];
module.exports = function(app) {

    var controller = {
      registered: function(request, response) {
          return deviceTokenList;
      },
      register: function(request, response) {

        //Add itens to array if it does not exist
        if (deviceTokenList.indexOf(request.query.token) === -1) {
          console.log('Registering... ' +request.query.token);

          deviceTokenList.push(request.query.token);
          console.log("registered tokens:" + deviceTokenList)
          messages.jsonMessageSuccessful(response, request.query.token);
        } else{
          //messages.jsonMessageConflict(response)
        } 
      },
      updatePosition: function(request, response){
        console.log("Updating position...");
        var token = request.query.token;
        //console.log(request.body)

        var message = createUpdatePositionMessage(deviceTokenList, token, request.body.latitude,request.body.longitude,request.body.speed,
          request.body.isEmergency,request.body.isProgrammedStop, request.body.isLeader);
        console.log(message);
        //callback style
        fcm.send(message, function(err, response){
            if (err) {
                console.log("Something has gone wrong!");

                console.log(err);
                //response.send(reponse);
                //response os not defined =/
                messages.jsonMessageInternalError(response, err);
            } else {
                console.log("Successfully sent with response: ", response);
                //response os not defined =/
                messages.jsonMessageSuccessful(response, request.query.token);
            }
        });

      
      },
      emergencyStop: function(request, response){
        console.log("emergencyStop..."); 
        var message = createEmergencyMessage(deviceTokenList, request.query.token, request.body.isEmergency , request.body.isLeader );
        console.log("#####"+message);
         //callback style
        fcm.send(message, function(err, response){
            if (err) {
                console.log("Something has gone wrong!");

                console.log(err);
                messages.jsonMessageInternalError(response, err);
            } else {
                console.log("Successfully sent with response: ", response);
                messages.jsonMessageSuccessful(response, request.query.token);
            }
        });
      },

       

      methodNotAllowed: function(request, response){
          messages.jsonMessageMethodNotAllowed(response);
      }
    }

    return controller;
}