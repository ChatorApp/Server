'use strict';

const S3Utils = require('../utils/S3Utils');

const Upload = require('../models/Upload');

const express = require('express');
const multer = require('multer');
const { v1: uuidv1 } = require('uuid');
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', upload.single('upload'), async (request, response) => {

    const uploader = request.user.id;
    const file = request.file;
    if (!file)
        return response.status(400).json({ error: 'You must attach a file' });

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
        await Upload.create({ id: id, author: uploader });
        return response.status(200).json({ message: 'Successfully uploaded file to the CDN', url: `https://chator-cdn.ams3.digitaloceanspaces.com/${fileName}` });
    } catch (e) {
        return response.status(400).json({ error: 'There was an issue whilst uploading this image to the CDN' });
    }
});

module.exports = router;