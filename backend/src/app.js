const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const env = require('./config/env');
const routes = require('./routes');
const errorHandler = require('./middlewares/error.middleware');

const app = express();

app.use(cors({ origin: env.corsOrigin }));
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/salud', (req, res) => res.json({ estado: 'ok' }));
app.use('/api', routes);

app.use((req, res) => res.status(404).json({ mensaje: 'Recurso no encontrado' }));
app.use(errorHandler);

module.exports = app;
