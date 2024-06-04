/*
HINTPAD NETWORK
-> server: using Nodejs + faye websocket to shutdown/reboot Hintpad PC
*/
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

  const headers = {
    'Access-Control-Allow-Origin': '*', /* @dev First, read about security */
    'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
    'Access-Control-Max-Age': 2592000, // 30 days
  };


  // get the DATA
  let data = '';
  req.on('data', chunk => {
    data += chunk;
    console.log(`Data chunk available: ${chunk}`)

    faye_server.getClient().publish('/faye',
    {
      action: JSON.parse(data).action
    });

  });
  req.on('end', () => {
    // end of data
  })

  // show the page
  var uri = url.parse(req.url).pathname
  , filename = path.join(process.cwd(), './index.html', uri);

  fs.exists(filename, function(exists) {

    if(!exists) {
      res.writeHead(404, {"Content-Type": "text/plain"});
      res.write("---> 404 Not Found\n");
      res.end();
      return;
    }

    // display the html containing the phaser 3 canvas
    if (fs.statSync(filename).isDirectory()) filename += 'index.html';

    fs.readFile(filename, "binary", function(err, file) {

                if (err) {
                    res.writeHeader(404, {
                          'Content-Type': 'text/plain'
                      })
                      res.write('-> 404 Not Found')
                      res.end()
                      return
                  }

                  if (req.url.endsWith('.html')) {
                      /*res.writeHeader(200, {
                          'Content-Type': 'text/html'
                      })*/
                      res.setHeader("Content-Type", "text/html");
                  }

                  if (req.url.endsWith('.js')) {
                      /*res.writeHeader(200, {
                          'Content-Type': 'application/javascript',
                      })*/
                      res.setHeader("Content-Type", "application/javascript");
                  }

                  if (req.url.endsWith('.mjs')) {
                      /*res.writeHeader(200, {
                          'Content-Type': 'module',
                      })*/

                      res.setHeader("Content-Type", "application/javascript");
                  }

      res.writeHead(200);
      res.write(file, "binary");
      res.end();
    });
  });
});

faye_server.attach(http_server);
http_server.listen(port,10);
  "Static file server running at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown");
