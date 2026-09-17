'use strict';

const express = require('express');

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
 * Body: { title: string, description?: string }
 */
app.post('/tasks', (req, res) => {
  const { title, description = '' } = req.body;

  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ error: '`title` is required and must be a non-empty string.' });
  }

  const task = {
    id: nextId++,
    title: title.trim(),
    description: description.trim(),
    createdAt: new Date().toISOString(),
  };

  tasks.push(task);
  res.status(201).json(task);
});

module.exports = app;
