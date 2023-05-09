import * as debug from 'debug';
import * as http from 'http';

import Server from './server';

const serverPort = 4000;
const isDebug = false;

function normalizePort(val: number | string): number | string | boolean {
    const port: number = typeof val === 'string' ? parseInt(val, 10) : val;
    if (isNaN(port)) {
        return val;
    } else if (port >= 0) {
        return port;
    }
    return false;
}

function onError(error: NodeJS.ErrnoException): void {
    if (error.syscall !== 'listen') {
        throw error;
    }
    const bind = typeof serverPort === 'string' ? `Pipe ${serverPort}` : `Port ${serverPort}`;
    switch (error.code) {
        case 'EACCES':
            console.error(`${bind} requires elevated privileges`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(`${bind} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
}

debug('ts-express:server');
const port = normalizePort(serverPort);
Server.set('port', port);

const server = http.createServer(Server);
server.on('error', onError);

module.exports = Server.listen(port);
