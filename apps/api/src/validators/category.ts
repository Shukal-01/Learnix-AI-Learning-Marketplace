import { z } from 'zod';

// Create category validator
export const createCategorySchema = z.object({
    name: z.string().min(1, 'Category name is required').max(50, 'Category name cannot exceed 50 characters'),
    slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
    description: z.string().max(500, 'Description cannot exceed 500 characters').optional(),
    thumbnail: z.string().url('Invalid URL').optional(),
    isActive: z.boolean().default(true),
    order: z.number().default(0),
});

// Update category validator
export const updateCategorySchema = z.object({
    name: z.string().min(1, 'Category name is required').max(50, 'Category name cannot exceed 50 characters').optional(),
    slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens').optional(),
    description: z.string().max(500, 'Description cannot exceed 500 characters').optional(),
    thumbnail: z.string().url('Invalid URL').optional(),
    isActive: z.boolean().optional(),
    order: z.number().optional(),
});
