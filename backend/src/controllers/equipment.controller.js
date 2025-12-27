import prisma from '../utils/prisma.js';
import { AppError, catchAsync } from '../middleware/errorHandler.js';

export const getEquipment = catchAsync(async (req, res) => {
    const { page = 1, limit = 10, search, status, categoryId, teamId } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};

    // Role-based filtering
    if (req.user.role === 'USER') {
        where.employeeName = req.user.name;
    } else if (req.user.role === 'TECHNICIAN') {
        if (req.user.teamId) {
            where.teamId = req.user.teamId;
        }
    }
    // Managers and Admins see all

    if (status) {
        where.status = status;
    }

    if (categoryId) {
        where.categoryId = categoryId;
    }

    if (teamId) {
        where.teamId = teamId;
    }

    if (search) {
        where.OR = [
            { name: { contains: search, mode: 'insensitive' } },
            { location: { contains: search, mode: 'insensitive' } },
            { employeeName: { contains: search, mode: 'insensitive' } },
        ];
    }

    const [equipment, total] = await Promise.all([
        prisma.equipment.findMany({
            where,
            skip,
            take: parseInt(limit),
            include: {
                category: { select: { id: true, name: true } },
                team: { select: { id: true, name: true } },
                technician: { select: { id: true, name: true } },
                employee: { select: { id: true, name: true } },
                workCenter: { select: { id: true, name: true, code: true } },
                _count: {
                    select: { requests: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        }),
        prisma.equipment.count({ where }),
    ]);

    res.json({
        status: 'success',
        data: { equipment },
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / parseInt(limit)),
        },
    });
});

export const getEquipmentById = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const equipment = await prisma.equipment.findUnique({
        where: { id },
        include: {
            category: { select: { id: true, name: true } },
            team: { select: { id: true, name: true } },
            technician: { select: { id: true, name: true, email: true } },
            employee: { select: { id: true, name: true, email: true } },
            workCenter: { select: { id: true, name: true, code: true } },
            requests: {
                take: 10,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    subject: true,
                    status: true,
                    priority: true,
                    maintenanceType: true,
                    createdAt: true,
                },
            },
            _count: {
                select: { requests: true },
            },
        },
    });

    if (!equipment) {
        return next(new AppError('Equipment not found', 404));
    }

    res.json({
        status: 'success',
        data: { equipment },
    });
});

export const createEquipment = catchAsync(async (req, res) => {
    const {
        name,
        categoryId,
        company,
        usedByRole,
        employeeName,
        employeeId,
        teamId,
        technicianId,
        assignedDate,
        location,
        workCenterId,
        description,
    } = req.body;

    const equipment = await prisma.equipment.create({
        data: {
            name,
            categoryId,
            company,
            usedByRole,
            employeeName,
            employeeId,
            teamId,
            technicianId,
            assignedDate: assignedDate ? new Date(assignedDate) : null,
            location,
            workCenterId,
            description,
        },
        include: {
            category: { select: { id: true, name: true } },
            team: { select: { id: true, name: true } },
            employee: { select: { id: true, name: true } },
        },
    });

    res.status(201).json({
        status: 'success',
        data: { equipment },
    });
});

export const updateEquipment = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const {
        name,
        categoryId,
        company,
        usedByRole,
        employeeName,
        employeeId,
        teamId,
        technicianId,
        assignedDate,
        scrapDate,
        location,
        workCenterId,
        description,
        status,
    } = req.body;

    const equipment = await prisma.equipment.findUnique({
        where: { id },
    });

    if (!equipment) {
        return next(new AppError('Equipment not found', 404));
    }

    const updatedEquipment = await prisma.equipment.update({
        where: { id },
        data: {
            name,
            categoryId,
            company,
            usedByRole,
            employeeName,
            employeeId,
            teamId,
            technicianId,
            assignedDate: assignedDate ? new Date(assignedDate) : undefined,
            scrapDate: scrapDate ? new Date(scrapDate) : undefined,
            location,
            workCenterId,
            description,
            status,
        },
        include: {
            category: { select: { id: true, name: true } },
            team: { select: { id: true, name: true } },
            employee: { select: { id: true, name: true } },
        },
    });

    res.json({
        status: 'success',
        data: { equipment: updatedEquipment },
    });
});

export const deleteEquipment = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const equipment = await prisma.equipment.findUnique({
        where: { id },
    });

    if (!equipment) {
        return next(new AppError('Equipment not found', 404));
    }

    await prisma.equipment.delete({
        where: { id },
    });

    res.status(204).json({
        status: 'success',
        data: null,
    });
});

export const getEquipmentRequests = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const equipment = await prisma.equipment.findUnique({
        where: { id },
    });

    if (!equipment) {
        return next(new AppError('Equipment not found', 404));
    }

    const [requests, total] = await Promise.all([
        prisma.maintenanceRequest.findMany({
            where: { equipmentId: id },
            skip,
            take: parseInt(limit),
            include: {
                createdBy: { select: { id: true, name: true } },
                technician: { select: { id: true, name: true } },
            },
            orderBy: { createdAt: 'desc' },
        }),
        prisma.maintenanceRequest.count({ where: { equipmentId: id } }),
    ]);

    res.json({
        status: 'success',
        data: { requests },
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / parseInt(limit)),
        },
    });
});
