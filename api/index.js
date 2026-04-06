import jsonServer from 'json-server';
import fs from 'fs';
import path from 'path';

const server = jsonServer.create();

// Read db.json into a JavaScript object to create an IN-MEMORY database.
// This prevents 'EROFS: read-only file system' errors on Vercel.
const dbPath = path.join(process.cwd(), 'db.json');
const dbRaw = fs.readFileSync(dbPath, 'utf8');
const dbObj = JSON.parse(dbRaw);

const router = jsonServer.router(dbObj);
const middlewares = jsonServer.defaults();

server.use(middlewares);

// Rewrites /api/endpoint to /endpoint so router can match it correctly
server.use(jsonServer.rewriter({
    '/api/*': '/$1',
}));

server.use(router);

export default server;
