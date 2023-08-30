const express = require('express');
const router = express.Router();
const bootcampController = require('../controllers/bootcamp.controller');
const { verifyToken } = require('../middleware');

router.post("/", [verifyToken], bootcampController.createBootcamp);
router.post("/addUser", [verifyToken], bootcampController.addUser);
router.get("/:id", [verifyToken], bootcampController.findById);
router.get("/", bootcampController.findAll);

module.exports = router;