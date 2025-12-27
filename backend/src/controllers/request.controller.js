import prisma from '../utils/prisma.js';
import { AppError, catchAsync } from '../middleware/errorHandler.js';

export const getRequests = catchAsync(async (req, res) => {
    const { page = 1, limit = 10, search, status, maintenanceType, priority, equipmentId, teamId, technicianId } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};

    // Role-based filtering
    if (req.user.role === 'USER') {
        where.createdById = req.user.id;
    } else if (req.user.role === 'TECHNICIAN') {
        if (req.user.teamId) {
            where.OR = [
                { teamId: req.user.teamId },
                { technicianId: req.user.id },
            ];
        } else {
            where.technicianId = req.user.id;
        }
    }
    // Managers and Admins see all

    if (status) {
        where.status = status;
    }

    if (maintenanceType) {
        where.maintenanceType = maintenanceType;
    }

    if (priority) {
        where.priority = parseInt(priority);
    }

    if (equipmentId) {
        where.equipmentId = equipmentId;
    }

    if (teamId) {
        where.teamId = teamId;
    }

    if (technicianId) {
        where.technicianId = technicianId;
    }

    if (search) {
        where.subject = { contains: search, mode: 'insensitive' };
    }

    const [requests, total] = await Promise.all([
        prisma.maintenanceRequest.findMany({
            where,
            skip,
            take: parseInt(limit),
            include: {
                createdBy: { select: { id: true, name: true } },
                equipment: { select: { id: true, name: true, status: true } },
                workCenter: { select: { id: true, name: true, code: true } },
                category: { select: { id: true, name: true } },
                team: { select: { id: true, name: true } },
                technician: { select: { id: true, name: true } },
                _count: { select: { worksheets: true } },
            },
            orderBy: { createdAt: 'desc' },
        }),
        prisma.maintenanceRequest.count({ where }),
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

export const getRequestsByStatus = catchAsync(async (req, res) => {
    const where = {};

    // Role-based filtering
    if (req.user.role === 'USER') {
        where.createdById = req.user.id;
    } else if (req.user.role === 'TECHNICIAN') {
        if (req.user.teamId) {
            where.OR = [
                { teamId: req.user.teamId },
                { technicianId: req.user.id },
            ];
        } else {
            where.technicianId = req.user.id;
        }
    }

    const statuses = ['NEW', 'IN_PROGRESS', 'REPAIRED', 'SCRAP'];
    const result = {};

    for (const status of statuses) {
        result[status] = await prisma.maintenanceRequest.findMany({
            where: { ...where, status },
            include: {
                createdBy: { select: { id: true, name: true } },
                equipment: { select: { id: true, name: true, status: true } },
                technician: { select: { id: true, name: true } },
                team: { select: { id: true, name: true } },
            },
            orderBy: { priority: 'desc' },
        });
    }

    res.json({
        status: 'success',
        data: { kanban: result },
    });
});

export const getRequest = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const request = await prisma.maintenanceRequest.findUnique({
        where: { id },
        include: {
            createdBy: { select: { id: true, name: true, email: true } },
            equipment: {
                select: { id: true, name: true, status: true, location: true },
            },
            workCenter: { select: { id: true, name: true, code: true } },
            category: { select: { id: true, name: true } },
            team: { select: { id: true, name: true } },
            technician: { select: { id: true, name: true, email: true } },
            worksheets: {
                include: {
                    author: { select: { id: true, name: true } },
                },
                orderBy: { createdAt: 'desc' },
            },
        },
    });

    if (!request) {
        return next(new AppError('Request not found', 404));
    }

    res.json({
        status: 'success',
        data: { request },
    });
});

export const createRequest = catchAsync(async (req, res) => {
    const {
        subject,
        equipmentId,
        workCenterId,
        maintenanceType,
        scheduledDate,
        priority,
        company,
        notes,
        instructions,
    } = req.body;

    // Auto-fill logic: get category and team from equipment
    let categoryId = null;
    let teamId = null;

    if (equipmentId) {
        const equipment = await prisma.equipment.findUnique({
            where: { id: equipmentId },
            select: { categoryId: true, teamId: true },
        });
        if (equipment) {
            categoryId = equipment.categoryId;
            teamId = equipment.teamId;
        }
    }

    const request = await prisma.maintenanceRequest.create({
        data: {
            subject,
            createdById: req.user.id,
            equipmentId,
            workCenterId,
            categoryId,
            teamId,
            maintenanceType: maintenanceType || 'CORRECTIVE',
            scheduledDate: scheduledDate ? new Date(scheduledDate) : null,
            priority: priority || 3,
            company,
            notes,
            instructions,
        },
        include: {
            createdBy: { select: { id: true, name: true } },
            equipment: { select: { id: true, name: true } },
            category: { select: { id: true, name: true } },
            team: { select: { id: true, name: true } },
        },
    });

    res.status(201).json({
        status: 'success',
        data: { request },
    });
});

export const updateRequest = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const updateData = req.body;

    const request = await prisma.maintenanceRequest.findUnique({
        where: { id },
    });

    if (!request) {
        return next(new AppError('Request not found', 404));
    }

    // Handle date fields
    if (updateData.scheduledDate) {
        updateData.scheduledDate = new Date(updateData.scheduledDate);
    }

    const updatedRequest = await prisma.maintenanceRequest.update({
        where: { id },
        data: updateData,
        include: {
            createdBy: { select: { id: true, name: true } },
            equipment: { select: { id: true, name: true } },
            category: { select: { id: true, name: true } },
            team: { select: { id: true, name: true } },
            technician: { select: { id: true, name: true } },
        },
    });

    res.json({
        status: 'success',
        data: { request: updatedRequest },
    });
});

export const updateRequestStatus = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { status } = req.body;

    const request = await prisma.maintenanceRequest.findUnique({
        where: { id },
        include: { equipment: true },
    });

    if (!request) {
        return next(new AppError('Request not found', 404));
    }

    // Valid transitions
    const validTransitions = {
        NEW: ['IN_PROGRESS', 'SCRAP'],
        IN_PROGRESS: ['REPAIRED', 'SCRAP'],
        REPAIRED: ['SCRAP'],
        SCRAP: [],
    };

    if (!validTransitions[request.status].includes(status)) {
        return next(new AppError(`Cannot transition from ${request.status} to ${status}`, 400));
    }

    // If moving to SCRAP, mark equipment as scrapped
    if (status === 'SCRAP' && request.equipmentId) {
        await prisma.equipment.update({
            where: { id: request.equipmentId },
            data: {
                status: 'SCRAPPED',
                scrapDate: new Date(),
            },
        });

        // Log a note on the request
        await prisma.worksheet.create({
            data: {
                content: `Equipment marked as SCRAPPED due to maintenance request being moved to SCRAP status.`,
                requestId: id,
                authorId: req.user.id,
            },
        });
    }

    const updatedRequest = await prisma.maintenanceRequest.update({
        where: { id },
        data: { status },
        include: {
            createdBy: { select: { id: true, name: true } },
            equipment: { select: { id: true, name: true, status: true } },
            technician: { select: { id: true, name: true } },
        },
    });

    res.json({
        status: 'success',
        data: { request: updatedRequest },
    });
});

export const assignTechnician = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { technicianId } = req.body;

    const request = await prisma.maintenanceRequest.findUnique({
        where: { id },
    });

    if (!request) {
        return next(new AppError('Request not found', 404));
    }

    const technician = await prisma.user.findUnique({
        where: { id: technicianId },
    });

    if (!technician || technician.role !== 'TECHNICIAN') {
        return next(new AppError('Invalid technician', 400));
    }

    const updatedRequest = await prisma.maintenanceRequest.update({
        where: { id },
        data: { technicianId },
        include: {
            technician: { select: { id: true, name: true } },
        },
    });

    res.json({
        status: 'success',
        data: { request: updatedRequest },
    });
});

export const deleteRequest = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const request = await prisma.maintenanceRequest.findUnique({
        where: { id },
    });

    if (!request) {
        return next(new AppError('Request not found', 404));
    }

    await prisma.maintenanceRequest.delete({
        where: { id },
    });

    res.status(204).json({
        status: 'success',
        data: null,
    });
});

export const getCalendarRequests = catchAsync(async (req, res) => {
    const { start, end } = req.query;

    const where = {
        maintenanceType: 'PREVENTIVE',
        scheduledDate: {
            gte: start ? new Date(start) : new Date(),
            lte: end ? new Date(end) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
    };

    // Role-based filtering
    if (req.user.role === 'USER') {
        where.createdById = req.user.id;
    } else if (req.user.role === 'TECHNICIAN') {
        if (req.user.teamId) {
            where.OR = [
                { teamId: req.user.teamId },
                { technicianId: req.user.id },
            ];
        } else {
            where.technicianId = req.user.id;
        }
    }

    const requests = await prisma.maintenanceRequest.findMany({
        where,
        include: {
            equipment: { select: { id: true, name: true } },
            technician: { select: { id: true, name: true } },
        },
    });

    // Transform to calendar events
    const events = requests.map((req) => ({
        id: req.id,
        title: req.subject,
        start: req.scheduledDate,
        end: req.scheduledDate,
        extendedProps: {
            equipment: req.equipment,
            technician: req.technician,
            priority: req.priority,
            status: req.status,
        },
        backgroundColor: req.technicianId ? '#1976d2' : '#ed6c02',
        borderColor: new Date(req.scheduledDate) < new Date() && req.status !== 'REPAIRED' ? '#d32f2f' : undefined,
    }));

    res.json({
        status: 'success',
        data: { events },
    });
});
