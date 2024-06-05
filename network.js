

var http = require("http"),

url = require("url"),
fs = require("fs"),
port = 3015;

const { spawn } = require("child_process");
const path    = require('path');
const mPath = path.resolve(__dirname, '..');

var faye = require ('faye');
var faye_server = new faye.NodeAdapter ({mount: '/faye', timeout: 120});
var http_server = http.createServer(function(req,res){

  // get the DATA
  let data = '';
  req.on('data', chunk => {
    data += chunk;
    console.log(`Data chunk available: ${JSON.parse(data).action}`)

    if (JSON.parse(data).action == "reboot") {
        console.log ("REBOOT!");
        
    }


  });
  req.on('end', () => {
    // end of data
  })


});

faye_server.attach(http_server);
http_server.listen(port,10);
console.log("Static file server running at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown");

function shutdown () {
  exec ('shutdown /s /f /t 0', (error, stdout, stderr) => {
    if (error) {
      console.error ( 'Error shutting down:  $(error)' );
      return
    }
    console.log ( 'SHUTOWN!');
  })
}

function shutdown () {
  exec ('shutdown /r /f /t 0', (error, stdout, stderr) => {
    if (error) {
      console.error ( 'Error rebooting:  $(error)' );
      return
    }
    console.log ( 'REBOOT!');
  })
}