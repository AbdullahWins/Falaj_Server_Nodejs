const router = require("express").Router();
const {
  getOneTOS,
  addOneTOS,
  updateTOSById,
  deleteOneTOSById,
} = require("../controllers/tosController");

router.get("/tos", getOneTOS);
router.post("/tos/add", addOneTOS);
router.patch("/tos/update", updateTOSById);
router.delete("/tos/delete", deleteOneTOSById);

module.exports = router;
