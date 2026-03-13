import jsonServer from 'json-server';
import path from 'path';
import { fileURLToPath } from 'url';

const server = jsonServer.create();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In Vercel, the db.json should be at the root or correctly referenced
// We'll assume it's in the root directory relative to the function
const router = jsonServer.router(path.join(process.cwd(), 'db.json'));
const middlewares = jsonServer.defaults();

server.use(middlewares);

// Add a rewrite rule for Vercel to handle plural vs singular if needed
server.use(jsonServer.rewriter({
    '/api/*': '/$1'
}));

server.use(router);

export default server;
