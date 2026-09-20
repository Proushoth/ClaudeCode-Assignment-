'use strict';

const request = require('supertest');
const { app } = require('../app');

describe('GET /tasks', () => {
  it('returns 200 and an empty array initially', async () => {
    const res = await request(app).get('/tasks');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });
});

describe('POST /tasks', () => {
  it('creates a task with a valid title', async () => {
    const res = await request(app)
      .post('/tasks')
      .send({ title: 'Buy groceries' });

    expect(res.statusCode).toBe(201);
    expect(res.body).toMatchObject({
      id: expect.any(Number),
      title: 'Buy groceries',
      description: '',
      createdAt: expect.any(String),
    });
  });

  it('creates a task with title and description', async () => {
    const res = await request(app)
      .post('/tasks')
      .send({ title: 'Read a book', description: 'Finish chapter 3' });

    expect(res.statusCode).toBe(201);
    expect(res.body.description).toBe('Finish chapter 3');
  });

  it('returns 400 when title is missing', async () => {
    const res = await request(app).post('/tasks').send({});
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('returns 400 when title is an empty string', async () => {
    const res = await request(app).post('/tasks').send({ title: '   ' });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('returns 400 when title is not a string', async () => {
    const res = await request(app).post('/tasks').send({ title: 42 });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('returns 400 when description is not a string', async () => {
    const res = await request(app)
      .post('/tasks')
      .send({ title: 'Valid title', description: 42 });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toMatch(/description must be a string/i);
  });
});

describe('GET /tasks after inserts', () => {
  it('returns all created tasks', async () => {
    const res = await request(app).get('/tasks');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });
});

describe('DELETE /tasks/:id', () => {
  it('deletes an existing task and returns 204', async () => {
    // Create a task first
    const created = await request(app)
      .post('/tasks')
      .send({ title: 'Task to delete' });
    const { id } = created.body;

    const res = await request(app).delete(`/tasks/${id}`);
    expect(res.statusCode).toBe(204);
    expect(res.body).toEqual({});
  });

  it('removes the task from subsequent GET /tasks', async () => {
    // Create and immediately delete
    const created = await request(app)
      .post('/tasks')
      .send({ title: 'Ephemeral task' });
    const { id } = created.body;
    await request(app).delete(`/tasks/${id}`);

    const res = await request(app).get('/tasks');
    const ids = res.body.map((t) => t.id);
    expect(ids).not.toContain(id);
  });

  it('returns 404 for a non-existent id', async () => {
    const res = await request(app).delete('/tasks/999999');
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  it('returns 404 when deleting an already-deleted task', async () => {
    const created = await request(app)
      .post('/tasks')
      .send({ title: 'Delete me twice' });
    const { id } = created.body;

    await request(app).delete(`/tasks/${id}`);
    const res = await request(app).delete(`/tasks/${id}`);
    expect(res.statusCode).toBe(404);
  });
});

