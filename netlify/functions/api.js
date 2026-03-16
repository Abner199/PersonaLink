const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const userRoutes = require('../../backend/routes/users');
const classRoutes = require('../../backend/routes/classes');
const photoWallRoutes = require('../../backend/routes/photowall');
const synonymsRoutes = require('../../backend/routes/synonyms_new');
const errorHandler = require('../../backend/middleware/errorHandler');

const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Routes use the same /api/* prefix as the original server
app.use('/api/users', userRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/photowall', photoWallRoutes);
app.use('/api/synonyms', synonymsRoutes);

app.use(errorHandler);

module.exports.handler = serverless(app);
