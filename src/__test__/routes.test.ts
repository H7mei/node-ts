// integration test

import app from '../server';
import request from 'supertest';

describe('POST /user', function () {
  it('responds with json', async () => {
    // random username
    const random = Math.random().toString(36).substring(7);
    const res = await request(app)
      .post('/user')
      .send({username: random, password: 'hola'})
      .set('Accept', 'application/json');
    expect(res.status).toEqual(200);
  });
});
