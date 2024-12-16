const dgram = require('dgram');
const server = dgram.createSocket('udp4');

const PORT = 12345;
const HOST = '127.0.0.1'; // Replace with your desired IP address or hostname

// Event: When a message is received
server.on('message', (msg, rinfo) => {
    console.log(`Server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
    
    // Optional: Send a response to the client
    const response = Buffer.from('Hello, UDP Client!');
    server.send(response, 0, response.length, rinfo.port, rinfo.address, (err) => {
        if (err) console.error('Error sending response:', err);
        else console.log('Response sent!');
    });
});

// Event: When the server is ready
server.on('listening', () => {
    const address = server.address();
    console.log(`Server listening on ${address.address}:${address.port}`);
});

// Event: When there's an error
server.on('error', (err) => {
    console.error(`Server error:\n${err.stack}`);
    server.close();
});

// Bind server to port and start listening
server.bind(PORT, HOST);