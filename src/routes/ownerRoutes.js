const router = require("express").Router();

const {
  getOneOwner,
  getOwnersByType,
  getAllOwners,
  updateOwnerById,
  sendPasswordResetLink,
  updateOwnerPasswordByEmail,
  RegisterOwner,
  LoginOwner,
  updateOwnerPasswordByOldPassword,
  deleteOwnerById,
} = require("../controllers/ownerController");

router.get("/owners/find/:id", getOneOwner);
router.get("/owners/delete/:id", deleteOwnerById);
router.get("/owners", getAllOwners);
router.get("/owners/types/:typeName", getOwnersByType);
router.post("/owners/register", RegisterOwner);
router.post("/owners/login", LoginOwner);
router.patch("/owners/edit/:id", updateOwnerById);
router.post("/owners/reset", sendPasswordResetLink);
router.patch("/owners/resetpassword/:email", updateOwnerPasswordByOldPassword);
router.patch("/owners/reset", updateOwnerPasswordByEmail);
router.delete("/owners/delete/:id", deleteOwnerById);

module.exports = router;
