import mongoose, { Document, Schema } from 'mongoose';

export interface ICategory extends Document {
    name: string;
    slug: string;
    description?: string;
    thumbnail?: string;
    isActive: boolean;
    order: number;
}

const categorySchema = new Schema<ICategory>(
    {
        name: { type: String, required: [true, 'Category name is required'], trim: true, unique: true, maxlength: [50, 'Category name cannot exceed 50 characters'] },
        slug: { type: String, required: [true, 'Category slug is required'], unique: true, trim: true, lowercase: true, match: [/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'] },
        description: { type: String, trim: true, maxlength: [500, 'Description cannot exceed 500 characters'] },
        thumbnail: { type: String, trim: true },
        isActive: { type: Boolean, default: true },
        order: { type: Number, default: 0 },
    },
    { timestamps: true }
);

const Category = mongoose.model<ICategory>('Category', categorySchema);
export default Category;
