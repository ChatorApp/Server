'use strict';

const Channel = require('../models/Channel');
const Server = require('../models/Server');

const Generators = require('../utils/Generators');

const express = require('express');
const router = express.Router();

router.get('/:id', async (request, response) => {
    const channel = await Channel.findOne({ id: request.params.id });
    return response.status(200).json({
        id: channel.id,
        name: channel.name,
        description: channel.description,
        server: channel.server,
    });
});

router.post('/create', async (request, response) => {
    const { name, category, description, server } = request.body;

    if (!name || !category || !description || !server)
        return response.status(400).json({ error: 'You must provide a name, category & description for the channel' });

    const channelServer = await Server.findOne({ id: server });

    if (!channelServer)
        return response.status(400).json({ erorr: 'Server does not exist' });

    if (request.user.id.toString() !== channelServer.owner.toString())
        return response.status(400).json({ error: 'You are not the owner of the server' });

    const createdChannel = await Channel.create({ id: Generators.generateId(), name, category, description, server });

    return response.status(200).json({ success: true, id: createdChannel.id, message: 'Successfully created a channel' });
});

module.exports = router;