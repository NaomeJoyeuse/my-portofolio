const request = require('supertest');
const { app, startServer } = require('../index');
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel =  require('../models/User');
const userController = require('../controller/UserController');
const blogController = require('../controller/UserController');
const { validateSignup, validateLogin } = require('../middlewares/validattion');
const { isAuthenticated } = require('../middlewares/authentication')
 
describe('Blog API', () => {
  let mongoServer;
  let createdBlogId;

  const { isAuthenticated } = require('../middlewares/authentication');

  beforeAll(async () => {
    // Create the in-memory MongoDB server
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    
    // Check if there's an existing Mongoose connection
    if (mongoose.connection.readyState !== 0) {
      // If connected, disconnect from the current database
      await mongoose.disconnect();
    }
  
   

    // Connect to the in-memory database
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const user = await UserModel.create({
      email: 'testuser3@gmail.com',
      password: await bcrypt.hash('password123', 10)
    });
    
    token = jwt.sign({ id: user._id }, 'secret_key123');
  });

  afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    await mongoServer.stop();
  });

  it('should respond to the test route', async () => {
    const res = await request(app)
      .get('/test')
      .expect(200);
    
    expect(res.body).toHaveProperty('message', 'Test route');
  });




  it('should create a new blog post', async () => {
    const res = await request(app)
      .post('/api/blog') 
        .set('Authorization', `Bearer ${token}`) 
      .send({
        title: 'Test Blog',
        content: 'This is a test blog post.',
        author: 'Test Author'
      })
      .expect(201);

    expect(res.body).toHaveProperty('title', 'Test Blog');
    expect(res.body).toHaveProperty('content', 'This is a test blog post.');
    expect(res.body).toHaveProperty('author', 'Test Author');
    createdBlogId = res.body._id;
  });

  it('should return 400 for invalid input', async () => {
    const res = await request(app)
      .post('/api/blog') 
      .set('Authorization', `Bearer ${token}`) 
      .send({}) 
      .expect(400);

    expect(res.body).toHaveProperty('error');
  });


  it('should get all blog posts', async () => {
    const res = await request(app)
      .get('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBeTruthy();
  });

  it('should get a blog post by id', async () => {
    const res = await request(app)
      .get(`/api/blogs/${createdBlogId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body).toHaveProperty('title', 'Test Blog');
  });

  it('should update a blog post', async () => {
    const res = await request(app)
      .patch(`/api/blogs/${createdBlogId}`)
      .set('Authorization', `Bearer ${token}`) 
      .send({ title: 'Updated Test Blog' })
      .expect(200);

    expect(res.body).toHaveProperty('title', 'Updated Test Blog');
  });

  it('should delete a blog post', async () => {
    await request(app)
      .delete(`/api/blogs/${createdBlogId}`)
      .set('Authorization', `Bearer ${token}`) // Incl
      .expect(204);
  });

  // it('should save a comment', async () => {
  //   const res = await request(app)
  //     .post(`/api/blogs/${createdBlogId}/comments`)
  //     .send({ content: 'Test comment' })
  //     .expect(201);

  //   expect(res.body).toHaveProperty('content', 'Test comment');
  // });

// it('should save a comment', async () => {
//     const res = await request(app)
//       .post(`/api/blogs/${createdBlogId}/comments`)
//      .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2Y2RhYTVjZjdjNWUzZGRlMmE3MzE5MCIsImlhdCI6MTcyNDc2NjA3OSwiZXhwIjoxNzI0Nzg0MDc5fQ.H0Ws9wuYM6dSYifU9_JD53-aGml8unVVugorWjJALpA`) // Include authentication header if needed
//       .send({ content: 'Test comment' })
    
//       .expect(201);

//     expect(res.body).toHaveProperty('content', 'Test comment');
//     expect(res.body).toHaveProperty('postId', createdBlogId.toString());
//   });
  it('should like a blog post', async () => {
    const res = await request(app)
      .post(`/api/blogs/${createdBlogId}/like`)
      .set('Authorization',`Bearer ${token}`) 
      .expect(201);

    expect(res.body).toHaveProperty('message', 'Like added');
  });

  it('should count likes for a blog post', async () => {
    const res = await request(app)
      .get(`/api/blogs/${createdBlogId}/likes`)
      .set('Authorization', `Bearer ${token}`) 
      .expect(200);

    expect(res.body).toHaveProperty('likeCount');
  });

  it('should get all likes and users for a blog post', async () => {
    const res = await request(app)
      .get(`/api/blogs/${createdBlogId}/likeusers`)
      .set('Authorization', `Bearer ${token}`) 
      .expect(200);

    expect(res.body).toHaveProperty('likes');
    expect(Array.isArray(res.body.likes)).toBeTruthy();
  });

//   it('should get comments for a blog post', async () => {
//     const res = await request(app)
//       .get(`/api/blogs/${createdBlogId}/comments`)
//       .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2Y2RhYTVjZjdjNWUzZGRlMmE3MzE5MCIsImlhdCI6MTcyNDc2MzYyNSwiZXhwIjoxNzI0NzgxNjI1fQ.zLC3hkqzo0RUu28NcakWrWDNULixoXW_-iSkZ2O0mho`) 
//       .expect(200);

//     expect(Array.isArray(res.body)).toBeTruthy();
//   });
 });