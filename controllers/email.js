const Mailgen = require('mailgen');
const nodemailer = require('nodemailer');

exports.sendCompanyForgotPasswordEmail = async (recipientEmail, resetToken) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_FP, // Make sure you have these environment variables set
                pass: process.env.PASSWORD_FP,
            },
        });

        const MailGenerator = new Mailgen({
            theme: 'default',
            product: {
                name: 'Your Company Portal',
                link: 'https://example.com', // Replace with your company portal link
            },
        });

        const response = {
            body: {
                intro: 'You have requested to reset your password.',
                action: {
                    instructions: 'Click the button below to reset your password:',
                    button: {
                        color: '#007BFF',
                        text: 'Reset Password',
                        link: `http://your-company-portal.com/reset-password?token=${resetToken}`, // Replace with your reset password link
                    },
                },
                outro: 'If you did not request a password reset, please ignore this email.',
            },
        };

        const emailContent = MailGenerator.generate(response);

        const message = {
            from: 'nodemailtest493@gmail.com', // Replace with your email address
            to: recipientEmail,
            subject: 'Password Reset Request',
            html: emailContent,
        };

        await transporter.sendMail(message);

        return { msg: 'Password reset email sent successfully' };
    } catch (error) {
        throw error;
    }
};
