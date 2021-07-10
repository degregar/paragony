const appVersion = "0.1.0"

import { recognize, saveRecognizedTextToFile, transformFile } from './mlUtils';

const fs = require('fs')
const path = require('path')
const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');

const runExpressApp = () => {
  const app = express();
  const port = process.env.PORT || 8080;

  // Middlewares
  app.use(
    fileUpload({
      createParentPath: true,
    })
  );
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.static('uploads'));

  // define a route handler for the default home page
  app.get('/', (req: any, res: any) => {
    res.send('Hello world!');
  });


  app.get("/mobile", (req: any, res: any) => {
    const fileName = path.resolve('../mobile/build/app/outputs/flutter-apk/app-release.apk')
    res.sendFile(fileName)
  })

  app.get("/desktop", (req: any, res: any) => {
    const fileName = path.resolve('')
    
  })

  app.post('/', async (req: any, res: any) => {
    try {
      if (!req.files) {
        res.send({
          status: false,
          message: 'No file uploaded',
        });
      } else {
        const receiptPath = await transformFile(req.files.receipt);

        res.send({
          status: 200,
          data: {
            filePath: receiptPath,
          },
        });

        const recognizedText = await recognize(receiptPath);

        // TODO: Save recognition results
        await saveRecognizedTextToFile(recognizedText, receiptPath);
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
};

export default runExpressApp;
