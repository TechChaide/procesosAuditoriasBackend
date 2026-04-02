const express = require('express');
const router = express.Router();
const PropiedadController = require('../controllers/propiedad.controller');

// CRUD Endpoints
router.get('/', PropiedadController.getAll);
router.post('/', PropiedadController.createOrUpdate);
router.get('/:id', PropiedadController.getById);
router.delete('/:id', PropiedadController.deactivate);


router.post('/ppPregunta', PropiedadController.getPropiedadesPorCodigoPregunta);

module.exports = router;