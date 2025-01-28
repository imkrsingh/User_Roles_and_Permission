import nodemailer from 'nodemailer';

const generateOTP = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit OTP
};

const sendResetPasswordEmail = async (email: string, otp: string): Promise<void> => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER as string, // sender address
        to: [process.env.EMAIL_USER as string, 'manishkrsingh834@gmail.com'],
        subject: 'Reset your password',
        html: `<p>Your OTP for resetting the password is <strong>${otp}</strong>. Please use this OTP to reset your password.</p>`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('OTP sent successfully');
    } catch (error) {
        console.error('Error sending OTP:', error);
        throw error;
    }
};

export { sendResetPasswordEmail, generateOTP };
