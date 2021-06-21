const express = require('express');
const app = express();
const path = require('path');

app.get('/images', (req, res) => {
    res.sendFile(path.join(__dirname, `../uploads/${req.query.userName}/${req.query.imageId}.png`));
});

module.exports = app;