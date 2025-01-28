import express from 'express';
import { userRegister, userLogin } from '../controllers/userController';
import {getUserDetails, getAdminDetails, getHrDetails, getSuperAdminDetails, putUserDetails, deleteUser, getAllUserDetails} from '../controllers/roleBasedUserController'

const router = express.Router();

// Define POST route for user registration and login
router.post('/register', userRegister);
router.post('/login', userLogin);

// Route for admin, hr, admin, superadmin
router.get('/me', getUserDetails);
router.get('/admin-details', getAdminDetails);
router.get('/superadmin-details', getSuperAdminDetails);
router.get('/hr-details', getHrDetails);

// PUT request for updating user details (based on roles)
router.put('/update-user/:userId', putUserDetails);

// Define DELETE route for deleting a user by userId
router.delete('/delete-user/:userId', deleteUser);

// New GET route for fetching all user details based on roles
router.get('/getall-user-details', getAllUserDetails);

export default router;
