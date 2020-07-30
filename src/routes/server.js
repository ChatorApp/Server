const { v1: uuidv1 } = require('uuid');
const express = require('express');
const multer = require('multer');
const S3Utils = require('../utils/S3Utils');

const Generators = require('../utils/Generators');

const Channel = require('../models/Channel');
const Category = require('../models/Category');
const Server = require('../models/Server');
const Upload = require('../models/Upload');

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.get('/me', async (request, response) => {
  const servers = await Server.find({ owner: request.user.id });
  return response
    .status(200)
    .json(servers.map((x) => ({ id: x.id, icon: x.iconUrl, name: x.name })));
});

router.get('/:id', async (request, response) => {
  const { id } = request.params;
  const server = await Server.findOne({ id });
  const categories = await Category.find({ server: id });
  const channels = await Channel.find({ server: id });
  return response.status(200).json({
    name: server.name,
    id,
    iconUrl: server.iconUrl,
    categories: categories.map((category) => ({
      id: category.id,
      name: category.name,
      channels: channels
        .filter((channel) => channel.category.toString() === category.id.toString())
        .map((channel) => ({
          id: channel.id,
          name: channel.name,
          description: channel.description,
        })),
    })),
  });
});

router.post('/create', upload.single('upload'), async (request, response) => {
  const { name, description } = request.body;
  const { file } = request;

  if (!name || !description || !file) {
    return response
      .status(400)
      .json({ error: 'To create a server you must provide a name, a description and an icon' });
  }

  const id = uuidv1();
  const fileName = `${id}.${file.originalname.split('.')[1]}`;

  try {
    S3Utils.put({
      Body: file.buffer,
      Bucket: 'chator-cdn',
      Key: fileName,
      ACL: 'public-read',
      ContentType: file.mimetype,
    });
    await Upload.create({ id, author: request.user.id });
  } catch (e) {
    return response
      .status(400)
      .json({ error: 'There was an issue whilst uploading the Icon URL to the CDN' });
  }

  Server.create(
    {
      id: Generators.generateId(),
      name,
      description,
      iconUrl: `https://cdn.chator.app/${fileName}`,
      owner: request.user.id,
    },
    (error, server) => {
      if (error) {
        console.log(error);
        return response
          .status(400)
          .json({ error: 'There was a problem whilst creating your server' });
      }

      return response.status(200).json({
        message: `Successfully create a server with the name '${server.name}'`,
        id: server.id,
      });
    },
  );

  return response.status(400).json({ error: 'Error whilst creating a server' });
});

router.put('/update', async (request, response) => {
  const {
    id, name, description, iconUrl, privacy,
  } = request.body;

  if (!id) return response.status(400).json({ error: 'Server Id has not been provided' });

  const server = await Server.findOne({ id });

  if (!server) return response.status(400).json({ error: 'Server Id not found' });

  if (server.owner !== request.user.id) {
    return response.status(403).json({
      error:
        'You must be the owner of the server to update the name, description, icon URL or privacy',
    });
  }

  if (name) server.name = name;
  if (description) server.description = description;
  if (iconUrl) server.iconUrl = iconUrl;
  if (privacy !== null || privacy !== undefined) server.privacy = privacy;

  await server.save();

  return response.status(200).json({ message: 'Successfully updated the server' });
});

router.delete('/delete', async (request, response) => {
  const { id } = request.body;

  if (!id) return response.status(400).json({ error: 'No Server Id was provided' });

  const server = await Server.findOne({ id });

  if (!server) return response.status(400).json({ error: 'Server could not be found' });

  if (server.owner !== request.user.id) return response.status(403).json({ error: 'Only the owner of a server can delete a server' });

  await server.delete();

  return response
    .status(200)
    .json({ message: `Successfully deleted the server with the Id '${id}'` });
});

module.exports = router;
