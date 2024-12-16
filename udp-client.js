const dgram = require('dgram');
const http = require('http');

// UDP Client Setup
const UDP_PORT = 4567; // Port to send UDP messages
const UDP_HOST = '127.0.0.1'; // Host of the UDP server
const client = dgram.createSocket('udp4');

// HTTP Server Setup
const HTTP_PORT = 3000; // Port for the HTTP server

// HTTP Server to accept GET requests and relay to UDP
const httpServer = http.createServer((req, res) => {
    if (req.method === 'GET') {
        const url = new URL(req.url, `http://${req.headers.host}`);
        const message = url.searchParams.get('message');

        if (message) {
            // Send the message to the UDP server
            const buffer = Buffer.from(message);
            client.send(buffer, 0, buffer.length, UDP_PORT, UDP_HOST, (err) => {
                if (err) {
                    console.error('Error sending message to UDP server:', err);
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Failed to send message to UDP server');
                } else {
                    console.log(`Relayed to UDP server: "${message}"`);
                    res.writeHead(200, { 'Content-Type': 'text/plain' });
                    res.end(`Message relayed to UDP server on port ${UDP_PORT}: "${message}"`);
                }
            });
        } else {
            // If no message is provided
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('Missing "message" query parameter');
        }
    } else {
        // Return 405 Method Not Allowed for non-GET requests
        res.writeHead(405, { 'Content-Type': 'text/plain' });
        res.end('Only GET requests are allowed');
    }
});

// Start the HTTP server
httpServer.listen(HTTP_PORT, () => {
    console.log(`HTTP server running at http://localhost:${HTTP_PORT}`);
    console.log(`Send a message via: http://localhost:${HTTP_PORT}/?message=YourMessage`);
});

// Handle UDP responses (optional)
client.on('message', (msg, rinfo) => {
    console.log(`Received from UDP server: ${msg} (${rinfo.address}:${rinfo.port})`);
});