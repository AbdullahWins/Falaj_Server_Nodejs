// file uploader
const { firebaseStorage } = require("../../config/firebase/firebase.config");
const { generateUniqueFilename } = require("./generateUniqueFilename");

const uploadFile = (file, folderName) => {
  return new Promise((resolve, reject) => {
    const bucketName = process.env.FIRE_firebaseStorage_BUCKET_NAME;
    const bucket = firebaseStorage.bucket(bucketName);
    const uniqueFilename = generateUniqueFilename(file.originalname);
    const options = {
      destination: `${folderName}/${uniqueFilename}`,
      public: true,
    };
    bucket.upload(file.path, options, (err, uploadedFile) => {
      if (err) {
        reject(err);
      } else {
        const fileUrl = uploadedFile.publicUrl();
        resolve(fileUrl);
      }
    });
  });
};

const uploadCategories = (file, folderName) => {
  return new Promise((resolve, reject) => {
    const bucketName = process.env.FIRE_firebaseStorage_BUCKET_NAME;
    const bucket = firebaseStorage.bucket(bucketName);
    const uniqueFilename = generateUniqueFilename(file.originalname);
    const options = {
      destination: `${folderName}/${uniqueFilename}`,
      public: true,
    };
    bucket.upload(file.path, options, (err, uploadedFile) => {
      if (err) {
        reject(err);
      } else {
        const fileUrl = uploadedFile.publicUrl();
        resolve(fileUrl);
      }
    });
  });
};

module.exports = {
  uploadFile,
  uploadCategories,
};
