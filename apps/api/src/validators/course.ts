import { z } from 'zod';

// Create course validator
export const createCourseSchema = z.object({
    title: z.string().min(1, 'Title is required').max(200, 'Title cannot exceed 200 characters'),
    slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
    description: z.string().min(1, 'Description is required'),
    shortDescription: z.string().min(1, 'Short description is required').max(500, 'Short description cannot exceed 500 characters'),
    price: z.number().min(0, 'Price cannot be negative'),
    isFree: z.boolean().default(false),
    categoryId: z.string().min(1, 'Category is required'),
    thumbnail: z.string().url('Invalid URL').optional(),
    difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']).default('BEGINNER'),
    whatYouWillLearn: z.array(z.string().min(1, 'Item cannot be empty')).default([]),
    prerequisites: z.array(z.string().min(1, 'Item cannot be empty')).default([]),
    sections: z.array(
        z.object({
            title: z.string().min(1, 'Section title is required'),
            description: z.string().optional(),
            lessons: z.array(
                z.object({
                    title: z.string().min(1, 'Lesson title is required'),
                    description: z.string().optional(),
                    videoUrl: z.string().url('Invalid URL').optional(),
                    duration: z.number().min(0, 'Duration cannot be negative').default(0),
                    isFree: z.boolean().default(false),
                    content: z.string().optional(),
                })
            ).default([]),
        })
    ).default([]),
});

// Update course validator
export const updateCourseSchema = z.object({
    title: z.string().min(1, 'Title is required').max(200, 'Title cannot exceed 200 characters').optional(),
    slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens').optional(),
    description: z.string().min(1, 'Description is required').optional(),
    shortDescription: z.string().min(1, 'Short description is required').max(500, 'Short description cannot exceed 500 characters').optional(),
    price: z.number().min(0, 'Price cannot be negative').optional(),
    isFree: z.boolean().optional(),
    categoryId: z.string().min(1, 'Category is required').optional(),
    thumbnail: z.string().url('Invalid URL').optional(),
    difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']).optional(),
    whatYouWillLearn: z.array(z.string().min(1, 'Item cannot be empty')).optional(),
    prerequisites: z.array(z.string().min(1, 'Item cannot be empty')).optional(),
    isPublished: z.boolean().optional(),
    isFeatured: z.boolean().optional(),
});
