const multer = require('multer');
const path = require("path");
const fs = require("fs");
const express = require('express');
const app = express();

const upload = multer({
    dest: "/uploads/temp"
});

app.post("/upload",
    upload.single("file" /* name attribute of <file> element in your form */),
    (req, res) => {
      const tempPath = req.file.path;
      const dir = `./uploads/${req.headers.username}`;

      if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
      }

      const targetPath = path.join(__dirname, `../uploads/${req.headers.username}/${req.file.filename}.png`);
  
      if (path.extname(req.file.originalname).toLowerCase() === ".png") {
        fs.rename(tempPath, targetPath, err => {
          if (err) {
            res
              .status(403)
              .json(err);
          }
          res
            .status(200)
            .json({'newFile': `http://localhost:5000/images?userName=${req.headers.username}&imageId=${req.file.filename}`});
        }); 
      } else {
        fs.unlink(tempPath, err => {
          if (err) {
            res
              .status(403)
              .json(err);
          };
          res
            .status(403)
            .json({'error': 'File Must Be a .png'})
        });
      }
    }
);

module.exports = app;