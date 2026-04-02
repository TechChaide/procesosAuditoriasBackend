const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

// Import routes
const auditor_area_responsableRoutes = require('./routes/auditor_area_responsable.routes');
const configuracionRoutes = require('./routes/configuracion.routes');
const agenda_evaluacionRoutes = require('./routes/agenda_evaluacion.routes');
const area_tipo_auditoriaRoutes = require('./routes/area_tipo_auditoria.routes');
const estadoRoutes = require('./routes/estado.routes');
const evaluacionRoutes = require('./routes/evaluacion.routes');
const evaluadorRoutes = require('./routes/evaluador.routes');
const modeloRoutes = require('./routes/modelo.routes');
const modelo_preguntaRoutes = require('./routes/modelo_pregunta.routes');
const plan_accionRoutes = require('./routes/plan_accion.routes');
const plan_accion_estadoRoutes = require('./routes/plan_accion_estado.routes');
const preguntaRoutes = require('./routes/pregunta.routes');
const propiedadRoutes = require('./routes/propiedad.routes');
const puesto_trabajoRoutes = require('./routes/puesto_trabajo.routes');
const puesto_trabajo_preguntaRoutes = require('./routes/puesto_trabajo_pregunta.routes');
const respuestasRoutes = require('./routes/respuestas.routes');
const tipo_accionRoutes = require('./routes/tipo_accion.routes');
const tipo_auditoriaRoutes = require('./routes/tipo_auditoria.routes');
const tipo_propiedadRoutes = require('./routes/tipo_propiedad.routes');
const authRoutes = require('./routes/auth.routes');

const serviciosRoutes = require('./routes/servicios.routes');
const notificacionesCronRoutes = require('./routes/notificaciones-cron.routes');

const app = express();

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
}));

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'SQL Server API is running',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// API Routes
app.use('/api/auditor_area_responsable', auditor_area_responsableRoutes);
app.use('/api/configuracion', configuracionRoutes);
app.use('/api/agenda_evaluacion', agenda_evaluacionRoutes);
app.use('/api/area_tipo_auditoria', area_tipo_auditoriaRoutes);
app.use('/api/estado', estadoRoutes);
app.use('/api/evaluacion', evaluacionRoutes);
app.use('/api/evaluador', evaluadorRoutes);
app.use('/api/modelo', modeloRoutes);
app.use('/api/modelo_pregunta', modelo_preguntaRoutes);
app.use('/api/plan_accion', plan_accionRoutes);
app.use('/api/plan_accion_estado', plan_accion_estadoRoutes);
app.use('/api/pregunta', preguntaRoutes);
app.use('/api/propiedad', propiedadRoutes);
app.use('/api/puesto_trabajo', puesto_trabajoRoutes);
app.use('/api/puesto_trabajo_pregunta', puesto_trabajo_preguntaRoutes);
app.use('/api/respuestas', respuestasRoutes);
app.use('/api/tipo_accion', tipo_accionRoutes);
app.use('/api/tipo_auditoria', tipo_auditoriaRoutes);
app.use('/api/tipo_propiedad', tipo_propiedadRoutes);
app.use('/api/auth', authRoutes);

app.use('/api/servicios', serviciosRoutes);
app.use('/api/notificaciones-cron', notificacionesCronRoutes);

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Endpoint not found',
        path: req.originalUrl,
        method: req.method
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

module.exports = app;