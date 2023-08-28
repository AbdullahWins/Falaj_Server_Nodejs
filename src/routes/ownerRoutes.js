const router = require("express").Router();

const {
  getOneOwner,
  getOwnersByType,
  getAllOwners,
  addOneOwner,
  updateOwnerById,
  sendPasswordResetLink,
  updateOwnerPasswordByEmail,
  RegisterOwner,
  LoginOwner,
  updateOwnerPasswordByOldPassword,
  deleteOwnerById,
} = require("../controllers/ownerController");

router.get("/owner/find/:id", getOneOwner);
router.get("/owner/delete/:id", deleteOwnerById);
router.get("/owner", getAllOwners);
router.get("/owner/types/:typeName", getOwnersByType);
router.post("/owner/add", addOneOwner);
router.post("/owner/register", RegisterOwner);
router.post("/owner/login", LoginOwner);
router.patch("/owner/edit/:id", updateOwnerById);
router.post("/owner/reset", sendPasswordResetLink);
router.patch("/owner/resetpassword/:email", updateOwnerPasswordByOldPassword);
router.patch("/owner/reset", updateOwnerPasswordByEmail);
router.delete("/owner/delete/:id", deleteOwnerById);

module.exports = router;
