const firebase = require("firebase-admin");

const deleteFileFromFirebaseStorage = async (imageName) => {
  const urlParts = imageName.split("%");

  const folderName = urlParts[0].split("/").pop();
  const fileName = urlParts[1];

  const file = firebase
    .storage()
    .bucket(process.env.FIRE_STORAGE_BUCKET_NAME)
    .file(folderName + "/" + fileName);

  console.log(file);

  const [exists] = await file.exists();
  if (!exists) {
    return "File does not exist.";
  }

  const result = await file.delete();
  return result;
};

module.exports = {
  deleteFileFromFirebaseStorage,
};
