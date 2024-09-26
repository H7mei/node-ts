import prisma from '../db';

export const getAllUpdatesPoints = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: {
      id: req.user.id,
    },
    include: {
      updates: true,
    },
  });

  if (!user) {
    res.status(404).json({
      error: 'User not found',
    });
    return;
  }

  const updatePoints = await prisma.updatePoint.findMany({
    where: {
      updateId: {
        in: user.updates.map((update) => update.id),
      },
    },
  });

  res.json({
    data: updatePoints,
  });
};

export const getOneUpdatePoint = async (req, res) => {
  const {id} = req.params;
  const updatePoint = await prisma.updatePoint.findFirst({
    where: {
      id,
      update: {
        userId: req.user.id,
      },
    },
  });

  if (!updatePoint) {
    res.status(404).json({
      error: 'Update point not found',
    });
    return;
  }

  res.json({
    data: updatePoint,
  });
};

export const createUpdatePoint = async (req, res, next) => {
  const {name, description, updateId} = req.body;
  try {
    const updatePoint = await prisma.updatePoint.create({
      data: {
        name,
        description,
        update: {connect: {id: updateId}},
      },
    });

    res.json({
      data: updatePoint,
    });
  } catch (error) {
    error.type = 'input';
    next(error);
  }
};

export const updateUpdatePoint = async (req, res) => {
  const {name, description, updateId} = req.body;
  const updatePoint = await prisma.updatePoint.update({
    where: {
      id: req.params.id,
    },
    data: {
      name,
      description,
      update: {connect: {id: updateId}},
    },
  });

  res.json({
    data: updatePoint,
  });
};

export const deleteUpdatePoint = async (req, res) => {
  const {id} = req.params;
  const updatePoint = await prisma.updatePoint.delete({
    where: {
      id,
    },
  });

  res.json({
    data: updatePoint,
  });
};
