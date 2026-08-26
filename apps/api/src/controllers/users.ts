import { Request, Response } from 'express';
import User from '../models/User.js';
import { updateUserSchema, updatePasswordSchema } from '../validators/user.js';

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json({ success: true, users });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const getUserById = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, user });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const updateUser = async (req: any, res: Response) => {
    try {
        const updates = updateUserSchema.parse(req.body);
        const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, user });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const updatePassword = async (req: any, res: Response) => {
    try {
        const { currentPassword, newPassword } = updatePasswordSchema.parse(req.body);
        const user = await User.findById(req.user._id).select('+password');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Current password is incorrect' });
        }

        user.password = newPassword;
        await user.save();
        res.status(200).json({ success: true, message: 'Password updated successfully' });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};
