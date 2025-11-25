import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { initializeDatabase } from './database/connection';
import { initSchema } from './database/schema';
import speciesRoutes from './routes/species';
import locationsRoutes from './routes/locations';
import imagesRoutes from './routes/images';
import weatherRoutes from './routes/weather';
import recommendedRoutes from './routes/recommended';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialization
const app = express();
const PORT = process.env.PORT || 3001;
initializeDatabase();
initSchema();
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

// API routes
app.use('/api/species', speciesRoutes);
app.use('/api/locations', locationsRoutes);
app.use('/api/images', imagesRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/recommended', recommendedRoutes);

// Serve static files from SvelteKit build
const buildPath = path.join(__dirname, '../build');
app.use(express.static(buildPath));

// SPA fallback - serve index.html for all non-API routes (must be last!)
app.use((req, res, next) => {
	if (req.path.startsWith('/api/')) {
		return res.status(404).json({ error: 'API endpoint not found' });
	}
	res.sendFile(path.join(buildPath, 'index.html'));
});

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
	console.log(`API endpoints available:`);
	console.log(`  - http://localhost:${PORT}/api/species`);
	console.log(`  - http://localhost:${PORT}/api/locations`);
	console.log(`  - http://localhost:${PORT}/api/images`);
	console.log(`  - http://localhost:${PORT}/api/weather`);
	console.log(`  - http://localhost:${PORT}/api/recommended`);
});
