const request = require('supertest');
const app = require('../app');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// mock the User model
jest.mock('../models/User');

// mock environment variable
process.env.JWT_SECRET = 'test-secret-key';

describe('Auth Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user with valid email and password', async () => {
      const mockUser = {
        email: 'test@example.com',
        password: 'hashedpassword',
        fragrance_favorites: [],
        fragrance_profile: '',
        save: jest.fn().mockResolvedValue(true)
      };

      User.findOne = jest.fn().mockResolvedValue(null);
      User.mockImplementation(() => mockUser);

      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'test@example.com', password: 'Password123' });

      expect(res.status).toBe(201);
      expect(res.body.message).toBe('Account created successfully');
      expect(mockUser.save).toHaveBeenCalled();
    });

    it('should return 400 for invalid email format', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'invalid-email', password: 'Password123' });

      expect(res.status).toBe(400);
      expect(res.body.errors).toContain('Please enter a valid email address');
    });

    it('should return 400 for weak password (no uppercase)', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'test@example.com', password: 'password123' });

      expect(res.status).toBe(400);
      expect(res.body.errors).toContain('Password must contain at least one uppercase letter');
    });

    it('should return 400 for weak password (no number)', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'test@example.com', password: 'Password' });

      expect(res.status).toBe(400);
      expect(res.body.errors).toContain('Password must contain at least one number');
    });

    it('should return 400 for short password', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'test@example.com', password: 'Pass1' });

      expect(res.status).toBe(400);
      expect(res.body.errors).toContain('Password must be at least 8 characters');
    });

    it('should return 409 if email already exists', async () => {
      User.findOne = jest.fn().mockResolvedValue({ email: 'test@example.com' });

      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'test@example.com', password: 'Password123' });

      expect(res.status).toBe(409);
      expect(res.body.message).toBe('An account with this email already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login successfully with valid credentials', async () => {
      const hashedPassword = await bcrypt.hash('Password123', 12);
      const mockUser = {
        _id: 'user123',
        email: 'test@example.com',
        password: hashedPassword
      };

      User.findOne = jest.fn().mockResolvedValue(mockUser);

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'Password123' });

      expect(res.status).toBe(200);
      expect(res.body.token).toBeDefined();
      expect(res.body.user.email).toBe('test@example.com');
    });

    it('should return 400 for missing credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com' });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Email and password are required');
    });

    it('should return 401 for non-existent user', async () => {
      User.findOne = jest.fn().mockResolvedValue(null);

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'nonexistent@example.com', password: 'Password123' });

      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Invalid email or password');
    });

    it('should return 401 for incorrect password', async () => {
      const hashedPassword = await bcrypt.hash('CorrectPassword123', 12);
      const mockUser = {
        _id: 'user123',
        email: 'test@example.com',
        password: hashedPassword
      };

      User.findOne = jest.fn().mockResolvedValue(mockUser);

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'WrongPassword123' });

      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Invalid email or password');
    });

    it('should normalize email to lowercase', async () => {
      const hashedPassword = await bcrypt.hash('Password123', 12);
      const mockUser = {
        _id: 'user123',
        email: 'test@example.com',
        password: hashedPassword
      };

      User.findOne = jest.fn().mockResolvedValue(mockUser);

      await request(app)
        .post('/api/auth/login')
        .send({ email: 'TEST@EXAMPLE.COM', password: 'Password123' });

      expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
    });
  });
});
