// require('dotenv').config();
// const cloudinary = require('cloudinary').v2;
// const fs = require('fs');
// const Submission = require('../models/Submission');

// // Cloudinary configuration
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// exports.createSubmission = async (req, res) => {
//   try {
//     const { name, socialHandle, images } = req.body;

//     // Ensure that 'images' is an array of image file paths (local paths)
//     if (!Array.isArray(images) || images.length === 0) {
//       return res.status(400).json({ message: 'No images provided' });
//     }

//     const uploadedImages = [];

//     // Loop through each image file path
//     for (let imagePath of images) {
//       // Read the image file and convert it to base64
//       const imageBase64 = await convertImageToBase64(imagePath);

//       // Upload the base64 image to Cloudinary
//       const uploadResult = await cloudinary.uploader.upload(`data:image/jpeg;base64,${imageBase64}`, {
//         folder: 'uploads',
//       });
      
//       // Store the secure URL from Cloudinary
//       uploadedImages.push(uploadResult.secure_url);
//     }

//     // Save the submission to the database
//     const newSubmission = new Submission({
//       name,
//       socialHandle,
//       images: uploadedImages,
//     });
//     await newSubmission.save();

//     res.status(201).json({ message: 'Submission created', submission: newSubmission });
//   } catch (error) {
//     console.error('Cloudinary Error:', error);
//     res.status(500).json({ message: 'Error uploading images', error });
//   }
// };

// // Helper function to convert image to base64
// const convertImageToBase64 = (imagePath) => {
//   return new Promise((resolve, reject) => {
//     fs.readFile(imagePath, (err, data) => {
//       if (err) {
//         reject('Error reading the file');
//         return;
//       }

//       // Convert the image data to base64
//       const base64Image = Buffer.from(data).toString('base64');
//       resolve(base64Image);
//     });
//   });
// };

require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const Submission = require('../models/Submission');
const fs = require('fs');

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper function to upload base64 images to Cloudinary
const uploadBase64ToCloudinary = async (base64Image) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(base64Image, {
      folder: 'uploads',
    }, (error, result) => {
      if (error) {
        reject(error);  // Handle errors from Cloudinary
      } else {
        resolve(result.secure_url);  // Resolve the secure URL of the uploaded image
      }
    });
  });
};

// Create a submission
exports.createSubmission = async (req, res) => {
  try {
    const { name, socialHandle, images } = req.body;

    // Ensure that the images field is an array
    if (!Array.isArray(images)) {
      return res.status(400).json({ message: 'Images must be an array' });
    }

    // Upload each base64 image to Cloudinary
    const uploadedImages = [];
    for (let base64Image of images) {
      const uploadedImageUrl = await uploadBase64ToCloudinary(base64Image);
      uploadedImages.push(uploadedImageUrl);  // Store the Cloudinary URLs
    }

    // Create a new submission with the uploaded image URLs
    const newSubmission = new Submission({
      name,
      socialHandle,
      images: uploadedImages,  // Store Cloudinary URLs in the DB
    });
    await newSubmission.save();

    res.status(201).json({ message: 'Submission created', submission: newSubmission });
  } catch (error) {
    console.error('Cloudinary Error:', error);
    res.status(500).json({ message: 'Error creating submission', error });
  }
};



exports.getSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find();  // Fetch all submissions from the DB
    res.status(200).json(submissions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching submissions', error });
  }
};