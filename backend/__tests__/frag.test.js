const request = require('supertest');
const app = require('../app');
const User = require('../models/User');
const Fragrance = require('../models/Fragrance');

// mock the models
jest.mock('../models/User');
jest.mock('../models/Fragrance');

describe('Fragrance Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/frag/user/favorites', () => {
    it('should return user favorites successfully', async () => {
      const mockFavorites = [
        { Name: 'Chanel No. 5', Brand: 'Chanel', Notes: 'Rose, Jasmine' },
        { Name: 'Sauvage', Brand: 'Dior', Notes: 'Bergamot, Pepper' }
      ];

      User.findOne = jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue({
          fragrance_favorites: mockFavorites
        })
      });

      const res = await request(app)
        .get('/api/frag/user/favorites')
        .query({ email: 'testuser' });

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockFavorites);
    });

    it('should return 400 if email is missing', async () => {
      const res = await request(app)
        .get('/api/frag/user/favorites');

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Missing required query parameter: email');
    });

    it('should return 404 if user not found', async () => {
      User.findOne = jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(null)
      });

      const res = await request(app)
        .get('/api/frag/user/favorites')
        .query({ email: 'nonexistent' });

      expect(res.status).toBe(404);
      expect(res.body.message).toBe('User not found');
    });
  });

  describe('POST /api/frag/save/user/fragrance', () => {
    it('should save a new fragrance to favorites', async () => {
      const mockFragrance = {
        _id: 'frag123',
        Name: 'New Perfume',
        Brand: 'Test Brand',
        Notes: 'Vanilla, Musk',
        save: jest.fn().mockResolvedValue(true)
      };

      const mockUser = {
        _id: 'user123',
        fragrance_favorites: [],
        save: jest.fn().mockResolvedValue(true)
      };

      Fragrance.findOne = jest.fn().mockResolvedValue(null);
      Fragrance.mockImplementation(() => mockFragrance);
      User.findOne = jest.fn().mockResolvedValue(mockUser);

      const res = await request(app)
        .post('/api/frag/save/user/fragrance')
        .send({
          email: 'testuser',
          Name: 'New Perfume',
          Brand: 'Test Brand',
          Notes: 'Vanilla, Musk'
        });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Fragrance added to favorites successfully');
    });

    it('should return 400 if fragrance already in favorites', async () => {
      const mockFragrance = { _id: 'frag123', Name: 'Existing Perfume' };
      const mockUser = {
        _id: 'user123',
        fragrance_favorites: ['frag123'],
        includes: function(id) { return this.fragrance_favorites.includes(id); }
      };
      mockUser.fragrance_favorites.includes = jest.fn().mockReturnValue(true);

      Fragrance.findOne = jest.fn().mockResolvedValue(mockFragrance);
      User.findOne = jest.fn().mockResolvedValue(mockUser);

      const res = await request(app)
        .post('/api/frag/save/user/fragrance')
        .send({
          email: 'testuser',
          Name: 'Existing Perfume',
          Brand: 'Test Brand',
          Notes: 'Vanilla'
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Fragrance already in favorites list');
    });

    it('should return 404 if user not found', async () => {
      Fragrance.findOne = jest.fn().mockResolvedValue({ _id: 'frag123' });
      User.findOne = jest.fn().mockResolvedValue(null);

      const res = await request(app)
        .post('/api/frag/save/user/fragrance')
        .send({
          email: 'nonexistent',
          Name: 'Perfume',
          Brand: 'Brand',
          Notes: 'Notes'
        });

      expect(res.status).toBe(404);
      expect(res.body.message).toBe('User not found');
    });
  });

  describe('POST /api/frag/remove/user/fragrance', () => {
    it('should remove fragrance from favorites', async () => {
      const mockFragrance = { _id: 'frag123', Name: 'To Remove' };
      const mockUser = {
        _id: 'user123',
        fragrance_favorites: ['frag123'],
        save: jest.fn().mockResolvedValue(true)
      };
      mockUser.fragrance_favorites.includes = jest.fn().mockReturnValue(true);

      Fragrance.findOne = jest.fn().mockResolvedValue(mockFragrance);
      User.findOne = jest.fn().mockResolvedValue(mockUser);

      const res = await request(app)
        .post('/api/frag/remove/user/fragrance')
        .send({ email: 'testuser', Name: 'To Remove' });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Fragrance removed from favorites successfully');
    });

    it('should return 404 if fragrance not found', async () => {
      User.findOne = jest.fn().mockResolvedValue({ _id: 'user123' });
      Fragrance.findOne = jest.fn().mockResolvedValue(null);

      const res = await request(app)
        .post('/api/frag/remove/user/fragrance')
        .send({ email: 'testuser', Name: 'Nonexistent' });

      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Fragrance not found');
    });
  });
});
