const express = require('express');
const Channel = require('../models/Channel');
const Server = require('../models/Server');

const Generators = require('../utils/Generators');

const router = express.Router();

router.get('/:id', async (request, response, next) => {
  const channel = await Channel.findOne({ id: request.params.id });
  if (!channel) return next(new Error('Channel not found'));

  return response.status(200).json({
    id: channel.id,
    name: channel.name,
    description: channel.description,
    server: channel.server,
  });
});

router.post('/create', async (request, response, next) => {
  const {
    name, category, description, server,
  } = request.body;

  if (!name || !category || !description || !server) {
    return next(new Error('You must provide a name, category & description for the channel'));
  }

  const channelServer = await Server.findOne({ id: server });

  if (!channelServer) return next(new Error('Server does not exist'));

  if (request.user.id.toString() !== channelServer.owner.toString()) return next(new Error('You are not the owner of the server'));

  const createdChannel = await Channel.create({
    id: Generators.generateId(),
    name,
    category,
    description,
    server,
  });

  return response
    .status(200)
    .json({ success: true, id: createdChannel.id, message: 'Successfully created a channel' });
});

module.exports = router;
