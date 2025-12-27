import prisma from '../utils/prisma.js';
import { AppError, catchAsync } from '../middleware/errorHandler.js';

export const getWorkCenters = catchAsync(async (req, res) => {
    const { page = 1, limit = 10, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};

    // Role-based visibility
    if (req.user.role === 'USER') {
        // Users can only see work centers of their assigned equipment
        const userEquipment = await prisma.equipment.findMany({
            where: { employeeName: req.user.name },
            select: { workCenterId: true },
        });
        const workCenterIds = userEquipment
            .map((e) => e.workCenterId)
            .filter(Boolean);
        where.id = { in: workCenterIds };
    } else if (req.user.role === 'TECHNICIAN') {
        // Technicians see work centers for their team's equipment
        if (req.user.teamId) {
            const teamEquipment = await prisma.equipment.findMany({
                where: { teamId: req.user.teamId },
                select: { workCenterId: true },
            });
            const workCenterIds = teamEquipment
                .map((e) => e.workCenterId)
                .filter(Boolean);
            where.id = { in: workCenterIds };
        }
    }
    // Managers and Admins see all

    if (search) {
        where.OR = [
            { name: { contains: search, mode: 'insensitive' } },
            { code: { contains: search, mode: 'insensitive' } },
        ];
    }

    const [workCenters, total] = await Promise.all([
        prisma.workCenter.findMany({
            where,
            skip,
            take: parseInt(limit),
            include: {
                _count: {
                    select: { equipment: true, requests: true },
                },
            },
            orderBy: { name: 'asc' },
        }),
        prisma.workCenter.count({ where }),
    ]);

    res.json({
        status: 'success',
        data: { workCenters },
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / parseInt(limit)),
        },
    });
});

export const getWorkCenter = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const workCenter = await prisma.workCenter.findUnique({
        where: { id },
        include: {
            equipment: {
                take: 10,
                select: { id: true, name: true, status: true },
            },
            _count: {
                select: { equipment: true, requests: true },
            },
        },
    });

    if (!workCenter) {
        return next(new AppError('Work center not found', 404));
    }

    res.json({
        status: 'success',
        data: { workCenter },
    });
});

export const createWorkCenter = catchAsync(async (req, res, next) => {
    const { name, code, tag, alternativeWorkCenter, costPerHour, capacity, timeEfficiency, oeeTarget } = req.body;

    // Check for duplicate code
    const existing = await prisma.workCenter.findUnique({
        where: { code },
    });

    if (existing) {
        return next(new AppError('Work center with this code already exists', 400));
    }

    const workCenter = await prisma.workCenter.create({
        data: {
            name,
            code,
            tag,
            alternativeWorkCenter,
            costPerHour,
            capacity,
            timeEfficiency,
            oeeTarget,
        },
    });

    res.status(201).json({
        status: 'success',
        data: { workCenter },
    });
});

export const updateWorkCenter = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { name, code, tag, alternativeWorkCenter, costPerHour, capacity, timeEfficiency, oeeTarget } = req.body;

    const workCenter = await prisma.workCenter.findUnique({
        where: { id },
    });

    if (!workCenter) {
        return next(new AppError('Work center not found', 404));
    }

    // Check for duplicate code if changing
    if (code && code !== workCenter.code) {
        const existing = await prisma.workCenter.findUnique({
            where: { code },
        });
        if (existing) {
            return next(new AppError('Work center with this code already exists', 400));
        }
    }

    const updatedWorkCenter = await prisma.workCenter.update({
        where: { id },
        data: {
            name,
            code,
            tag,
            alternativeWorkCenter,
            costPerHour,
            capacity,
            timeEfficiency,
            oeeTarget,
        },
    });

    res.json({
        status: 'success',
        data: { workCenter: updatedWorkCenter },
    });
});

export const deleteWorkCenter = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const workCenter = await prisma.workCenter.findUnique({
        where: { id },
    });

    if (!workCenter) {
        return next(new AppError('Work center not found', 404));
    }

    await prisma.workCenter.delete({
        where: { id },
    });

    res.status(204).json({
        status: 'success',
        data: null,
    });
});
