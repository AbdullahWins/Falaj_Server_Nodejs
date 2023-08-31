// Controllers/privacyPolicyController.js

const { ObjectId } = require("mongodb");
const { privacyPoliciesCollection } = require("../../config/database/db");
const { Timekoto } = require("timekoto");

//get all privacyPolicy
const getAllPrivacyPolicies = async (req, res) => {
  try {
    const query = {};
    const cursor = privacyPoliciesCollection.find(query);
    const privacyPolicies = await cursor.toArray();
    console.log(`Found ${privacyPolicies?.length} privacyPolicies`);
    res.send(privacyPolicies);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Server Error" });
  }
};

//get single privacyPolicy
const getOnePrivacyPolicy = async (req, res) => {
  try {
    const privacyPolicyId = req.params.id;
    const privacyPolicy = await privacyPoliciesCollection.findOne({
      _id: new ObjectId(privacyPolicyId),
    });
    if (!privacyPolicy) {
      res.status(404).send({ error: "privacyPolicy not found" });
    } else {
      res.send(privacyPolicy);
      console.log(privacyPolicy);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Server Error" });
  }
};

//add new privacyPolicy
const addOnePrivacyPolicy = async (req, res) => {
  try {
    const data = JSON.parse(req?.body?.data);
    const { privacyPolicy } = data;
    //incomplete inputs
    if (!privacyPolicy) {
      return res.status(400).send({ error: "Incomplete Inputs" });
    }
    //check existing
    const existingPrivacyPolicyCheck = await privacyPoliciesCollection.findOne({
      id: 1,
    });
    if (existingPrivacyPolicyCheck) {
      return res.status(409).json({ error: "Privacy policy already exists" });
    }
    const formattedData = {
      privacyPolicy,
      id: 1,
      timestamp: Timekoto(),
    };
    const result = await privacyPoliciesCollection.insertOne(formattedData);
    if (result?.acknowledged === false) {
      return res.status(500).send({ error: "Failed to add privacyPolicy" });
    }
    res.send(formattedData);
    console.log(formattedData);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Failed to add privacyPolicy" });
  }
};

//update one privacyPolicy
const updatePrivacyPolicyById = async (req, res) => {
  try {
    // const id = req.params.id;
    // console.log(id);
    const query = { id: 1 };
    const data = JSON.parse(req?.body?.data);
    const { privacyPolicy } = data;

    //incomplete inputs
    if (!privacyPolicy) {
      return res.status(400).send({ error: "Incomplete Inputs" });
    }

    //update privacy policy
    updateData = { id: 1, privacyPolicy };
    const result = await privacyPoliciesCollection.updateOne(query, {
      $set: updateData,
    });
    if (result?.modifiedCount === 0) {
      return res.status(500).send({ error: "Nothing has changed!" });
    }
    res.send(updateData);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Failed to update privacyPolicy" });
  }
};

//delete one privacyPolicy
const deleteOnePrivacyPolicyById = async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await privacyPoliciesCollection.deleteOne(query);
    console.log(result);
    if (result?.deletedCount === 0) {
      console.log("no privacyPolicy found with this id:", id);
      res.send({ error: "no privacyPolicy found with this id!" });
    } else {
      console.log("privacyPolicy deleted:", id);
      res.status(200).send(result);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Failed to delete privacyPolicy" });
  }
};

module.exports = {
  getAllPrivacyPolicies,
  getOnePrivacyPolicy,
  addOnePrivacyPolicy,
  updatePrivacyPolicyById,
  deleteOnePrivacyPolicyById,
};
