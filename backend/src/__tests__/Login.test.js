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

test('GET Invalid URL', async () => {
  await request.get('/v0/so-not-a-real-end-point-ba-bip-de-doo-da/')
    .expect(404);
});

const us = {'email': 'aa@aa.com', 'password': 'passwd'};

test('Invalid Login', async () => {
  await request.post('/v0/login/').send(us).expect(401);
  await request.get('/v0/mail/').expect(401);
  await request.get('/v0/mail/')
    .set('Authorization', 'Bearer ' + ' ').expect(403);
  await request.get('/v0/mail/').expect(401);
});

const user = {'email': 'anna@books.com', 'password': 'annaadmin'};

test('Valid Login', async () => {
  const res = await request.post('/v0/login/').send(user).expect(200);
  expect(res).toBeDefined();
  expect(res.body).toBeDefined();
  expect(res.body.name).toBeDefined();
  expect(res.body.accessToken).toBeDefined();
  expect(res.body.name).toEqual('annaadmin');
  await request.get('/v0/mail/')
    .set('Authorization', 'Bearer ' + res.body.accessToken).expect(200);
});
