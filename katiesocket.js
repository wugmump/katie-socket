const http = require('http'); // For HTTP server
const Max = require("max-api"); // Max API for interaction with Max

// Configurations
const HTTP_PORT = 3000; // HTTP server port

// Log function for Max console output
function log(message) {
    console.log(message); // Log messages for debugging
}

// HTTP Server to accept GET requests and relay to Max outlet
const httpServer = http.createServer((req, res) => {
    if (req.method === 'GET') {
        const url = new URL(req.url, `http://${req.headers.host}`);
        const message = url.searchParams.get('message');

        if (message) {
            // Send the message to Max outlet
            Max.outlet(message); // Only the GET "message" goes to outlet
            log(`Relayed to Max outlet: "${message}"`);

            // Respond to the HTTP request
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(`Message relayed to Max: "${message}"`);
        } else {
            // Respond with an error if "message" query parameter is missing
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('Missing "message" query parameter');
            log('Error: Missing "message" query parameter in GET request');
        }
    } else {
        // Handle non-GET requests with a 405 Method Not Allowed response
        res.writeHead(405, { 'Content-Type': 'text/plain' });
        res.end('Only GET requests are allowed');
        log(`Error: Non-GET request received (${req.method})`);
    }
});

// Start the HTTP server
httpServer.listen(HTTP_PORT, () => {
    log(`HTTP server running at http://localhost:${HTTP_PORT}`);
    log(`Send a message via: http://localhost:${HTTP_PORT}/?message=YourMessage`);
});

// Max handlers for additional commands
Max.addHandler("close", () => {
    httpServer.close(() => {
        log('HTTP server closed.');
    });
});

Max.addHandler("status", () => {
    log(`HTTP server running at http://localhost:${HTTP_PORT}`);
});