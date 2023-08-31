const router = require("express").Router();

const {
  getAllPrivacyPolicies,
  getOnePrivacyPolicy,
  addOnePrivacyPolicy,
  updatePrivacyPolicyById,
  deleteOnePrivacyPolicyById,
} = require("../controllers/privacyPolicyController");

router.get("/privacypolicies", getAllPrivacyPolicies);
router.get("/privacypolicies/find/:id", getOnePrivacyPolicy);
router.post("/privacypolicies/add", addOnePrivacyPolicy);
router.patch("/privacypolicies/update/:id", updatePrivacyPolicyById);
router.delete("/privacypolicies/delete/:id", deleteOnePrivacyPolicyById);

module.exports = router;
