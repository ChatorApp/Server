'use strict';

const Generators = require('../utils/Generators');

const Category = require('../models/Server');
const Server = require('../models/Server');

const express = require('express');
const router = express.Router();


router.get('/:id', async (request, response) => {
    const category = await Category.findOne({ id: request.params.id });
    return response.status(200).json({
        id: category.id,
        name: category.name,
        server: category.server,
    });
});

router.post('/create', async (request, response) => {
    const { name, server } = request.body;

    if (!name || !description || !server)
        return response.status(400).json({ error: 'You must provide a name for the category' });

    const categoryServer = await Server.findOne({ id: server });

    if (!categoryServer)
        return response.status(400).json({ erorr: 'Server does not exist' });

    if (!request.user.id !== categoryServer.owner)
        return response.status(400).json({ error: 'You are not the owner of the server' });

    const createdCategory = await Category.create({ id: Generators.generateId(), name, server });

    return response.status(200).json({ success: true, id: createdCategory.id, message: 'Successfully created a category' });
});

router.get('/for/:id', async (request, response) => {
    const server = request.params.id;

    const categories = await Category.find({ server: server });

    return response.status(200).json(categories.map(x => ({ id: x.id, name: x.name })));
});

module.exports = router;