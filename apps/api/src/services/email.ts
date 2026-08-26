import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

export const sendVerificationEmail = async (email: string, token: string) => {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;
    await transporter.sendMail({
        from: `"Learnix" <${process.env.EMAIL_FROM}>`,
        to: email,
        subject: 'Verify Your Email Address',
        html: `
      <h1>Verify Your Email</h1>
      <p>Please click the following link to verify your email address:</p>
      <a href="${verificationUrl}">${verificationUrl}</a>
      <p>This link will expire in 24 hours.</p>
    `,
    });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
    await transporter.sendMail({
        from: `"Learnix" <${process.env.EMAIL_FROM}>`,
        to: email,
        subject: 'Reset Your Password',
        html: `
      <h1>Reset Your Password</h1>
      <p>Please click the following link to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>This link will expire in 1 hour.</p>
    `,
    });
};
