const express = require('express');
const Generators = require('../utils/Generators');

const Category = require('../models/Category');
const Server = require('../models/Server');

const router = express.Router();

router.get('/:id', async (request, response, next) => {
  const category = await Category.findOne({ id: request.params.id });
  if (!category) return next(new Error('Category not found'));

  return response.status(200).json({
    id: category.id,
    name: category.name,
    server: category.server,
  });
});

router.post('/create', async (request, response, next) => {
  const { name, server } = request.body;

  if (!name || !server) return next(new Error('You must provide a name for the category'));

  const categoryServer = await Server.findOne({ id: server });

  if (!categoryServer) return next(new Error('Server does not exist'));

  if (request.user.id.toString() !== categoryServer.owner.toString()) return next(new Error('You are not the owner of the server'));

  const createdCategory = await Category.create({ id: Generators.generateId(), name, server });

  return response
    .status(200)
    .json({ success: true, id: createdCategory.id, message: 'Successfully created a category' });
});

module.exports = router;
