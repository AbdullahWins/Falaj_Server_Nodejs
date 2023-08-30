// file uploader
const { firebaseStorage } = require("../../config/firebase/firebase.config");
const { UniqueNaam } = require("uniquenaam");

const uploadFile = async (file, folderName) => {
  const bucketName = process.env.FIRE_STORAGE_BUCKET_NAME;
  const bucket = firebaseStorage.bucket(bucketName);
  const uniqueFilename = UniqueNaam(file.originalname);
  const options = {
    destination: `${folderName}/${uniqueFilename}`,
    public: true,
  };

  try {
    const [uploadedFile] = await bucket.upload(file.path, options);
    const fileUrl = uploadedFile.publicUrl();
    return fileUrl;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  uploadFile,
};
