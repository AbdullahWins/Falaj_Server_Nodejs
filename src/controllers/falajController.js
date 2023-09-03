// Controllers/falajController.js

const { ObjectId } = require("mongodb");
const { falajesCollection } = require("../../config/database/db");
const { Timekoto } = require("timekoto");

//get all Falaj
const getAllFalajes = async (req, res) => {
  try {
    const query = {};
    const cursor = falajesCollection.find(query);
    const falajes = await cursor.toArray();
    console.log(`Found ${falajes?.length} falajes`);
    res.send(falajes);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

//get single falaj
const getOneFalaj = async (req, res) => {
  try {
    const falajId = req.params.id;
    const falaj = await falajesCollection.findOne({
      _id: new ObjectId(falajId),
    });
    if (!falaj) {
      res.status(404).send("falaj not found");
    } else {
      res.send(falaj);
      console.log(falaj);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

//add new falaj
const addOneFalaj = async (req, res) => {
  try {
    const data = JSON.parse(req?.body?.data);
    const {
      falazName,
      description,
      falazLocation,
      falazStartTime,
      falazEndTime,
      falajOwners,
    } = data;
    if (
      !falazName ||
      !description ||
      !falazLocation ||
      !falazStartTime ||
      !falazEndTime ||
      !falajOwners
    ) {
      return res.status(400).send("Incomplete Inputs");
    }
    const formattedData = {
      falazName,
      description,
      falazLocation,
      falazStartTime,
      falazEndTime,
      falajOwners,
      timestamp: Timekoto(),
    };
    const result = await falajesCollection.insertOne(formattedData);
    if (result?.acknowledged === false) {
      return res.status(500).send("Failed to add falaj");
    }
    res.send(formattedData);
    console.log(formattedData);
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to add falaj");
  }
};

//update one falaj
const updateFalajById = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    const query = { _id: new ObjectId(id) };
    const data = JSON.parse(req?.body?.data);
    let updateData = {};

    if (data) {
      updateData = { ...updateData, ...data };
    }

    const result = await falajesCollection.updateOne(query, {
      $set: updateData,
    });
    if (result?.modifiedCount === 0) {
      res.status(500).send("Failed to update falaj");
    }
    res.send(updateData);
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to update falaj");
  }
};

//delete one falaj
const deleteOneFalajById = async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await falajesCollection.deleteOne(query);
    console.log(result);
    if (result?.deletedCount === 0) {
      console.log("no falaj found with this id:", id);
      res.send("no falaj found with this id!");
    } else {
      console.log("falaj deleted:", id);
      res.status(200).send(result);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to delete falaj");
  }
};

module.exports = {
  getAllFalajes,
  getOneFalaj,
  addOneFalaj,
  updateFalajById,
  deleteOneFalajById,
};
