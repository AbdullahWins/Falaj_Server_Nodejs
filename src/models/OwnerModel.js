const { ObjectID } = require("mongodb");
const { ownersCollection } = require("../../config/database/db");
const { Timekoto } = require("timekoto");

class OwnerModel {
  constructor(
    id,
    fullName,
    email,
    accountNumber,
    falajName,
    legalDocumentUrl,
    password
  ) {
    this._id = id;
    this.fullName = fullName;
    this.email = email;
    this.accountNumber = accountNumber;
    this.falajName = falajName;
    this.legalDocumentUrl = legalDocumentUrl;
    this.password = password;
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

  static async createOwner({
    fullName,
    email,
    accountNumber,
    falajName,
    legalDocumentUrl,
    hashedPassword,
  }) {
    const newOwner = {
      fullName,
      email,
      accountNumber,
      falajName,
      legalDocumentUrl,
      password: hashedPassword,
      status: "inactive",
      timestamp: Timekoto(),
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
