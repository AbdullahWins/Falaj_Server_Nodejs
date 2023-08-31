const router = require("express").Router();

const {
  getAllFalajes,
  getOneFalaj,
  addOneFalaj,
  updateFalajById,
  deleteOneFalajById,
} = require("../controllers/falajController");

router.get("/falajes", getAllFalajes);
router.get("/falajes/find/:id", getOneFalaj);
router.post("/falajes/add", addOneFalaj);
router.patch("/falajes/update/:id", updateFalajById);
router.delete("/falajes/delete/:id", deleteOneFalajById);

module.exports = router;
