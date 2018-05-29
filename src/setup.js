'use strict';

const inquirer = require('inquirer'),
    node_windows = require('node-windows'),
    common = require('./common');

module.exports = function() {
  
  var dic = {};
  
  dic["SET_PM2_HOME"] = "Yes"
  dic["SET_PM2_SERVICE_PM2_DIR"] = "Yes"
  dic["SET_PM2_SERVICE_SCRIPTS"] = "Yes"
  dic["SET_PM2_HOME"] = "Yes"
  dic["PM2_HOME"] = "%InstallPath%\Cyberbit\\node\\pm2"
  dic["PM2_SERVICE_SCRIPTS"] = "%InstallPath%\Cyberbit\\node\\processes.json"
  dic["PM2_SERVICE_PM2_DIR"] = "%InstallPath%\Cyberbit\\node\\pm2"

  return do_setup(dic)
};

function do_setup(answers) {
    // Perform setup based on answers object
    const command_promises = Object.keys(answers)
        // Filter out unanswered questions
        .filter(key => !!answers[key])
        // Convert answers to promises resolved/rejected by elevated SETX command executions
        .map(key => new Promise((resolve, reject) => {
            node_windows.elevate(`SETX ${key} "${answers[key]}" /m`, err => {
                if(err) {
                    return reject(err);
                }

                resolve();
            });
        }));

    // Return a promise which combines all the commands being executed
    return Promise.all(command_promises);
}