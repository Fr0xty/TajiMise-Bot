/**
 * entrypoint of server
 */
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * router imports
 */
import apiRouter from './routes/api/api.js';

/**
 * the server instance
 */
const app = express();

app.use(cookieParser(process.env.SIGN_COOKIE_SECRET_KEY));
app.use(express.json());

/**
 * mount routers
 */
app.use('/api', apiRouter);

/**
 * render React webapp
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, '..', 'build')));

app.get('*', async (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
});

app.listen(3000);
