// unit test

import * as user from '../user';

describe('user handler', () => {
  it('should do a thing', async () => {
    const random = Math.random().toString(36).substring(7);
    const req = {body: {username: random, password: 'test'}};
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    await user.createNewUser(req, res, jest.fn());
  });
});
