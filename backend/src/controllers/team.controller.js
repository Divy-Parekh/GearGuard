import prisma from '../utils/prisma.js';
import { AppError, catchAsync } from '../middleware/errorHandler.js';

export const getTeams = catchAsync(async (req, res) => {
    const { page = 1, limit = 10, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};

    if (search) {
        where.name = { contains: search, mode: 'insensitive' };
    }

    const [teams, total] = await Promise.all([
        prisma.team.findMany({
            where,
            skip,
            take: parseInt(limit),
            include: {
                members: {
                    select: { id: true, name: true, email: true, role: true },
                },
                _count: {
                    select: { equipment: true, requests: true },
                },
            },
            orderBy: { name: 'asc' },
        }),
        prisma.team.count({ where }),
    ]);

    res.json({
        status: 'success',
        data: { teams },
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / parseInt(limit)),
        },
    });
});

export const getTeam = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const team = await prisma.team.findUnique({
        where: { id },
        include: {
            members: {
                select: { id: true, name: true, email: true, role: true },
            },
            _count: {
                select: { equipment: true, requests: true },
            },
        },
    });

    if (!team) {
        return next(new AppError('Team not found', 404));
    }

    res.json({
        status: 'success',
        data: { team },
    });
});

export const createTeam = catchAsync(async (req, res) => {
    const { name, company } = req.body;

    const team = await prisma.team.create({
        data: { name, company },
    });

    res.status(201).json({
        status: 'success',
        data: { team },
    });
});

export const updateTeam = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { name, company } = req.body;

    const team = await prisma.team.findUnique({
        where: { id },
    });

    if (!team) {
        return next(new AppError('Team not found', 404));
    }

    const updatedTeam = await prisma.team.update({
        where: { id },
        data: { name, company },
    });

    res.json({
        status: 'success',
        data: { team: updatedTeam },
    });
});

export const deleteTeam = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const team = await prisma.team.findUnique({
        where: { id },
    });

    if (!team) {
        return next(new AppError('Team not found', 404));
    }

    await prisma.team.delete({
        where: { id },
    });

    res.status(204).json({
        status: 'success',
        data: null,
    });
});

export const allocateMember = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { userId } = req.body;

    const team = await prisma.team.findUnique({
        where: { id },
    });

    if (!team) {
        return next(new AppError('Team not found', 404));
    }

    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user) {
        return next(new AppError('User not found', 404));
    }

    await prisma.user.update({
        where: { id: userId },
        data: { teamId: id },
    });

    const updatedTeam = await prisma.team.findUnique({
        where: { id },
        include: {
            members: {
                select: { id: true, name: true, email: true, role: true },
            },
        },
    });

    res.json({
        status: 'success',
        data: { team: updatedTeam },
    });
});

export const deallocateMember = catchAsync(async (req, res, next) => {
    const { id, userId } = req.params;

    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user) {
        return next(new AppError('User not found', 404));
    }

    if (user.teamId !== id) {
        return next(new AppError('User is not a member of this team', 400));
    }

    await prisma.user.update({
        where: { id: userId },
        data: { teamId: null },
    });

    const updatedTeam = await prisma.team.findUnique({
        where: { id },
        include: {
            members: {
                select: { id: true, name: true, email: true, role: true },
            },
        },
    });

    res.json({
        status: 'success',
        data: { team: updatedTeam },
    });
});
