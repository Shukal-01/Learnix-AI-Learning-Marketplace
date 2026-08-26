import { z } from 'zod';

// Update user profile validator
export const updateUserSchema = z.object({
    firstName: z.string().min(1, 'First name is required').max(50, 'First name cannot exceed 50 characters').optional(),
    lastName: z.string().min(1, 'Last name is required').max(50, 'Last name cannot exceed 50 characters').optional(),
    bio: z.string().max(500, 'Bio cannot exceed 500 characters').optional(),
    avatar: z.string().url('Invalid URL').optional(),
});

// Update password validator
export const updatePasswordSchema = z.object({
    currentPassword: z.string().min(6, 'Current password is required'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Confirm password is required'),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});
