const request = require('supertest');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Import app after env vars are loaded
const app = require('../src/server');
const User = require('../src/models/userModel');

// Test user data
const testUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123',
};

// Before running tests
beforeAll(async () => {
  try {
    console.log('Connecting to MongoDB at:', process.env.MONGODB_URI);
    // Connect to the test database
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Successfully connected to MongoDB');
    
    // Clear the test database
    await User.deleteMany({});
    console.log('Cleared test database');
  } catch (error) {
    console.error('Error in beforeAll:', error);
    throw error;
  }
});

// After each test
afterEach(async () => {
  try {
    // Clean up test database after each test
    await User.deleteMany({});
    console.log('Cleaned up test data');
  } catch (error) {
    console.error('Error in afterEach:', error);
    throw error;
  }
});

// After all tests are done
afterAll(async () => {
  try {
    // Close the database connection
    await mongoose.connection.dropDatabase();
    console.log('Dropped test database');
    await mongoose.connection.close();
    console.log('Closed MongoDB connection');
  } catch (error) {
    console.error('Error in afterAll:', error);
    throw error;
  }
});

describe('User Authentication Tests', () => {
  // Test user registration
  test('should register a new user', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({
        name: testUser.name,
        email: testUser.email,
        password: testUser.password,
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body).toHaveProperty('name', testUser.name);
    expect(res.body).toHaveProperty('email', testUser.email);
    expect(res.body).toHaveProperty('token');
  });

  // Test duplicate email registration
  test('should not register user with duplicate email', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({
        name: 'Another User',
        email: testUser.email, // Duplicate email
        password: 'password123',
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toContain('User already exists');
  });

  // Test user login
  test('should login existing user', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('_id');
    expect(res.body).toHaveProperty('email', testUser.email);
    expect(res.body).toHaveProperty('token');
  });

  // Test invalid login credentials
  test('should not login with invalid credentials', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({
        email: testUser.email,
        password: 'wrongpassword',
      });

    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toContain('Invalid credentials');
  });

  // Test getting user profile with valid token
  test('should get user profile with valid token', async () => {
    // First login to get token
    const loginRes = await request(app)
      .post('/api/users/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    const token = loginRes.body.token;

    // Use token to get profile
    const profileRes = await request(app)
      .get('/api/users/profile')
      .set('Authorization', `Bearer ${token}`);

    expect(profileRes.statusCode).toEqual(200);
    expect(profileRes.body).toHaveProperty('_id');
    expect(profileRes.body).toHaveProperty('email', testUser.email);
  });

  // Test accessing protected route without token
  test('should not access protected route without token', async () => {
    const res = await request(app)
      .get('/api/users/profile')
      // No token provided

    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toContain('Not authorized');
  });
});
