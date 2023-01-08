/* eslint-disable operator-linebreak */
const express = require('express');
const multer = require('multer');
const path = require('path');

// File upload folder
// const uploadFolder = require('./uploads');

// define the storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        const fileExt = path.extname(file.originalname);
        const fileName = `${file.originalname
            .replace(fileExt, '')
            .toLowerCase()
            .split(' ')
            .join('_')}_${Date.now()}`;
        cb(null, fileName + fileExt);
    },
});

const upload = multer({
    storage,
    limits: {
        fileSize: 1000000, // 1MB
    },
    fileFilter: (req, file, cb) => {
        if (file.fieldname === 'avatar') {
            if (
                file.mimetype === 'image/png' ||
                file.mimetype === 'image/jpg' ||
                file.mimetype === 'image/jpeg'
            ) {
                cb(null, true);
            } else {
                cb(new Error('only .jpg, .png, .jpeg format allowed!'));
            }
        } else if (file.fieldname === 'doc') {
            if (file.mimetype === 'application/pdf') {
                cb(null, true);
            } else {
                cb(new Error('only .pdf format allowed!'));
            }
        } else {
            cb(new Error('There was an unknown error'));
        }
    },
});

const app = express();

// application route
app.post(
    '/',
    upload.fields([
        { name: 'avatar', maxCount: 1 },
        { name: 'doc', maxCount: 1 },
    ]),
    (req, res) => {
        res.send('hello world');
    }
);

// default error handler
app.use((err, req, res, next) => {
    if (err) {
        if (err instanceof multer.MulterError) {
            res.status(500).send('There was an upload error');
        } else {
            res.status(500).send(err.message);
        }
    } else {
        res.send('Success');
    }
});

app.listen(3000, () => {
    console.log('server runing 3000');
});
