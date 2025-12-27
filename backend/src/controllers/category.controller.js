import prisma from '../utils/prisma.js';
import { AppError, catchAsync } from '../middleware/errorHandler.js';

export const getCategories = catchAsync(async (req, res) => {
    const { page = 1, limit = 10, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};

    if (search) {
        where.name = { contains: search, mode: 'insensitive' };
    }

    const [categories, total] = await Promise.all([
        prisma.category.findMany({
            where,
            skip,
            take: parseInt(limit),
            orderBy: { name: 'asc' },
        }),
        prisma.category.count({ where }),
    ]);

    res.json({
        status: 'success',
        data: { categories },
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / parseInt(limit)),
        },
    });
});

export const getCategory = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const category = await prisma.category.findUnique({
        where: { id },
        include: {
            _count: {
                select: { equipment: true, requests: true },
            },
        },
    });

    if (!category) {
        return next(new AppError('Category not found', 404));
    }

    res.json({
        status: 'success',
        data: { category },
    });
});

export const createCategory = catchAsync(async (req, res) => {
    const { name, responsible, company } = req.body;

    const category = await prisma.category.create({
        data: { name, responsible, company },
    });

    res.status(201).json({
        status: 'success',
        data: { category },
    });
});

export const updateCategory = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { name, responsible, company } = req.body;

    const category = await prisma.category.findUnique({
        where: { id },
    });

    if (!category) {
        return next(new AppError('Category not found', 404));
    }

    const updatedCategory = await prisma.category.update({
        where: { id },
        data: { name, responsible, company },
    });

    res.json({
        status: 'success',
        data: { category: updatedCategory },
    });
});

export const deleteCategory = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const category = await prisma.category.findUnique({
        where: { id },
    });

    if (!category) {
        return next(new AppError('Category not found', 404));
    }

    await prisma.category.delete({
        where: { id },
    });

    res.status(204).json({
        status: 'success',
        data: null,
    });
});
