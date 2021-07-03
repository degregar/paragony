const { createWorker } = require("tesseract.js");
const sharp = require("sharp");

const express = require("express");
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 8080;

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
  console.log(req);
  console.log(res);
});

const RECOGNITION_TIMEOUT = 30000;
app.post("/", (req: any, res: any) => {
  try {
    if (!req.files) {
      res.send({
        status: false,
        message: "No file uploaded",
      });
    } else {
      //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
      let receiptFile = req.files.receipt;

      //Use the mv() method to place the file in upload directory (i.e. "uploads")
      const receiptPath = "./uploads/" + receiptFile.name;
      receiptFile.mv(receiptPath);

      recognitionTimeout = setTimeout(() => {
        res.send({
          status: 504,
          message: "Could not recognize the file or something else went wrong",
        });
      }, RECOGNITION_TIMEOUT);

      recognize(receiptPath, res);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

// start the Express server
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});

function recognize(imagePath: string, res: any) {
  const worker = createWorker({
    logger: (m: any) => console.log(m),
  });

  (async () => {
    await worker.load();
    await worker.loadLanguage("pol");
    await worker.initialize("pol");

    console.log("imagePath", imagePath);
    const pngFilePath = imagePath.replace("jpg", "png");
    const filePath = pngFilePath;
    console.log("pngFilePath", pngFilePath);
    console.log("filePath", filePath);

    await sharp(imagePath).rotate().toFile(filePath);

    // console.log("image", await sharp(imagePath).metadata());

    const response: any = await worker.recognize(
      //   image
      //   "http://localhost:8080/eng-example.jpg"
      //   "./uploads/output.png"
      filePath
    );

    const text = response.data.text;

    console.log("text", text);

    await worker.terminate();

    clearTimeout(recognitionTimeout);

    res.send({
      status: true,
      message: "File loaded and readed",
      data: {
        text: text,
        filePath: pngFilePath,
      },
    });
  })();
}

// recognize("http://localhost:8080/eng-example2.jpg");
// recognize("./uploads/eng-example2.jpg");
