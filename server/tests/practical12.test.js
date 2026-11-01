/**
 * Practical 12: GitHub Actions CI Pipeline - Core Test
 * Simple, clear test demonstrating the pass/fail CI pipeline behaviour.
 *
 * PASS STATE  → expect(res.statusCode).toBe(200)   ← correct
 * BROKEN STATE → expect(res.statusCode).toBe(999)  ← deliberately wrong
 */

import { jest, describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../server.js';
import Task from '../models/Task.js';

const TEST_JWT_SECRET = process.env.JWT_SECRET || 'practical12_ci_test_secret_key';
process.env.JWT_SECRET = TEST_JWT_SECRET;

// Valid JWT token for authorized requests
const validToken = jwt.sign(
  { id: 'practical12_student_id', email: 'priyanshi@charusat.ac.in' },
  TEST_JWT_SECRET,
  { expiresIn: '1h' }
);

// Mock data — no live MongoDB needed in CI
const mockTasks = [
  {
    _id: 'abc123def456abc123def456',
    title: 'Practical 12: CI/CD Pipeline Test Task',
    description: 'Automated test via GitHub Actions',
    completed: false,
    priority: 'high',
    createdAt: new Date().toISOString(),
  },
];

let taskFindSpy;

beforeAll(() => {
  // Prevent live DB calls — mock Task.find()
  taskFindSpy = jest.spyOn(Task, 'find').mockReturnValue({
    sort: jest.fn().mockResolvedValue(mockTasks),
  });
});

afterAll(() => {
  if (taskFindSpy) taskFindSpy.mockRestore();
});

// ─────────────────────────────────────────────────────────────────
// TEST 1: GET /tasks → must return 200 with valid JWT token
// ─────────────────────────────────────────────────────────────────
describe('Practical 12 — CI Pipeline Core Tests', () => {

  it('GET /tasks returns HTTP 200 with a valid JWT token', async () => {
    const res = await request(app)
      .get('/tasks')
      .set('Authorization', `Bearer ${validToken}`);

    // ✅ PASSING STATE: correct expected value
    expect(res.statusCode).toBe(200);
  });

  // ─────────────────────────────────────────────────────────────────
  // TEST 2: GET /tasks without token → must return 401 Unauthorized
  // ─────────────────────────────────────────────────────────────────
  it('GET /tasks returns HTTP 401 without Authorization header', async () => {
    const res = await request(app).get('/tasks');

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  // ─────────────────────────────────────────────────────────────────
  // TEST 3: Response body structure validation
  // ─────────────────────────────────────────────────────────────────
  it('GET /tasks response body has success:true and a data array', async () => {
    const res = await request(app)
      .get('/tasks')
      .set('Authorization', `Bearer ${validToken}`);

    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('data');
    expect(Array.isArray(res.body.data)).toBe(true);
  });

});
