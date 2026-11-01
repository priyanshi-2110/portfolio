/**
 * Practical 12: BROKEN TEST — Deliberately fails the CI pipeline
 *
 * This file demonstrates Step 5 of the practical:
 * "Deliberately break the test (change an expected value) and push again"
 *
 * ❌ BROKEN: expect(res.statusCode).toBe(999)  ← wrong value, causes RED ✗ in CI
 *
 * To fix: change 999 back to 200 → pipeline turns GREEN ✓
 */

import { jest, describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../server.js';
import Task from '../models/Task.js';

const TEST_JWT_SECRET = process.env.JWT_SECRET || 'practical12_ci_test_secret_key';
process.env.JWT_SECRET = TEST_JWT_SECRET;

const validToken = jwt.sign(
  { id: 'practical12_student_id', email: 'priyanshi@charusat.ac.in' },
  TEST_JWT_SECRET,
  { expiresIn: '1h' }
);

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
  taskFindSpy = jest.spyOn(Task, 'find').mockReturnValue({
    sort: jest.fn().mockResolvedValue(mockTasks),
  });
});

afterAll(() => {
  if (taskFindSpy) taskFindSpy.mockRestore();
});

describe('Practical 12 — BROKEN TEST (Step 5: Deliberate Failure)', () => {

  it('GET /tasks returns HTTP 200 — ❌ DELIBERATELY BROKEN: expects 999 instead of 200', async () => {
    const res = await request(app)
      .get('/tasks')
      .set('Authorization', `Bearer ${validToken}`);

    // ✅ FIXED: actual response is 200, so the CI pipeline should pass
    expect(res.statusCode).toBe(200);
  });

});
