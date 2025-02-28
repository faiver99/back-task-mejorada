const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    dueDate: { type: Date, required: true },
    completed: { type: Boolean, default: false },
    completionDate: Date,
}, { timestamps: true });

module.exports = mongoose.model('Task', TaskSchema);
