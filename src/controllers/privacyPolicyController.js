// Controllers/privacyPolicyController.js

const { privacyPoliciesCollection } = require("../../config/database/db");
const { Timekoto } = require("timekoto");

//get single privacyPolicy
const getOnePrivacyPolicy = async (req, res) => {
  try {
    const privacyPolicyId = 1;
    const privacyPolicy = await privacyPoliciesCollection.findOne({
      privacyPolicyId: privacyPolicyId,
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
      privacyPolicyId: 1,
    });
    if (existingPrivacyPolicyCheck) {
      return res.status(409).json({ error: "Privacy policy already exists" });
    }
    const formattedData = {
      privacyPolicy,
      privacyPolicyId: 1,
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
    const query = { privacyPolicyId: 1 };
    const data = JSON.parse(req?.body?.data);
    const { privacyPolicy } = data;

    //incomplete inputs
    if (!privacyPolicy) {
      return res.status(400).send({ error: "Incomplete Inputs" });
    }

    //update privacy policy
    updateData = { privacyPolicyId: 1, privacyPolicy };
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
    const privacyPolicyId = 1;
    const query = { privacyPolicyId: privacyPolicyId };
    const result = await privacyPoliciesCollection.deleteOne(query);
    console.log(result);
    if (result?.deletedCount === 0) {
      console.log("no privacyPolicy found with this id:", privacyPolicyId);
      res.send({ error: "no privacyPolicy found with this id!" });
    } else {
      console.log("privacyPolicy deleted:", privacyPolicyId);
      res.status(200).send(result);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Failed to delete privacyPolicy" });
  }
};

module.exports = {
  getOnePrivacyPolicy,
  addOnePrivacyPolicy,
  updatePrivacyPolicyById,
  deleteOnePrivacyPolicyById,
};
