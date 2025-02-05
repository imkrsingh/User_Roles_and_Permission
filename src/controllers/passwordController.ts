import { Request, Response } from 'express';
import { userModel } from '../models/userSchema';
import { sendResetPasswordEmail } from '../utils/nodemailer';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        // Generate a reset token
        const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: '1h' });

        // Create a reset link with token as a query parameter
        const resetLink = `${process.env.FRONTEND_URL}?token=${resetToken}`;

        // Send the reset password email
        await sendResetPasswordEmail(email, resetLink);

        res.status(200).json({ message: 'Reset password email sent successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        // Verify the token
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

        // Find the user by ID
        const user = await userModel.findById(decoded.id);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;

        // Save the updated user
        await user.save();

        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
