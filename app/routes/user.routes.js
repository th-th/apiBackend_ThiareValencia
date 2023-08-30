const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { checkDuplicateEmail, verifyToken } = require('../middleware');

router.post("/signup", [checkDuplicateEmail], userController.createUser);
router.post("/signin", userController.signin);
router.get("/user/:id", [verifyToken], userController.findUserById)
router.get("/user", [verifyToken], userController.findAll)
router.put("/user/:id", [verifyToken], userController.updateUserById)
router.delete("/user/:id", [verifyToken], userController.deleteUserById)


module.exports = router;