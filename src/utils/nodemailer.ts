import nodemailer from 'nodemailer';

const sendResetPasswordEmail = async (email: string, resetLink: string): Promise<void> => {
    // Create a transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    // Email options
    const mailOptions = {
        from: process.env.EMAIL_USER as string, // sender address
        to: [process.env.EMAIL_USER as string, 'manishkrsingh834@gmail.com'], // receiver address
        subject: 'Reset your password', // subject line
        html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`, // HTML body
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

export { sendResetPasswordEmail };
