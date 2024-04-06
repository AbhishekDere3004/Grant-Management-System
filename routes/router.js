const express = require('express');
const router = express.Router();
const userController = require('../controllers/allUserController');
const { signup, login, sendpasswordlink, forgot, changepass } = require("../controllers/AuthController");

// Get all user information
router.get('/', userController.getAllUserData);

//get single user information
router.get('/:id',userController.getSingleUserData);

// Create user information
router.post('/', userController.createUser);

// Update user information
router.put('/:id', userController.updateUser);

// Delete user information
router.delete('/:id', userController.deleteUser);

router.post("/signup", signup);
router.post("/login", login);
router.post("/sendmail",sendpasswordlink);
router.get("/forgot/:id/:token",forgot);
router.post("/changePass/:id/:token",changepass);

module.exports = router;