import { z } from 'zod';

// Create enrollment validator
export const createEnrollmentSchema = z.object({
    courseId: z.string().min(1, 'Course ID is required'),
});
