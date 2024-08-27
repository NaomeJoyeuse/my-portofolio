const request = require('supertest');
const app = require('../index');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

describe('Blog API', () => {
  let mongoServer;
  let createdBlogId;


  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUri);
    }
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
      .post('/api/blogs') // Note the '/api' prefix
      .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2Y2RhYTVjZjdjNWUzZGRlMmE3MzE5MCIsImlhdCI6MTcyNDc2NjA3OSwiZXhwIjoxNzI0Nzg0MDc5fQ.H0Ws9wuYM6dSYifU9_JD53-aGml8unVVugorWjJALpA`) // Incl
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
      .post('/api/blogs') // Note the '/api' prefix
      .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2Y2RhYTVjZjdjNWUzZGRlMmE3MzE5MCIsImlhdCI6MTcyNDc2NjA3OSwiZXhwIjoxNzI0Nzg0MDc5fQ.H0Ws9wuYM6dSYifU9_JD53-aGml8unVVugorWjJALpA`) // Incl
      .send({}) // Send invalid data
      .expect(400);

    expect(res.body).toHaveProperty('error');
  });


  it('should get all blog posts', async () => {
    const res = await request(app)
      .get('/api/blogs')
      .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2Y2RhYTVjZjdjNWUzZGRlMmE3MzE5MCIsImlhdCI6MTcyNDc2NjA3OSwiZXhwIjoxNzI0Nzg0MDc5fQ.H0Ws9wuYM6dSYifU9_JD53-aGml8unVVugorWjJALpA`) // Incl
      .expect(200);

    expect(Array.isArray(res.body)).toBeTruthy();
  });

  it('should get a blog post by id', async () => {
    const res = await request(app)
      .get(`/api/blogs/${createdBlogId}`)
      .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2Y2RhYTVjZjdjNWUzZGRlMmE3MzE5MCIsImlhdCI6MTcyNDc2NjA3OSwiZXhwIjoxNzI0Nzg0MDc5fQ.H0Ws9wuYM6dSYifU9_JD53-aGml8unVVugorWjJALpA`) // Incl
      .expect(200);

    expect(res.body).toHaveProperty('title', 'Test Blog');
  });

  it('should update a blog post', async () => {
    const res = await request(app)
      .patch(`/api/blogs/${createdBlogId}`)
      .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2Y2RhYTVjZjdjNWUzZGRlMmE3MzE5MCIsImlhdCI6MTcyNDc2NjA3OSwiZXhwIjoxNzI0Nzg0MDc5fQ.H0Ws9wuYM6dSYifU9_JD53-aGml8unVVugorWjJALpA`) // Incl
      .send({ title: 'Updated Test Blog' })
      .expect(200);

    expect(res.body).toHaveProperty('title', 'Updated Test Blog');
  });

  it('should delete a blog post', async () => {
    await request(app)
      .delete(`/api/blogs/${createdBlogId}`)
      .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2Y2RhYTVjZjdjNWUzZGRlMmE3MzE5MCIsImlhdCI6MTcyNDc2NjA3OSwiZXhwIjoxNzI0Nzg0MDc5fQ.H0Ws9wuYM6dSYifU9_JD53-aGml8unVVugorWjJALpA`) // Incl
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
      .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2Y2RhYTVjZjdjNWUzZGRlMmE3MzE5MCIsImlhdCI6MTcyNDc2MzYyNSwiZXhwIjoxNzI0NzgxNjI1fQ.zLC3hkqzo0RUu28NcakWrWDNULixoXW_-iSkZ2O0mho`) 
      .expect(201);

    expect(res.body).toHaveProperty('message', 'Like added');
  });

  it('should count likes for a blog post', async () => {
    const res = await request(app)
      .get(`/api/blogs/${createdBlogId}/likes`)
      .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2Y2RhYTVjZjdjNWUzZGRlMmE3MzE5MCIsImlhdCI6MTcyNDc2MzYyNSwiZXhwIjoxNzI0NzgxNjI1fQ.zLC3hkqzo0RUu28NcakWrWDNULixoXW_-iSkZ2O0mho`) 
      .expect(200);

    expect(res.body).toHaveProperty('likeCount');
  });

  it('should get all likes and users for a blog post', async () => {
    const res = await request(app)
      .get(`/api/blogs/${createdBlogId}/likeusers`)
      .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2Y2RhYTVjZjdjNWUzZGRlMmE3MzE5MCIsImlhdCI6MTcyNDc2MzYyNSwiZXhwIjoxNzI0NzgxNjI1fQ.zLC3hkqzo0RUu28NcakWrWDNULixoXW_-iSkZ2O0mho`) 
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
