import prisma from '../db';

export const getAllUpdates = async (req, res) => {
  const products = await prisma.product.findMany({
    where: {belongsToId: req.user.id},
    include: {updates: true},
  });

  /* 
  
  for large datasets is not optimal
  is better to optimize the query to the database
  */
  const updates = products.reduce((acc, product) => {
    return acc.concat(product.updates);
  }, []);

  res.json({data: updates});
};

export const getOneUpdate = async (req, res) => {
  const {id} = req.params;
  const update = await prisma.update.findUnique({
    where: {id, userId: req.user.id},
  });

  if (!update) {
    res.status(404).json({error: 'Update not found'});
    return;
  }

  res.json({data: update});
};

export const createUpdate = async (req, res) => {
  const {title, body, productId} = req.body;

  const product = await prisma.product.findUnique({
    where: {id: productId},
  });

  if (!product) {
    res.status(404).json({error: 'Product not found'});
    return;
  }

  const update = await prisma.update.create({
    data: {
      title,
      body,
      product: {connect: {id: productId}},
    },
  });

  res.json({data: update});
};

export const updateUpdate = async (req, res) => {
  const {title, body, status, version, asset, productId} = req.body;
  const products = await prisma.product.findMany({
    where: {belongsToId: req.user.id},
    include: {updates: true},
  });

  const updates = products.reduce((acc, product) => {
    return acc.concat(product.updates);
  }, []);

  const match = updates.find((update) => update.id === req.params.id);

  if (!match) {
    res.status(404).json({error: 'Update not found'});
    return;
  }

  const update = await prisma.update.update({
    where: {id: req.params.id},
    data: {
      title,
      body,
      status,
      version,
      asset,
      product: {connect: {id: productId}},
    },
  });

  res.json({data: update});
};

export const deleteUpdate = async (req, res) => {
  const products = await prisma.product.findMany({
    where: {belongsToId: req.user.id},
    include: {updates: true},
  });

  const updates = products.reduce((acc, product) => {
    return acc.concat(product.updates);
  }, []);

  const match = updates.find((update) => update.id === req.params.id);

  if (!match) {
    res.status(404).json({error: 'Update not found'});
    return;
  }

  const deleted = await prisma.update.delete({
    where: {id: req.params.id},
  });

  res.json({data: deleted});
};
