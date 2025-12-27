import prisma from '../utils/prisma.js';
import { catchAsync } from '../middleware/errorHandler.js';

export const getDashboardStats = catchAsync(async (req, res) => {
    const stats = {};

    // Role-based stats
    if (req.user.role === 'ADMIN' || req.user.role === 'MANAGER') {
        // Critical equipment (needs maintenance)
        const criticalEquipment = await prisma.equipment.count({
            where: {
                status: 'ACTIVE',
                requests: {
                    some: {
                        status: { in: ['NEW', 'IN_PROGRESS'] },
                        priority: { gte: 4 },
                    },
                },
            },
        });

        // Open requests
        const openRequests = await prisma.maintenanceRequest.count({
            where: {
                status: { in: ['NEW', 'IN_PROGRESS'] },
            },
        });

        // Technician utilization
        const technicians = await prisma.user.findMany({
            where: { role: 'TECHNICIAN' },
            include: {
                _count: {
                    select: {
                        assignedRequests: {
                            where: { status: 'IN_PROGRESS' },
                        },
                    },
                },
            },
        });

        const busyTechnicians = technicians.filter(
            (t) => t._count.assignedRequests > 0
        ).length;

        // Equipment by status
        const equipmentByStatus = await prisma.equipment.groupBy({
            by: ['status'],
            _count: true,
        });

        // Requests by status
        const requestsByStatus = await prisma.maintenanceRequest.groupBy({
            by: ['status'],
            _count: true,
        });

        // Requests by type
        const requestsByType = await prisma.maintenanceRequest.groupBy({
            by: ['maintenanceType'],
            _count: true,
        });

        // Recent requests
        const recentRequests = await prisma.maintenanceRequest.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: {
                equipment: { select: { name: true } },
                createdBy: { select: { name: true } },
            },
        });

        // Overdue preventive maintenance
        const overduePreventive = await prisma.maintenanceRequest.count({
            where: {
                maintenanceType: 'PREVENTIVE',
                scheduledDate: { lt: new Date() },
                status: { in: ['NEW', 'IN_PROGRESS'] },
            },
        });

        stats.criticalEquipment = criticalEquipment;
        stats.openRequests = openRequests;
        stats.technicianUtilization = {
            busy: busyTechnicians,
            total: technicians.length,
            percentage: technicians.length > 0
                ? Math.round((busyTechnicians / technicians.length) * 100)
                : 0,
        };
        stats.equipmentByStatus = equipmentByStatus;
        stats.requestsByStatus = requestsByStatus;
        stats.requestsByType = requestsByType;
        stats.recentRequests = recentRequests;
        stats.overduePreventive = overduePreventive;

        // Total counts
        stats.totalEquipment = await prisma.equipment.count();
        stats.totalTeams = await prisma.team.count();
        stats.totalUsers = await prisma.user.count();
        stats.totalWorkCenters = await prisma.workCenter.count();
    }

    // Technician-specific stats
    if (req.user.role === 'TECHNICIAN') {
        const myRequests = await prisma.maintenanceRequest.groupBy({
            by: ['status'],
            where: {
                OR: [
                    { technicianId: req.user.id },
                    { teamId: req.user.teamId },
                ],
            },
            _count: true,
        });

        stats.myRequests = myRequests;
        stats.assignedToMe = await prisma.maintenanceRequest.count({
            where: { technicianId: req.user.id },
        });
        stats.teamRequests = req.user.teamId
            ? await prisma.maintenanceRequest.count({
                where: { teamId: req.user.teamId },
            })
            : 0;
    }

    // User-specific stats
    if (req.user.role === 'USER') {
        stats.myRequests = await prisma.maintenanceRequest.groupBy({
            by: ['status'],
            where: { createdById: req.user.id },
            _count: true,
        });

        stats.myEquipment = await prisma.equipment.count({
            where: { employeeName: req.user.name },
        });
    }

    res.json({
        status: 'success',
        data: { stats },
    });
});
