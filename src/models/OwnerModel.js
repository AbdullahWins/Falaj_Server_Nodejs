const { ObjectID } = require("mongodb");
const { ownersCollection } = require("../../config/database/db");

class OwnerModel {
  constructor(
    id,
    firstName,
    lastName,
    email,
    password,
    permissions,
    status,
    timestamp
  ) {
    this._id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
    this.permissions = permissions;
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
    firstName,
    lastName,
    email,
    password,
    permissions,
    status,
    timestamp
  ) {
    const newOwner = {
      firstName,
      lastName,
      email,
      password,
      permissions,
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
