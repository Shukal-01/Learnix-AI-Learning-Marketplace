import { Request, Response } from 'express';
import Category from '../models/Category.js';
import { createCategorySchema, updateCategorySchema } from '../validators/category.js';

export const getCategories = async (req: Request, res: Response) => {
    try {
        const categories = await Category.find().sort({ order: 1 });
        res.status(200).json({ success: true, categories });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const getCategoryById = async (req: Request, res: Response) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }
        res.status(200).json({ success: true, category });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const createCategory = async (req: Request, res: Response) => {
    try {
        const categoryData = createCategorySchema.parse(req.body);
        const category = await Category.create(categoryData);
        res.status(201).json({ success: true, category });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const updateCategory = async (req: Request, res: Response) => {
    try {
        const updates = updateCategorySchema.parse(req.body);
        const category = await Category.findByIdAndUpdate(req.params.id, updates, { new: true });
        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }
        res.status(200).json({ success: true, category });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const deleteCategory = async (req: Request, res: Response) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }
        res.status(200).json({ success: true, message: 'Category deleted successfully' });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};
