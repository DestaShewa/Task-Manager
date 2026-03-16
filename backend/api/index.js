import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import taskRoutes from './routes/taskRoutes.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 1. CORS ALWAYS FIRST - Extremely permissive for debugging
app.use(cors()); // Allow all origins, methods, and headers by default
app.options('*', cors()); // Explicitly handle pre-flight requests for all routes

// 2. Security (Careful with Helmet in dev/CORS setups)
app.use(helmet({
    crossOriginResourcePolicy: false,
    crossOriginEmbedderPolicy: false,
}));
app.use(morgan('dev'));
app.use(express.json());

// 3. Request Logging (Debug)
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    console.log('Headers:', JSON.stringify(req.headers));
    next();
});

// 4. Routes
app.use('/tasks', taskRoutes);
app.use('/users', userRoutes);

// Root/Health route
app.get('/', (req, res) => {
    res.json({
        status: 'online',
        message: 'Task Manager API is ready',
        timestamp: new Date().toISOString()
    });
});

// 5. 404 Handler (Keep this before error handler)
app.use((req, res) => {
    console.warn(`404 Not Found: ${req.method} ${req.url}`);
    res.status(404).json({ message: `Route ${req.method} ${req.url} not found on this server` });
});

// 6. Error handling middleware
app.use((err, req, res, next) => {
    console.error('SERVER ERROR:', err.stack);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Production server running on port ${PORT}`);
    console.log(`Routes registered: /tasks, /users`);
});

export default app;
