'use strict';

const Generators = require('../utils/Generators');

const Server = require('../models/Server');

const express = require('express');
const router = express.Router();

router.get('/me', async (request, response) => {
    const servers = await Server.find({ owner: request.user.id });
    return response.status(200).json(servers.map(x => ({ id: x.id, icon: x.iconUrl, name: x.name})));
});

router.post('/create', async (request, response) => {
    const { name, description, iconUrl } = request.body;

    if (!name || !description || !iconUrl)
        return response.status(400).json({ error: 'To create a server you must provide a name, a description and an icon' });

    Server.create({
        id: Generators.generateId(),
        name,
        description,
        iconUrl,
        owner: request.user.id,
    }, (error, server) => {
        if (error) {
            console.log(error);
            return response.status(400).json({ error: 'There was a problem whilst creating your server' });
        }

        return response.status(200).json({
            message: `Successfully create a server with the name '${server.name}'`,
            id: server.id,
        });
    });
});


router.put('/update', async (request, response) => {
    const { id, name, description, iconUrl, privacy } = request.body;

    if (!id)
        return response.status(400).json({ error: 'Server Id has not been provided' });

    const server = await Server.findOne({ id });

    if (!server)
        return response.status(400).json({ error: 'Server Id not found' });

    if (server.owner !== request.user.id)
        return response.status(403).json({ error: 'You must be the owner of the server to update the name, description, icon URL or privacy' });

    if (name) server.name = name;
    if (description) server.description = description;
    if (iconUrl) server.iconUrl = iconUrl;
    if (privacy !== null || privacy !== undefined) server.privacy = privacy;

    await server.save();

    return response.status(200).json({ message: 'Successfully updated the server' });
});

router.delete('/delete', async (request, response) => {
    const { id } = request.body;

    if (!id)
        return response.status(400).json({ error: 'No Server Id was provided' });

    const server = await Server.findOne({ id });

    if (!server)
        return response.status(400).json({ error: 'Server could not be found' });

    if (server.owner !== request.user.id)
        return response.status(403).json({ error: 'Only the owner of a server can delete a server' });

    await server.delete();

    return response.status(200).json({ message: `Successfully deleted the server with the Id '${id}'` });
});

module.exports = router;