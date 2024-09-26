import {PrismaClientKnownRequestError} from '@prisma/client/runtime/library';
import prisma from '../db';
import {comparePasswords, createJWT, hashPassword} from '../modules/auth';

export const createNewUser = async (req, res, next) => {
  try {
    const hash = await hashPassword(req.body.password);

    const user = await prisma.user.create({
      data: {
        username: req.body.username,
        password: hash,
      },
    });

    const token = createJWT(user);
    res.json({token});
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      res.status(409).json({
        error: 'Username already exists. Please choose a different username.',
      });
    } else {
      error.type = 'input';
      next(error);
    }
  }
};

export const signin = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: {username: req.body.username},
  });

  const isValid = await comparePasswords(req.body.password, user?.password);

  if (!isValid) {
    res.status(401);
    res.send('Invalid username or password');
    return;
  }

  const token = createJWT(user);
  res.json({token});
};
