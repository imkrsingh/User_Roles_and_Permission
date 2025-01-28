import { Router } from 'express';
import { forgotPassword, resetPassword } from '../controllers/passwordController';
import { forgotOTPPassword, resetOTPPassword } from '../controllers/forgotOrResetPassword';

const router = Router();

//Token based password forgot and reset
// Route to handle forgot password
router.post('/forgot-password', forgotPassword);
// Route to handle password reset
router.post('/reset-password/:token', resetPassword);


// OTP based password forgot and reset
router.post('/forgot-password-otp', forgotOTPPassword);
router.post('/reset-password-otp', resetOTPPassword);

export default router;
