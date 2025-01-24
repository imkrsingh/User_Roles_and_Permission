import express from 'express';
import { userRegister, userLogin } from '../controllers/userController';
import {getUserDetails, getAdminDetails, getHrDetails, getSuperAdminDetails} from '../controllers/roleBasedUserController'

const router = express.Router();

// Define POST route for user registration and login
router.post('/register', userRegister);
router.post('/login', userLogin);

// Route for admin and hr
router.get('/me', getUserDetails);
router.get('/admin-details', getAdminDetails);
router.get('/superadmin-details', getSuperAdminDetails);
router.get('/hr-details', getHrDetails);

export default router;
