'use strict';



module.exports = function(app) {
  	var controller = app.controllers.convoy;
  	app.post('/register', controller.register);
  	app.post('/updatePosition', controller.updatePosition);
  	app.post('/emergencyStop', controller.emergencyStop);
};