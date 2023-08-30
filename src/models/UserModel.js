const { ObjectID } = require("mongodb");
const { usersCollection } = require("../../config/database/db");

class UserModel {
  constructor(id, fullName, email, password, timestamp) {
    this._id = id;
    this.fullName = fullName;
    this.email = email;
    this.password = password;
    this.timestamp = timestamp;
  }

  static async findByEmail(email) {
    const user = await usersCollection.findOne({ email: email });
    return user;
  }

  static async findById(id) {
    console.log(id);
    const user = await usersCollection.findOne({ _id: ObjectID(id) });
    return user;
  }

  static async createUser(fullName, email, password, timestamp) {
    const newUser = { fullName, email, password, timestamp };
    console.log(newUser);
    const result = await usersCollection.insertOne(newUser);
    const createdUser = {
      _id: result.insertedId,
      ...newUser,
    };
    return createdUser;
  }
}

module.exports = UserModel;
