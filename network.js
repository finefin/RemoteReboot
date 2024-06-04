// server.js
const http = require('http');
const faye = require('faye');
const fs = require('fs');
const path = require('path');
const { reboot, shutdown } = require('node-shutdown-windows');

// Create a basic HTTP server
const server = http.createServer((req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.url === '/') {
        fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    } else if (req.url === '/faye-browser.js') {
        fs.readFile(path.join(__dirname, 'node_modules', 'faye', 'browser', 'faye-browser.js'), (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
            } else {
                res.writeHead(200, { 'Content-Type': 'application/javascript' });
                res.end(data);
            }
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

// Attach Faye to the server
const bayeux = new faye.NodeAdapter({ mount: '/faye', timeout: 45 });
bayeux.attach(server);

// Handle Faye messages
bayeux.getClient().subscribe('/commands', (message) => {
    if (message.action === 'reboot') {
        console.log('Rebooting...');
        reboot();
    } else if (message.action === 'shutdown') {
        console.log('Shutting down...');
        shutdown();
    }
});

// Start the server
const PORT = 8000;
server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
