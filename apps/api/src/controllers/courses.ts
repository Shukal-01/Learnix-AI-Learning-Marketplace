import { Request, Response } from 'express';
import Course from '../models/Course.js';
import { createCourseSchema, updateCourseSchema } from '../validators/course.js';
import { AuthRequest } from '../middlewares/auth.js';

export const getCourses = async (req: Request, res: Response) => {
    try {
        const { category, difficulty, isFree, search, page = 1, limit = 10 } = req.query;
        const query: any = { isPublished: true };

        if (category) query.categoryId = category;
        if (difficulty) query.difficulty = difficulty;
        if (isFree !== undefined) query.isFree = isFree === 'true';
        if (search) query.$or = [{ title: { $regex: search as string, $options: 'i' } }, { description: { $regex: search as string, $options: 'i' } }];

        const courses = await Course.find(query)
            .populate('categoryId', 'name')
            .populate('instructorId', 'firstName lastName avatar')
            .skip((+page - 1) * +limit)
            .limit(+limit)
            .sort({ createdAt: -1 });

        const total = await Course.countDocuments(query);

        res.status(200).json({ success: true, courses, total, page: +page, totalPages: Math.ceil(total / +limit) });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const getCourseById = async (req: Request, res: Response) => {
    try {
        const course = await Course.findById(req.params.id)
            .populate('categoryId', 'name')
            .populate('instructorId', 'firstName lastName avatar bio')
            .populate('sections.lessons');
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }
        res.status(200).json({ success: true, course });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const getCourseBySlug = async (req: Request, res: Response) => {
    try {
        const course = await Course.findOne({ slug: req.params.slug })
            .populate('categoryId', 'name')
            .populate('instructorId', 'firstName lastName avatar bio')
            .populate('sections.lessons');
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }
        res.status(200).json({ success: true, course });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const createCourse = async (req: AuthRequest, res: Response) => {
    try {
        const courseData = createCourseSchema.parse(req.body);
        const course = await Course.create({
            ...courseData,
            instructorId: req.user._id,
        });
        res.status(201).json({ success: true, course });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const updateCourse = async (req: AuthRequest, res: Response) => {
    try {
        const updates = updateCourseSchema.parse(req.body);
        const course = await Course.findOneAndUpdate(
            { _id: req.params.id, instructorId: req.user._id },
            updates,
            { new: true }
        );
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found or not authorized' });
        }
        res.status(200).json({ success: true, course });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const deleteCourse = async (req: AuthRequest, res: Response) => {
    try {
        const course = await Course.findOneAndDelete({ _id: req.params.id, instructorId: req.user._id });
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found or not authorized' });
        }
        res.status(200).json({ success: true, message: 'Course deleted successfully' });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const publishCourse = async (req: AuthRequest, res: Response) => {
    try {
        const course = await Course.findOneAndUpdate(
            { _id: req.params.id, instructorId: req.user._id },
            { isPublished: true },
            { new: true }
        );
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found or not authorized' });
        }
        res.status(200).json({ success: true, course });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const unpublishCourse = async (req: AuthRequest, res: Response) => {
    try {
        const course = await Course.findOneAndUpdate(
            { _id: req.params.id, instructorId: req.user._id },
            { isPublished: false },
            { new: true }
        );
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found or not authorized' });
        }
        res.status(200).json({ success: true, course });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};
