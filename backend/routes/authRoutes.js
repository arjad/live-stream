const express = require("express");
const router = express.Router();
const cors = require("cors");

const authController = require("../controllers/authController");

router.use(cors());
router.use(express.json());

router.post("/signup", authController.signup);
router.post("/confirm", authController.confirm);
router.post("/resend-code", authController.resendCode);
router.post("/login", authController.login);

module.exports = router;
