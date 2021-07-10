const fs = require('fs')

const sharp = require("sharp");

const express = require("express");
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 8070;

let recognitionTimeout: any;

// Middlewares
app.use(
  fileUpload({
    createParentPath: true,
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("uploads"));

// define a route handler for the default home page
app.get("/", (req: any, res: any) => {
  res.send("Hello world!");
});

app.post("/sanitize", async (req: any, res: any) => {

  try {
    if (!req.files) {
      res.send({
        status: false,
        message: "No file uploaded",
      });
    } else {
      let receiptFile = req.files.receipt;

      //Use the mv() method to place the file in upload directory (i.e. "uploads")
      const receiptPath = "./uploads/" + receiptFile.name;
      receiptFile.mv(receiptPath);
      
      const pngFilePath = receiptPath.replace("jpg", "png");
      const filePath = pngFilePath;
      
      await sharp(receiptPath).rotate().toFile(filePath);

      res.sendFile(filePath)
    }
  }
})
