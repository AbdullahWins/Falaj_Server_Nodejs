// Controllers/TOSController.js

const { TOSCollection } = require("../../config/database/db");
const { Timekoto } = require("timekoto");

//get single TOS
const getOneTOS = async (req, res) => {
  try {
    const tosId = 1;
    const TOS = await TOSCollection.findOne({ tosId: tosId });
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
    const tosId = 1;
    const data = JSON.parse(req?.body?.data);
    const { tos } = data;
    //incomplete inputs
    if (!tos) {
      return res.status(400).send({ error: "Incomplete Inputs" });
    }
    //check existing
    const existingTOSCheck = await TOSCollection.findOne({
      tosId: tosId,
    });
    if (existingTOSCheck) {
      return res.status(409).json({ error: "TOS already exists" });
    }
    const formattedData = {
      tos,
      tosId,
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
    const tosId = 1;
    const query = { tosId: tosId };
    const data = JSON.parse(req?.body?.data);
    const { tos } = data;

    //incomplete inputs
    if (!tos) {
      return res.status(400).send({ error: "Incomplete Inputs" });
    }

    //update privacy policy
    updateData = { tosId, tos };
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
    const tosId = 1;
    const query = { tosId: tosId };
    const result = await TOSCollection.deleteOne(query);
    console.log(result);
    if (result?.deletedCount === 0) {
      console.log("no TOS found with this id:", tosId);
      res.send({ error: "no TOS found with this id!" });
    } else {
      console.log("TOS deleted:", tosId);
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
