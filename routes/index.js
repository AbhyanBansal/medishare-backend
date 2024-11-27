const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const medicineController = require('../controllers/medicineController');
const profileController = require('../controllers/profileController');
const { logout } = require('../controllers/authController');
const imageController = require('../controllers/imageController');
const notificationController = require('../controllers/notificationController');


router.get('/logout', logout);

router.post('/users/create', userController.createUser);
router.get('/users', userController.getUserDetails);
router.put('/users/:email', userController.updateUserDetails);
router.post('/users/login', userController.login);
router.get('/users', medicineController.getUserDetails);
router.post('/users/upload-image', userController.uploadImage);
router.post('/upload-image', imageController.uploadImage);
router.delete('/users/:id', userController.deleteUser);
router.get('/users/hostel', userController.getHostelUsers);  



router.post('/get-profile', profileController.getProfile);
router.post('/users/update-profile', profileController.updateProfile);

// image routes
router.post('/upload-image', imageController.uploadImage);

router.get('/medicines/hostel', medicineController.getHostelMedicines);

// Delete medicine
router.delete('/medicines/:id', medicineController.deleteMedicine);
router.post('/medicines', medicineController.createMedicine);
//router.put('/medicines/:id', medicineController.updateMedicine);
// Add more medicine routes
router.get('/medicines/search', medicineController.searchMedicines);
router.post('/medicines/details', medicineController.createMedicine);
//router.patch('/medicines/:id', medicineController.updateMedicine);
//router.delete('/medicines/:id', medicineController.deleteMedicine);



//profile routes
router.put('/users/:email', profileController.updateProfile);
router.get('/users', profileController.getProfile);

router.get('/medicines', medicineController.getUserMedicines);
router.get('/medicines/:id', medicineController.getUserMedicines);
router.delete('/medicines', medicineController.clearUserMedicines);
router.delete('/medicines/:id', medicineController.deleteMedicine);

router.post('/notifications/send', notificationController.sendNotification);


module.exports = router;