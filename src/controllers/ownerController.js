//controllers/ownerController.js

const { ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { ownersCollection } = require("../../config/database/db");
const OwnerModel = require("../models/OwnerModel");
const { SendEmail } = require("../services/email/SendEmail");
const { Timekoto } = require("timekoto");
const { uploadFile } = require("../utilities/uploadFile");

//login
const LoginOwner = async (req, res) => {
  try {
    const data = JSON.parse(req?.body?.data);
    const { email, password } = data;
    const owner = await OwnerModel.findByEmail(email);
    console.log(owner);
    if (!owner) {
      return res.status(404).json({ error: "owner not found" });
    }
    const passwordMatch = await bcrypt.compare(password, owner?.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }
    const expiresIn = "7d";
    const token = jwt.sign(
      { ownerId: owner?.email },
      process.env.JWT_TOKEN_SECRET_KEY,
      { expiresIn }
    );
    res.json({ token, owner });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//registration
const RegisterOwner = async (req, res) => {
  try {
    const data = JSON.parse(req?.body?.data);
    const { file } = req;
    const { fullName, email, accountNumber, falajName, password } = data;
    let legalDocumentUrl = "";
    //check if the owner already exists
    const existingOwnerCheck = await OwnerModel.findByEmail(email);
    if (existingOwnerCheck) {
      return res.status(409).json({ error: "owner already exists" });
    }
    if (file) {
      //upload the document
      const folderName = "owners";
      legalDocumentUrl = await uploadFile(file, folderName);
      console.log(legalDocumentUrl);
    }
    //create a new owner
    const hashedPassword = await bcrypt.hash(password, 10);
    const newOwnerData = {
      fullName,
      email,
      hashedPassword,
      falajName,
      accountNumber,
      legalDocumentUrl,
    };
    const newOwner = await OwnerModel.createOwner(newOwnerData);
    res.status(201).json(newOwner);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// get all owner
const getAllOwners = async (req, res) => {
  try {
    const query = {};
    const cursor = ownersCollection.find(query);
    const owners = await cursor.toArray();
    console.log(`Found ${owners.length} owners`);
    res.send(owners);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

// get owner by types
const getOwnersByType = async (req, res) => {
  try {
    const ownerTypeName = req.params.typeName;
    const owners = await ownersCollection
      .find({ ownerType: ownerTypeName })
      .toArray();
    if (owners.length === 0) {
      res.status(404).send("No owners found for the specified type");
    } else {
      res.send(owners);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

// get single owner
const getOneOwner = async (req, res) => {
  try {
    const ownerId = req.params.id;
    const owner = await ownersCollection.findOne({
      _id: new ObjectId(ownerId),
    });
    if (!owner) {
      res.status(404).send("owner not found");
    } else {
      res.send(owner);
      console.log(owner);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

// update one owner
const updateOwnerById = async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const { files } = req;
    const data = JSON.parse(req?.body?.data);
    const { password, ...additionalData } = data;
    const folderName = "owners";
    let updateData = {};

    if (files) {
      const fileUrl = await uploadFile(files, folderName);
      updateData = { ...updateData, fileUrl };
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData = { ...updateData, password: hashedPassword };
    }
    if (additionalData) {
      updateData = { ...updateData, ...additionalData };
    }
    const result = await ownersCollection.updateOne(query, {
      $set: updateData,
    });
    console.log(result);
    res.send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to update owner");
  }
};

// send password reset link to owner
const sendPasswordResetLink = async (req, res) => {
  try {
    const data = JSON.parse(req?.body?.data);
    const { email } = data;
    if (email) {
      const query = { email: email };
      const result = await ownersCollection.findOne(query);
      const receiver = result?.email;
      console.log(receiver);
      if (!receiver) {
        res.status(401).send("owner doesn't exists");
      } else {
        const subject = "Reset Your Password";
        const text = `Please follow this link to reset your password: ${process.env.OWNER_PASSWORD_RESET_URL}/${receiver}`;
        const status = await SendEmail(receiver, subject, text);
        res.status(200).send(status);
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to reset owner password");
  }
};

// update one owner password by email
const updateOwnerPasswordByEmail = async (req, res) => {
  try {
    const data = JSON.parse(req?.body?.data);
    const { email, newPassword } = data;
    let updateData = {};
    if (email && newPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      updateData = { password: hashedPassword };
    }
    const query = { email: email };
    const result = await ownersCollection.updateOne(query, {
      $set: updateData,
    });
    res.send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to reset owner password");
  }
};

// update one owner password by OldPassword
const updateOwnerPasswordByOldPassword = async (req, res) => {
  try {
    const email = req?.params?.email;
    console.log(email);
    const query = { email: email };
    const data = JSON.parse(req?.body?.data);
    const owner = await OwnerModel.findByEmail(email);

    const { oldPassword, newPassword } = data;
    let updateData = {};

    if (!owner) {
      return res.status(404).json({ error: "owner not found" });
    }
    const passwordMatch = await bcrypt.compare(oldPassword, owner?.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "invalid password" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    updateData = { password: hashedPassword };
    const result = await ownersCollection.updateOne(query, {
      $set: updateData,
    });
    res.send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to update owner password");
  }
};

// delete one owner
const deleteOwnerById = async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await ownersCollection.deleteOne(query);
    if (result?.deletedCount === 0) {
      console.log("no owner found with this id:", id);
      res.send("no owner found with this id!");
    } else {
      console.log("owner deleted:", id);
      res.send(result);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to delete owner");
  }
};

module.exports = {
  getOneOwner,
  getOwnersByType,
  getAllOwners,
  updateOwnerById,
  sendPasswordResetLink,
  updateOwnerPasswordByEmail,
  RegisterOwner,
  LoginOwner,
  updateOwnerPasswordByOldPassword,
  deleteOwnerById,
};
