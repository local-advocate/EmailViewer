const supertest = require('supertest');
const http = require('http');

const db = require('./db');
const app = require('../app');

let server;

beforeAll(() => {
  server = http.createServer(app);
  server.listen();
  request = supertest(server);
  return db.reset();
});

afterAll((done) => {
  server.close(done);
});

test('Unauthorized', async () => {
  await request.get('/v0/mail/')
    .expect(401);
});

const user = {'email': 'anna@books.com', 'password': 'annaadmin'};

test('Authorized', async () => {
  await request.get('/v0/mail/').expect(401);
  const res = await request.post('/v0/login/').send(user).expect(200);
  await request.get('/v0/mail/')
    .set('Authorization', 'Bearer ' + res.body.accessToken).expect(200);
});
