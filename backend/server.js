import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import dotenv from 'dotenv';
import eventRoutes from './routes/eventRoutes.js';
import profileRoutes from './routes/profileRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Create upload directories
const postersDir = path.join(__dirname, 'uploads', 'posters');
const paperworkDir = path.join(__dirname, 'uploads', 'paperwork');
const profilesDir = path.join(__dirname, 'uploads', 'profiles');

try {
    if (!fs.existsSync(postersDir)) fs.mkdirSync(postersDir, { recursive: true });
    if (!fs.existsSync(paperworkDir)) fs.mkdirSync(paperworkDir, { recursive: true });
    if (!fs.existsSync(profilesDir)) fs.mkdirSync(profilesDir, { recursive: true });
    
    fs.chmodSync(postersDir, '755');
    fs.chmodSync(paperworkDir, '755');
    fs.chmodSync(profilesDir, '755');
} catch (err) {
    console.error('Error creating upload directories:', err);
}

// CORS configuration
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
    exposedHeaders: ['Content-Disposition']
}));

app.use(express.json());

// Static file serving configuration
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
    setHeaders: (res, filepath) => {
        res.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000',
            'Access-Control-Allow-Methods': 'GET',
            'Cross-Origin-Resource-Policy': 'cross-origin',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        });

        // Set content type based on file extension
        if (filepath.endsWith('.jpg') || filepath.endsWith('.jpeg')) {
            res.set('Content-Type', 'image/jpeg');
        } else if (filepath.endsWith('.png')) {
            res.set('Content-Type', 'image/png');
        }
    }
}));

// Debug middleware for file requests
app.use('/uploads', (req, res, next) => {
    console.log('File request:', {
        path: req.path,
        fullUrl: req.protocol + '://' + req.get('host') + req.originalUrl,
        method: req.method
    });
    next();
});

// API Routes
app.use('/api/events', eventRoutes);
app.use('/api/profile', profileRoutes);

// Global error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
});

// File serving error handler
app.use('/uploads/*', (err, req, res, next) => {
    console.error('File serving error:', err);
    res.status(404).json({
        success: false,
        message: 'File not found'
    });
});

// Server initialization
const startServer = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
        
        const PORT = process.env.PORT || 5001;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error('Server initialization error:', err);
        process.exit(1);
    }
};

startServer();

export default app;