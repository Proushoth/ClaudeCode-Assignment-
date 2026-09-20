'use strict';

const express = require('express');
const { validateTask } = require('./validators');

const app = express();

app.use(express.json());

// In-memory task store
const tasks = [];
let nextId = 1;

/**
 * GET /tasks
 * Returns the full list of tasks.
 */
app.get('/tasks', (req, res) => {
  res.status(200).json(tasks);
});

/**
 * POST /tasks
 * Creates a new task.
 * Body: { title: string, description?: string, priority?: 'low'|'medium'|'high' }
 */
app.post('/tasks', (req, res) => {
  const { value, error } = validateTask(req.body);
  if (error) {
    return res.status(400).json({ error });
  }

  const task = {
    id: nextId++,
    title: value.title,
    priority: value.priority,
    description: value.description,
    createdAt: new Date().toISOString(),
  };

  tasks.push(task);
  res.status(201).json(task);
});

/**
 * DELETE /tasks/:id
 * Deletes a task by id.
 * Returns 204 No Content on success, 404 if not found.
 */
app.delete('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = tasks.findIndex((t) => t.id === id);

  if (index === -1) {
    return res.status(404).json({ error: `Task with id ${id} not found.` });
  }

  tasks.splice(index, 1);
  res.status(204).send();
});

module.exports = app;
