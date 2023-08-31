// Controllers/TOSController.js

const { TOSCollection } = require("../../config/database/db");
const { Timekoto } = require("timekoto");

//get single TOS
const getOneTOS = async (req, res) => {
  try {
    const TOS = await TOSCollection.findOne({ id: 1 });
    if (!TOS) {
      res.status(404).send({ error: "TOS not found" });
    } else {
      res.send(TOS);
      console.log(TOS);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Server Error" });
  }
};

//add new TOS
const addOneTOS = async (req, res) => {
  try {
    const data = JSON.parse(req?.body?.data);
    const { tos } = data;
    //incomplete inputs
    if (!tos) {
      return res.status(400).send({ error: "Incomplete Inputs" });
    }
    //check existing
    const existingTOSCheck = await TOSCollection.findOne({
      id: 1,
    });
    if (existingTOSCheck) {
      return res.status(409).json({ error: "TOS already exists" });
    }
    const formattedData = {
      tos,
      id: 1,
      timestamp: Timekoto(),
    };
    const result = await TOSCollection.insertOne(formattedData);
    if (result?.acknowledged === false) {
      return res.status(500).send({ error: "Failed to add TOS" });
    }
    res.send(formattedData);
    console.log(formattedData);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Failed to add TOS" });
  }
};

//update one TOS
const updateTOSById = async (req, res) => {
  try {
    const query = { id: 1 };
    const data = JSON.parse(req?.body?.data);
    const { tos } = data;

    //incomplete inputs
    if (!tos) {
      return res.status(400).send({ error: "Incomplete Inputs" });
    }

    //update privacy policy
    updateData = { id: 1, tos };
    const result = await TOSCollection.updateOne(query, {
      $set: updateData,
    });
    if (result?.modifiedCount === 0) {
      return res.status(500).send({ error: "Nothing has changed!" });
    }
    res.send(updateData);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Failed to update TOS" });
  }
};

//delete one TOS
const deleteOneTOSById = async (req, res) => {
  try {
    const id = 1;
    const query = { id: id };
    const result = await TOSCollection.deleteOne(query);
    console.log(result);
    if (result?.deletedCount === 0) {
      console.log("no TOS found with this id:", id);
      res.send({ error: "no TOS found with this id!" });
    } else {
      console.log("TOS deleted:", id);
      res.status(200).send(result);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Failed to delete TOS" });
  }
};

module.exports = {
  getOneTOS,
  addOneTOS,
  updateTOSById,
  deleteOneTOSById,
};
