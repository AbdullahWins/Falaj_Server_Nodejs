const { ObjectID } = require("mongodb");
const { ownersCollection } = require("../../config/database/db");

class OwnerModel {
  constructor(
    id,
    fullName,
    email,
    password,
    falajName,
    legalDocumentUrl,
    status,
    timestamp
  ) {
    this._id = id;
    this.fullName = fullName;
    this.email = email;
    this.password = password;
    this.falajName = falajName;
    this.legalDocumentUrl = legalDocumentUrl;
    this.status = status;
    this.timestamp = timestamp;
  }

  static async findByEmail(email) {
    const owner = await ownersCollection.findOne({ email: email });
    return owner;
  }

  static async findById(id) {
    console.log(id);
    const owner = await ownersCollection.findOne({ _id: ObjectID(id) });
    return owner;
  }

  static async createOwner(
    fullName,
    email,
    password,
    falajName,
    legalDocumentUrl,
    status,
    timestamp
  ) {
    const newOwner = {
      fullName,
      email,
      password,
      falajName,
      legalDocumentUrl,
      status,
      timestamp,
    };
    const result = await ownersCollection.insertOne(newOwner);
    const createdOwner = {
      _id: result.insertedId,
      ...newOwner,
    };
    return createdOwner;
  }
}

module.exports = OwnerModel;
