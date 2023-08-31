const router = require("express").Router();

const {
  getOnePrivacyPolicy,
  addOnePrivacyPolicy,
  updatePrivacyPolicyById,
  deleteOnePrivacyPolicyById,
} = require("../controllers/privacyPolicyController");

router.get("/policies", getOnePrivacyPolicy);
router.post("/policies/add", addOnePrivacyPolicy);
router.patch("/policies/update", updatePrivacyPolicyById);
router.delete("/policies/delete", deleteOnePrivacyPolicyById);

module.exports = router;
