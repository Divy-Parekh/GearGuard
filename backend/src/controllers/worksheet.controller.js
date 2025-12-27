import prisma from '../utils/prisma.js';
import { AppError, catchAsync } from '../middleware/errorHandler.js';

export const getWorksheets = catchAsync(async (req, res) => {
    const { requestId } = req.query;

    const where = {};
    if (requestId) {
        where.requestId = requestId;
    }

    const worksheets = await prisma.worksheet.findMany({
        where,
        include: {
            author: { select: { id: true, name: true } },
            request: { select: { id: true, subject: true } },
        },
        orderBy: { createdAt: 'desc' },
    });

    res.json({
        status: 'success',
        data: { worksheets },
    });
});

export const getWorksheet = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const worksheet = await prisma.worksheet.findUnique({
        where: { id },
        include: {
            author: { select: { id: true, name: true } },
            request: { select: { id: true, subject: true } },
        },
    });

    if (!worksheet) {
        return next(new AppError('Worksheet not found', 404));
    }

    res.json({
        status: 'success',
        data: { worksheet },
    });
});

export const createWorksheet = catchAsync(async (req, res, next) => {
    const { content, requestId } = req.body;

    const request = await prisma.maintenanceRequest.findUnique({
        where: { id: requestId },
    });

    if (!request) {
        return next(new AppError('Request not found', 404));
    }

    const worksheet = await prisma.worksheet.create({
        data: {
            content,
            requestId,
            authorId: req.user.id,
        },
        include: {
            author: { select: { id: true, name: true } },
        },
    });

    res.status(201).json({
        status: 'success',
        data: { worksheet },
    });
});

export const updateWorksheet = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { content } = req.body;

    const worksheet = await prisma.worksheet.findUnique({
        where: { id },
    });

    if (!worksheet) {
        return next(new AppError('Worksheet not found', 404));
    }

    // Only author can update
    if (worksheet.authorId !== req.user.id && req.user.role !== 'ADMIN') {
        return next(new AppError('You can only edit your own worksheets', 403));
    }

    const updatedWorksheet = await prisma.worksheet.update({
        where: { id },
        data: { content },
        include: {
            author: { select: { id: true, name: true } },
        },
    });

    res.json({
        status: 'success',
        data: { worksheet: updatedWorksheet },
    });
});

export const deleteWorksheet = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const worksheet = await prisma.worksheet.findUnique({
        where: { id },
    });

    if (!worksheet) {
        return next(new AppError('Worksheet not found', 404));
    }

    // Only author or admin can delete
    if (worksheet.authorId !== req.user.id && req.user.role !== 'ADMIN') {
        return next(new AppError('You can only delete your own worksheets', 403));
    }

    await prisma.worksheet.delete({
        where: { id },
    });

    res.status(204).json({
        status: 'success',
        data: null,
    });
});
