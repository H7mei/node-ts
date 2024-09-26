import prisma from '../db';

export const getAllProducts = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: {id: req.user.id},
    include: {products: true},
  });

  if (!user) {
    res.status(404).json({error: 'User not found'});
    return;
  }

  res.json({data: user.products});
};

export const getOneProduct = async (req, res) => {
  const {id} = req.params;
  const product = await prisma.product.findFirst({
    where: {id, belongsToId: req.user.id},
  });

  if (!product) {
    res.status(404).json({error: 'Product not found'});
    return;
  }

  res.json({data: product});
};

export const createProduct = async (req, res, next) => {
  try {
    const {name} = req.body;
    const product = await prisma.product.create({
      data: {
        name,
        belongsToId: req.user.id,
      },
    });

    res.json({data: product});
  } catch (error) {
    error.type = 'input';
    next(error);
  }
};

export const updateProduct = async (req, res) => {
  const {id} = req.params;
  const {name} = req.body;
  const product = await prisma.product.update({
    where: {
      id_belongsToId: {id, belongsToId: req.user.id},
    },
    data: {name},
  });

  res.json({data: product});
};

export const deleteProduct = async (req, res) => {
  const {id} = req.params;
  const product = await prisma.product.delete({
    where: {
      id_belongsToId: {id, belongsToId: req.user.id},
    },
  });

  res.json({data: product});
};
