const express = require('express');
const { checkRole } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');
const Task = require('../models/Task');

const router = express.Router();

// Crear tarea (solo admin)
router.post('/', checkRole('admin'), [
    body('title').isString().trim().notEmpty(),
    body('description').optional().isString(),
    body('assignedTo').isMongoId(),
    body('dueDate').isISO8601().toDate()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { title, description, assignedTo, dueDate } = req.body;
    const task = new Task({ title, description, assignedTo, dueDate });

    await task.save();
    res.json({ message: 'Tarea creada' });
});

// Obtener tareas asignadas a un usuario
router.get('/', async (req, res) => {
    const tasks = await Task.find({ assignedTo: req.userId });
    res.json(tasks);
});

// Completar tarea
router.put('/:id/complete', async (req, res) => {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Tarea no encontrada' });

    task.completed = true;
    task.completionDate = new Date();
    await task.save();

    res.json({ message: 'Tarea completada' });
});

module.exports = router;

