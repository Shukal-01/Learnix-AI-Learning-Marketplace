import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ILesson {
    title: string;
    description?: string;
    videoUrl?: string;
    duration: number;
    isFree: boolean;
    content?: string;
    order: number;
}

export interface ISection {
    title: string;
    description?: string;
    lessons: ILesson[];
    order: number;
}

export interface ICourse extends Document {
    title: string;
    slug: string;
    description: string;
    shortDescription: string;
    thumbnail?: string;
    price: number;
    isFree: boolean;
    averageRating: number;
    totalEnrollments: number;
    totalLessons: number;
    totalDuration: number;
    difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
    categoryId: Types.ObjectId;
    instructorId: Types.ObjectId;
    sections: ISection[];
    whatYouWillLearn: string[];
    prerequisites: string[];
    isPublished: boolean;
    isFeatured: boolean;
}

const lessonSchema = new Schema<ILesson>({
    title: { type: String, required: [true, 'Lesson title is required'], trim: true },
    description: { type: String, trim: true },
    videoUrl: { type: String, trim: true },
    duration: { type: Number, default: 0, min: [0, 'Duration cannot be negative'] },
    isFree: { type: Boolean, default: false },
    content: { type: String },
    order: { type: Number, default: 0 },
}, { _id: false });

const sectionSchema = new Schema<ISection>({
    title: { type: String, required: [true, 'Section title is required'], trim: true },
    description: { type: String, trim: true },
    lessons: { type: [lessonSchema], default: [] },
    order: { type: Number, default: 0 },
}, { _id: true });

const courseSchema = new Schema<ICourse>(
    {
        title: { type: String, required: [true, 'Course title is required'], trim: true, maxlength: [200, 'Course title cannot exceed 200 characters'] },
        slug: { type: String, required: [true, 'Course slug is required'], unique: true, trim: true, lowercase: true, match: [/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'] },
        description: { type: String, required: [true, 'Course description is required'], trim: true },
        shortDescription: { type: String, required: [true, 'Short description is required'], trim: true, maxlength: [500, 'Short description cannot exceed 500 characters'] },
        thumbnail: { type: String, trim: true },
        price: { type: Number, default: 0, min: [0, 'Price cannot be negative'] },
        isFree: { type: Boolean, default: false },
        averageRating: { type: Number, default: 0, min: [0, 'Rating cannot be negative'], max: [5, 'Rating cannot exceed 5'] },
        totalEnrollments: { type: Number, default: 0, min: [0, 'Total enrollments cannot be negative'] },
        totalLessons: { type: Number, default: 0, min: [0, 'Total lessons cannot be negative'] },
        totalDuration: { type: Number, default: 0, min: [0, 'Total duration cannot be negative'] },
        difficulty: { type: String, enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'], default: 'BEGINNER' },
        categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: [true, 'Category is required'] },
        instructorId: { type: Schema.Types.ObjectId, ref: 'User', required: [true, 'Instructor is required'] },
        sections: { type: [sectionSchema], default: [] },
        whatYouWillLearn: { type: [String], default: [] },
        prerequisites: { type: [String], default: [] },
        isPublished: { type: Boolean, default: false },
        isFeatured: { type: Boolean, default: false },
    },
    { timestamps: true }
);

courseSchema.pre("save", function () {
    this.totalLessons = this.sections.reduce(
        (sum, section) => sum + section.lessons.length,
        0
    );

    this.totalDuration = this.sections.reduce(
        (sum, section) =>
            sum +
            section.lessons.reduce(
                (sectionSum, lesson) => sectionSum + lesson.duration,
                0
            ),
        0
    );
});

const Course = mongoose.model<ICourse>('Course', courseSchema);
export default Course;
