// api/src/app.js
require('dotenv').config();

const path = require('path');
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const app = express();
app.use(express.json());

// Swagger (après création de app)
const swaggerSpec = YAML.load(path.join(__dirname, '../docs/swagger.yaml'));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes (tu as un dossier 'route' au singulier)
app.use('/api/artists', require('./route/artists'));
app.use('/api/genres', require('./route/genres'));
app.use('/api/albums', require('./route/albums'));
app.use('/api/tracks', require('./route/tracks'));

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// Error handler global
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err);
  if (err && err.code === 'ER_NO_REFERENCED_ROW_2') {
    return res.status(400).json({ error: 'Foreign key constraint fails' });
  }
  if (err && err.code === 'ER_ROW_IS_REFERENCED_2') {
    return res.status(409).json({ error: 'Cannot delete: row is referenced' });
  }
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API listening on port ${PORT}`));
