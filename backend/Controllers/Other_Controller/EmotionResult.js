const axios = require("axios");
const { RekognitionClient, DetectFacesCommand } = require("@aws-sdk/client-rekognition");
const fs = require("fs");
require('dotenv').config();

const accessKeyId = process.env.accessKeyId;
const secretAccessKey = process.env.secretAccessKey;
const region = process.env.region;

// Create an instance of the Rekognition client
const rekognitionClient = new RekognitionClient({
  region: region,
  credentials: {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
  },
});

// Function to detect faces in an image
async function Emotion_Detection_Function(req, res, next) {
  const imageUrl = req.body.imageUrl;
  // console.log(imageUrl)

  try {
    // Fetch the image using Axios
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
    
    // Save the image buffer to a local file
    fs.writeFileSync("temp_image.jpg", response.data);

    // Read the local image file
    const imageBytes = fs.readFileSync("temp_image.jpg");

    // Create parameters for the DetectFaces API
    const params = {
      Image: {
        Bytes: imageBytes,
      },
      "Attributes": [
        "ALL"
      ]
    };

    // Call the DetectFaces API using AWS SDK v3
    const command = new DetectFacesCommand(params);
    const data = await rekognitionClient.send(command);

    // Cleanup: Delete the temporary image file
    fs.unlinkSync("temp_image.jpg");

    res.json({ result: data.FaceDetails });
  } catch (error) {
    // Cleanup: Delete the temporary image file if it exists
    if (fs.existsSync("temp_image.jpg")) {
      fs.unlinkSync("temp_image.jpg");
    }
    
    console.error('Error in emotion detection:', error);
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  Emotion_Detection_Function,
};
