import { Request, Response } from 'express';
import { userModel } from '../models/userSchema';
import { sendResetPasswordEmail, generateOTP } from '../utils/generateOTP';
import bcrypt from 'bcryptjs';

let otpStore: { [key: string]: { otp: string, expiresAt: number } } = {};

export const forgotOTPPassword = async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        // Generate an OTP
        const otp = generateOTP();
        const expiresAt = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes

        // Store OTP with expiration time (in real apps, store it in a database)
        otpStore[email] = { otp, expiresAt };

        // Send OTP to user's email
        await sendResetPasswordEmail(email, otp);

        res.status(200).json({ message: 'OTP sent to your email' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const resetOTPPassword = async (req: Request, res: Response): Promise<void> => {
    const { email, otp, password } = req.body;

    try {
        // Check if the OTP exists and is not expired
        if (!otpStore[email]) {
            res.status(400).json({ message: 'OTP not sent or expired' });
            return
        }

        const storedOtp = otpStore[email];

        if (storedOtp.otp !== otp) {
            res.status(400).json({ message: 'Invalid OTP' });
            return
        }

        if (storedOtp.expiresAt < Date.now()) {
            res.status(400).json({ message: 'OTP has expired' });
            return
        }

        // Find the user by email
        const user = await userModel.findOne({ email });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;

        // Save the updated user
        await user.save();

        // Optionally, clear the OTP from the store
        delete otpStore[email];

        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
