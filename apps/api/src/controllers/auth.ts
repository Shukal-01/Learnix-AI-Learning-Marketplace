
import { Request, Response } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import User from '../models/User.js';
import { loginSchema, registerSchema, forgotPasswordSchema, resetPasswordSchema } from '../validators/auth.js';
import { sendVerificationEmail, sendPasswordResetEmail } from '../services/email.js';
import crypto from 'crypto';

const jwtExpiresIn = (process.env.JWT_EXPIRES_IN ?? '15d') as SignOptions['expiresIn'];
const refreshJwtExpiresIn = (process.env.JWT_REFRESH_EXPIRES_IN ?? '30d') as SignOptions['expiresIn'];

export const register = async (req: Request, res: Response) => {
    try {
        const { firstName, lastName, email, password, role } = registerSchema.parse(req.body);

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        const verifyToken = crypto.randomBytes(32).toString('hex');
        const verifyTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        const user = await User.create({
            firstName,
            lastName,
            email,
            password,
            role,
            verifyToken,
            verifyTokenExpires,
        });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: jwtExpiresIn });
        const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET!, { expiresIn: refreshJwtExpiresIn });

        user.refreshToken = refreshToken;
        await user.save();

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        });

        res.status(201).json({
            success: true,
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified,
            },
            token,
            refreshToken,
        });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = loginSchema.parse(req.body);

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: jwtExpiresIn });
        const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET!, { expiresIn: refreshJwtExpiresIn });

        user.refreshToken = refreshToken;
        await user.save();

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 24 * 60 * 60 * 1000,
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            success: true,
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified,
            },
            token,
            refreshToken,
        });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const logout = async (req: Request, res: Response) => {
    res.clearCookie('token');
    res.clearCookie('refreshToken');
    res.status(200).json({ success: true, message: 'Logged out successfully' });
};

export const refreshToken = async (req: Request, res: Response) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({ success: false, message: 'No refresh token' });
        }

        const decoded: any = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!);
        const user = await User.findById(decoded.id);
        if (!user || user.refreshToken !== refreshToken) {
            return res.status(403).json({ success: false, message: 'Invalid refresh token' });
        }

        const newToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: jwtExpiresIn });
        const newRefreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET!, { expiresIn: refreshJwtExpiresIn });

        user.refreshToken = newRefreshToken;
        await user.save();

        res.cookie('token', newToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 24 * 60 * 60 * 1000,
        });

        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({ success: true, token: newToken, refreshToken: newRefreshToken });
    } catch (error: any) {
        res.status(403).json({ success: false, message: 'Invalid refresh token' });
    }
};

export const getMe = async (req: any, res: Response) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, user });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};
