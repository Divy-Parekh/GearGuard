import bcrypt from 'bcryptjs';
import prisma from '../utils/prisma.js';
import { AppError, catchAsync } from '../middleware/errorHandler.js';

export const getUsers = catchAsync(async (req, res) => {
    const { page = 1, limit = 10, role, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};

    if (role) {
        where.role = role;
    }

    if (search) {
        where.OR = [
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
        ];
    }

    const [users, total] = await Promise.all([
        prisma.user.findMany({
            where,
            skip,
            take: parseInt(limit),
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                company: true,
                teamId: true,
                team: {
                    select: { id: true, name: true },
                },
                createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
        }),
        prisma.user.count({ where }),
    ]);

    res.json({
        status: 'success',
        data: { users },
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / parseInt(limit)),
        },
    });
});

export const getUser = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            company: true,
            teamId: true,
            team: {
                select: { id: true, name: true },
            },
            createdAt: true,
            updatedAt: true,
        },
    });

    if (!user) {
        return next(new AppError('User not found', 404));
    }

    res.json({
        status: 'success',
        data: { user },
    });
});

export const createUser = catchAsync(async (req, res, next) => {
    const { name, email, password, role, company, teamId } = req.body;

    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        return next(new AppError('User with this email already exists', 400));
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role: role || 'USER',
            company,
            teamId,
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            company: true,
            teamId: true,
        },
    });

    res.status(201).json({
        status: 'success',
        data: { user },
    });
});

export const updateUser = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { name, email, role, company, teamId } = req.body;

    const user = await prisma.user.findUnique({
        where: { id },
    });

    if (!user) {
        return next(new AppError('User not found', 404));
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== user.email) {
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            return next(new AppError('Email already in use', 400));
        }
    }

    const updatedUser = await prisma.user.update({
        where: { id },
        data: {
            name,
            email,
            role,
            company,
            teamId,
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            company: true,
            teamId: true,
        },
    });

    res.json({
        status: 'success',
        data: { user: updatedUser },
    });
});

export const deleteUser = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
        where: { id },
    });

    if (!user) {
        return next(new AppError('User not found', 404));
    }

    await prisma.user.delete({
        where: { id },
    });

    res.status(204).json({
        status: 'success',
        data: null,
    });
});

export const getTechnicians = catchAsync(async (req, res) => {
    const technicians = await prisma.user.findMany({
        where: { role: 'TECHNICIAN' },
        select: {
            id: true,
            name: true,
            email: true,
            teamId: true,
            team: {
                select: { id: true, name: true },
            },
        },
    });

    res.json({
        status: 'success',
        data: { technicians },
    });
});
