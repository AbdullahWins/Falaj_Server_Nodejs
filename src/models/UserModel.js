const { ObjectID } = require("mongodb");
const { usersCollection } = require("../../config/database/db");
const { Timekoto } = require("timekoto");

class UserModel {
  constructor(id, fullName, email, accountNumber, password) {
    this._id = id;
    this.fullName = fullName;
    this.email = email;
    this.accountNumber = accountNumber;
    this.password = password;
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

  static async createUser({ fullName, email, accountNumber, hashedPassword }) {
    const newUser = {
      fullName,
      email,
      accountNumber,
      password: hashedPassword,
      timestamp: Timekoto(),
    };
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
