import express from 'express';
import cors from 'cors';
import path from 'path';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import entityRoutes from './routes/entities.js';
import inventoryRoutes from './routes/inventory.js';
import supplierRoutes from './routes/suppliers.js';
import chatRoutes from './routes/chat.js';
import callRoutes from './routes/calls.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || process.env.API_PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

app.use('/api/auth', authRoutes);
app.use('/api/entities', entityRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/calls', callRoutes);

// Serve built React frontend if dist/ exists (production)
const distPath = path.resolve(__dirname, '../dist');
if (existsSync(path.join(distPath, 'index.html'))) {
  console.log('Serving static frontend from dist/');
  app.use(express.static(distPath));
  app.get('/{*path}', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  console.log('No dist/ found — running in API-only / dev mode');
}

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Oplo API server running on port ${PORT}`);
  const domains = process.env.REPLIT_DOMAINS || '';
  const devDomain = process.env.REPLIT_DEV_DOMAIN || '';
  const publicUrl = process.env.PUBLIC_URL || '';
  const firstDomain = domains.split(' ')[0].trim();
  const resolvedUrl = firstDomain ? `https://${firstDomain}` : devDomain ? `https://${devDomain}` : publicUrl || 'http://localhost:3001';
  console.error(`[Config] REPLIT_DOMAINS="${domains}"`);
  console.error(`[Config] REPLIT_DEV_DOMAIN="${devDomain}"`);
  console.error(`[Config] PUBLIC_URL="${publicUrl}"`);
  console.error(`[Config] TwiML base URL will be: ${resolvedUrl}`);
});
