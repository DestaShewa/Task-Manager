import jsonServer from 'json-server';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const server = jsonServer.create();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults({
    noCors: true // We will handle CORS ourselves
});

// Enable CORS for your Vercel deployment
server.use(cors({
    origin: '*', // Allow all for demo, or you can specify your vercel domain
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 204
}));

server.use(middlewares);
server.use(router);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`JSON Server is running on port ${PORT}`);
});
