import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Delete existing data
  await prisma.worksheet.deleteMany({});
  await prisma.maintenanceRequest.deleteMany({});
  await prisma.equipment.deleteMany({});
  await prisma.workCenter.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.team.deleteMany({});

  const defaultPassword = await bcrypt.hash("Demo@123", 12);

  // Create Admin
  const admin = await prisma.user.create({
    data: {
      name: "Rajesh Kumar",
      email: "admin@gearguard.com",
      password: defaultPassword,
      role: "ADMIN",
      company: "GearGuard Inc.",
    },
  });
  console.log("✅ Admin created: Rajesh Kumar");

  // Create Managers
  const manager1 = await prisma.user.create({
    data: {
      name: "Priya Sharma",
      email: "manager1@gearguard.com",
      password: defaultPassword,
      role: "MANAGER",
      company: "GearGuard Inc.",
    },
  });
  console.log("✅ Manager created: Priya Sharma");

  const manager2 = await prisma.user.create({
    data: {
      name: "Vikram Singh",
      email: "manager2@gearguard.com",
      password: defaultPassword,
      role: "MANAGER",
      company: "GearGuard Inc.",
    },
  });
  console.log("✅ Manager created: Vikram Singh");

  // Create Teams
  const team1 = await prisma.team.create({
    data: {
      name: "Production Maintenance Team",
      company: "GearGuard Inc.",
    },
  });
  console.log("✅ Team created: Production Maintenance Team");

  const team2 = await prisma.team.create({
    data: {
      name: "Electrical Systems Team",
      company: "GearGuard Inc.",
    },
  });
  console.log("✅ Team created: Electrical Systems Team");

  const team3 = await prisma.team.create({
    data: {
      name: "HVAC & Utilities Team",
      company: "GearGuard Inc.",
    },
  });
  console.log("✅ Team created: HVAC & Utilities Team");

  // Create Technicians for Team 1
  const tech1 = await prisma.user.create({
    data: {
      name: "Arjun Patel",
      email: "arjun.patel@gearguard.com",
      password: defaultPassword,
      role: "TECHNICIAN",
      company: "GearGuard Inc.",
      teamId: team1.id,
    },
  });
  console.log("✅ Technician created: Arjun Patel");

  const tech2 = await prisma.user.create({
    data: {
      name: "Anjali Verma",
      email: "anjali.verma@gearguard.com",
      password: defaultPassword,
      role: "TECHNICIAN",
      company: "GearGuard Inc.",
      teamId: team1.id,
    },
  });
  console.log("✅ Technician created: Anjali Verma");

  // Create Technicians for Team 2
  const tech3 = await prisma.user.create({
    data: {
      name: "Rahul Gupta",
      email: "rahul.gupta@gearguard.com",
      password: defaultPassword,
      role: "TECHNICIAN",
      company: "GearGuard Inc.",
      teamId: team2.id,
    },
  });
  console.log("✅ Technician created: Rahul Gupta");

  const tech4 = await prisma.user.create({
    data: {
      name: "Neha Desai",
      email: "neha.desai@gearguard.com",
      password: defaultPassword,
      role: "TECHNICIAN",
      company: "GearGuard Inc.",
      teamId: team2.id,
    },
  });
  console.log("✅ Technician created: Neha Desai");

  // Create Technicians for Team 3
  const tech5 = await prisma.user.create({
    data: {
      name: "Suresh Iyer",
      email: "suresh.iyer@gearguard.com",
      password: defaultPassword,
      role: "TECHNICIAN",
      company: "GearGuard Inc.",
      teamId: team3.id,
    },
  });
  console.log("✅ Technician created: Suresh Iyer");

  // Additional Technicians for Team 1
  const tech6 = await prisma.user.create({
    data: {
      name: "Karan Singh",
      email: "karan.singh@gearguard.com",
      password: defaultPassword,
      role: "TECHNICIAN",
      company: "GearGuard Inc.",
      teamId: team1.id,
    },
  });
  console.log("✅ Technician created: Karan Singh");

  const tech7 = await prisma.user.create({
    data: {
      name: "Priya Tandon",
      email: "priya.tandon@gearguard.com",
      password: defaultPassword,
      role: "TECHNICIAN",
      company: "GearGuard Inc.",
      teamId: team1.id,
    },
  });
  console.log("✅ Technician created: Priya Tandon");

  // Additional Technicians for Team 2
  const tech8 = await prisma.user.create({
    data: {
      name: "Vikram Kumar",
      email: "vikram.kumar@gearguard.com",
      password: defaultPassword,
      role: "TECHNICIAN",
      company: "GearGuard Inc.",
      teamId: team2.id,
    },
  });
  console.log("✅ Technician created: Vikram Kumar");

  // Additional Technician for Team 3
  const tech9 = await prisma.user.create({
    data: {
      name: "Rohit Nair",
      email: "rohit.nair@gearguard.com",
      password: defaultPassword,
      role: "TECHNICIAN",
      company: "GearGuard Inc.",
      teamId: team3.id,
    },
  });
  console.log("✅ Technician created: Rohit Nair");

  // Create Regular Users
  const user1 = await prisma.user.create({
    data: {
      name: "Divya Patel",
      email: "divya.patel@gearguard.com",
      password: defaultPassword,
      role: "USER",
      company: "GearGuard Inc.",
    },
  });
  console.log("✅ User created: Divya Patel");

  const user2 = await prisma.user.create({
    data: {
      name: "Arun Reddy",
      email: "arun.reddy@gearguard.com",
      password: defaultPassword,
      role: "USER",
      company: "GearGuard Inc.",
    },
  });
  console.log("✅ User created: Arun Reddy");

  const user3 = await prisma.user.create({
    data: {
      name: "Sanjana Nair",
      email: "sanjana.nair@gearguard.com",
      password: defaultPassword,
      role: "USER",
      company: "GearGuard Inc.",
    },
  });
  console.log("✅ User created: Sanjana Nair");

  // Create Categories
  const cat1 = await prisma.category.create({
    data: {
      name: "Machinery & Equipment",
      responsible: "Arjun Patel",
      company: "GearGuard Inc.",
    },
  });

  const cat2 = await prisma.category.create({
    data: {
      name: "Electrical Systems",
      responsible: "Rahul Gupta",
      company: "GearGuard Inc.",
    },
  });

  const cat3 = await prisma.category.create({
    data: {
      name: "HVAC & Climate Control",
      responsible: "Suresh Iyer",
      company: "GearGuard Inc.",
    },
  });

  const cat4 = await prisma.category.create({
    data: {
      name: "Hydraulic Systems",
      responsible: "Anjali Verma",
      company: "GearGuard Inc.",
    },
  });

  const cat5 = await prisma.category.create({
    data: {
      name: "Conveyor & Material Handling",
      responsible: "Neha Desai",
      company: "GearGuard Inc.",
    },
  });

  console.log("✅ Categories created: 5");

  // Create Work Centers
  const wc1 = await prisma.workCenter.create({
    data: {
      name: "Production Line 1",
      code: "WC-PROD-001",
      tag: "Production",
      costPerHour: 250,
      capacity: 100,
      timeEfficiency: 85,
      oeeTarget: 82,
    },
  });

  const wc2 = await prisma.workCenter.create({
    data: {
      name: "Production Line 2",
      code: "WC-PROD-002",
      tag: "Production",
      costPerHour: 275,
      capacity: 120,
      timeEfficiency: 88,
      oeeTarget: 85,
    },
  });

  const wc3 = await prisma.workCenter.create({
    data: {
      name: "Assembly Station A",
      code: "WC-ASSM-001",
      tag: "Assembly",
      costPerHour: 200,
      capacity: 80,
      timeEfficiency: 90,
      oeeTarget: 88,
    },
  });

  const wc4 = await prisma.workCenter.create({
    data: {
      name: "Packaging Station",
      code: "WC-PACK-001",
      tag: "Packaging",
      costPerHour: 150,
      capacity: 200,
      timeEfficiency: 92,
      oeeTarget: 90,
    },
  });

  const wc5 = await prisma.workCenter.create({
    data: {
      name: "Testing Lab",
      code: "WC-TEST-001",
      tag: "Testing",
      costPerHour: 300,
      capacity: 50,
      timeEfficiency: 95,
      oeeTarget: 93,
    },
  });

  console.log("✅ Work centers created: 5");

  // Create Equipment
  const eq1 = await prisma.equipment.create({
    data: {
      name: "CNC Milling Machine #001",
      categoryId: cat1.id,
      company: "GearGuard Inc.",
      employeeName: "Divya Patel",
      teamId: team1.id,
      technicianId: tech1.id,
      location: "Building A, Floor 1, Section 1",
      workCenterId: wc1.id,
      description:
        "High-precision 5-axis CNC milling machine for component manufacturing",
      status: "ACTIVE",
    },
  });

  const eq2 = await prisma.equipment.create({
    data: {
      name: "Conveyor Belt System #001",
      categoryId: cat5.id,
      company: "GearGuard Inc.",
      employeeName: "Arun Reddy",
      teamId: team1.id,
      technicianId: tech2.id,
      location: "Building A, Floor 1, Section 2",
      workCenterId: wc1.id,
      description:
        "Main production line conveyor belt with automatic speed control",
      status: "ACTIVE",
    },
  });

  const eq3 = await prisma.equipment.create({
    data: {
      name: "Industrial Hydraulic Press #001",
      categoryId: cat4.id,
      company: "GearGuard Inc.",
      employeeName: "Sanjana Nair",
      teamId: team1.id,
      technicianId: tech1.id,
      location: "Building A, Floor 1, Section 3",
      workCenterId: wc2.id,
      description: "500-ton hydraulic press for metal forming operations",
      status: "ACTIVE",
    },
  });

  const eq4 = await prisma.equipment.create({
    data: {
      name: "Main Distribution Transformer",
      categoryId: cat2.id,
      company: "GearGuard Inc.",
      teamId: team2.id,
      technicianId: tech3.id,
      location: "Electrical Room, Building A",
      workCenterId: wc3.id,
      description: "1000 kVA main distribution transformer",
      status: "ACTIVE",
    },
  });

  const eq5 = await prisma.equipment.create({
    data: {
      name: "Robotic Assembly Arm #001",
      categoryId: cat1.id,
      company: "GearGuard Inc.",
      teamId: team1.id,
      technicianId: tech2.id,
      location: "Building A, Floor 1, Assembly Area",
      workCenterId: wc3.id,
      description: "6-axis industrial robot for precision assembly",
      status: "ACTIVE",
    },
  });

  const eq6 = await prisma.equipment.create({
    data: {
      name: "Centralized AC Unit #001",
      categoryId: cat3.id,
      company: "GearGuard Inc.",
      teamId: team3.id,
      technicianId: tech5.id,
      location: "Rooftop, Building A",
      description: "Central HVAC system serving production floor",
      status: "ACTIVE",
    },
  });

  const eq7 = await prisma.equipment.create({
    data: {
      name: "Power Distribution Panel #001",
      categoryId: cat2.id,
      company: "GearGuard Inc.",
      teamId: team2.id,
      technicianId: tech4.id,
      location: "Electrical Room, Building A",
      workCenterId: wc4.id,
      description:
        "Main electrical distribution panel with breakers and controls",
      status: "ACTIVE",
    },
  });

  const eq8 = await prisma.equipment.create({
    data: {
      name: "Automated Test Chamber",
      categoryId: cat2.id,
      company: "GearGuard Inc.",
      teamId: team2.id,
      technicianId: tech3.id,
      location: "Testing Lab",
      workCenterId: wc5.id,
      description: "Automated environmental testing chamber",
      status: "ACTIVE",
    },
  });

  console.log("✅ Equipment created: 8");

  // Create Maintenance Requests
  const now = new Date();

  // Request 1 - CNC Machine issue (Corrective)
  await prisma.maintenanceRequest.create({
    data: {
      subject: "CNC Machine spindle bearing replacement",
      createdById: user1.id,
      equipmentId: eq1.id,
      categoryId: cat1.id,
      teamId: team1.id,
      technicianId: tech1.id,
      maintenanceType: "CORRECTIVE",
      priority: 5,
      status: "IN_PROGRESS",
      requestDate: now,
      notes: "Bearing showing signs of wear and increased vibration",
    },
  });

  // Request 2 - Conveyor maintenance (Preventive)
  await prisma.maintenanceRequest.create({
    data: {
      subject: "Monthly conveyor belt inspection and alignment",
      createdById: manager1.id,
      equipmentId: eq2.id,
      categoryId: cat5.id,
      teamId: team1.id,
      maintenanceType: "PREVENTIVE",
      priority: 3,
      status: "NEW",
      requestDate: now,
      scheduledDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
      notes: "Routine monthly maintenance schedule",
    },
  });

  // Request 3 - Hydraulic press service
  await prisma.maintenanceRequest.create({
    data: {
      subject: "Hydraulic pump service and filter replacement",
      createdById: user2.id,
      equipmentId: eq3.id,
      categoryId: cat4.id,
      teamId: team1.id,
      technicianId: tech2.id,
      maintenanceType: "PREVENTIVE",
      priority: 4,
      status: "NEW",
      requestDate: now,
      scheduledDate: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
      notes: "Quarterly pump service as per maintenance schedule",
    },
  });

  // Request 4 - Transformer inspection
  await prisma.maintenanceRequest.create({
    data: {
      subject: "Transformer oil analysis and insulation check",
      createdById: manager2.id,
      equipmentId: eq4.id,
      categoryId: cat2.id,
      teamId: team2.id,
      technicianId: tech3.id,
      maintenanceType: "PREVENTIVE",
      priority: 3,
      status: "REPAIRED",
      requestDate: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
      notes: "Annual transformer maintenance completed",
    },
  });

  // Request 5 - Robot arm calibration (Corrective)
  await prisma.maintenanceRequest.create({
    data: {
      subject: "Robot arm servo motor recalibration",
      createdById: user3.id,
      equipmentId: eq5.id,
      categoryId: cat1.id,
      teamId: team1.id,
      maintenanceType: "CORRECTIVE",
      priority: 4,
      status: "NEW",
      requestDate: now,
      notes: "Robot showing positioning errors, needs servo recalibration",
    },
  });

  // Request 6 - AC unit maintenance
  await prisma.maintenanceRequest.create({
    data: {
      subject: "AC filter replacement and compressor inspection",
      createdById: admin.id,
      equipmentId: eq6.id,
      categoryId: cat3.id,
      teamId: team3.id,
      technicianId: tech5.id,
      maintenanceType: "PREVENTIVE",
      priority: 2,
      status: "IN_PROGRESS",
      requestDate: now,
      scheduledDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
      notes: "Quarterly AC maintenance and filter replacement",
    },
  });

  // Request 7 - Electrical panel upgrade
  await prisma.maintenanceRequest.create({
    data: {
      subject: "Electrical panel firmware update and breaker testing",
      createdById: manager1.id,
      equipmentId: eq7.id,
      categoryId: cat2.id,
      teamId: team2.id,
      technicianId: tech4.id,
      maintenanceType: "PREVENTIVE",
      priority: 3,
      status: "NEW",
      requestDate: now,
      scheduledDate: new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000),
      notes: "Firmware update available, schedule during maintenance window",
    },
  });

  // Request 8 - Test chamber calibration
  await prisma.maintenanceRequest.create({
    data: {
      subject: "Test chamber sensor calibration and performance verification",
      createdById: user1.id,
      equipmentId: eq8.id,
      categoryId: cat2.id,
      teamId: team2.id,
      technicianId: tech3.id,
      maintenanceType: "PREVENTIVE",
      priority: 3,
      status: "REPAIRED",
      requestDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
      notes: "Calibration completed successfully",
    },
  });

  // Request 9 - Work center maintenance
  await prisma.maintenanceRequest.create({
    data: {
      subject: "Production Line 1 conveyor speed adjustment",
      createdById: manager1.id,
      workCenterId: wc1.id,
      categoryId: cat5.id,
      teamId: team1.id,
      maintenanceType: "PREVENTIVE",
      priority: 3,
      status: "NEW",
      requestDate: now,
      notes: "Conveyor running slower than expected",
    },
  });

  console.log("✅ Maintenance requests created: 9");

  // Create Worksheets
  await prisma.worksheet.create({
    data: {
      content:
        "Initial inspection completed. Found bearing wobble and unusual noise. Bearing replacement needed.",
      requestId: (
        await prisma.maintenanceRequest.findFirst({
          where: { subject: "CNC Machine spindle bearing replacement" },
        })
      ).id,
      authorId: tech1.id,
    },
  });

  await prisma.worksheet.create({
    data: {
      content:
        "Bearing replaced successfully. Spindle now running smoothly without vibration.",
      requestId: (
        await prisma.maintenanceRequest.findFirst({
          where: { subject: "CNC Machine spindle bearing replacement" },
        })
      ).id,
      authorId: tech1.id,
    },
  });

  await prisma.worksheet.create({
    data: {
      content:
        "Oil analysis results: All parameters within acceptable range. No action required.",
      requestId: (
        await prisma.maintenanceRequest.findFirst({
          where: { subject: "Transformer oil analysis and insulation check" },
        })
      ).id,
      authorId: tech3.id,
    },
  });

  console.log("✅ Worksheets created: 3");

  // Create Notifications
  const req1 = await prisma.maintenanceRequest.findFirst({
    where: { subject: "CNC Machine spindle bearing replacement" },
  });
  const req2 = await prisma.maintenanceRequest.findFirst({
    where: { subject: "AC filter replacement and compressor inspection" },
  });
  const req3 = await prisma.maintenanceRequest.findFirst({
    where: { subject: "Transformer oil analysis and insulation check" },
  });

  // Notifications for regular users
  await prisma.notification.create({
    data: {
      type: "REQUEST",
      title: "Request Status Update",
      message:
        "Your maintenance request for CNC Machine has been assigned to technician.",
      userId: user1.id,
      requestId: req1.id,
    },
  });

  await prisma.notification.create({
    data: {
      type: "CRITICAL",
      title: "Equipment Alert",
      message:
        "Production Line 1 is showing signs of increased vibration levels.",
      userId: user1.id,
    },
  });

  await prisma.notification.create({
    data: {
      type: "COMPLETED",
      title: "Maintenance Completed",
      message:
        "Your AC filter replacement request has been completed successfully.",
      userId: user1.id,
      requestId: req2.id,
    },
  });

  // Notifications for technicians
  await prisma.notification.create({
    data: {
      type: "REQUEST",
      title: "New Task Assigned",
      message:
        "You have been assigned CNC Machine spindle bearing replacement.",
      userId: tech1.id,
      requestId: req1.id,
    },
  });

  await prisma.notification.create({
    data: {
      type: "SCHEDULE",
      title: "Scheduled Maintenance Reminder",
      message: "Transformer oil analysis is scheduled for tomorrow at 2:00 PM.",
      userId: tech3.id,
      requestId: req3.id,
    },
  });

  await prisma.notification.create({
    data: {
      type: "CRITICAL",
      title: "Urgent: Equipment Failure",
      message:
        "Hydraulic Press showing pressure drop. Immediate inspection required.",
      userId: tech2.id,
    },
  });

  // Notifications for managers
  await prisma.notification.create({
    data: {
      type: "COMPLETED",
      title: "Team Performance Summary",
      message: "Production Maintenance team completed 5 tasks this week.",
      userId: manager1.id,
    },
  });

  console.log("✅ Notifications created: 7");

  console.log("\n🎉 Database seeding completed successfully!\n");
  console.log("📋 Summary:");
  console.log("  Users: 1 Admin, 2 Managers, 9 Technicians, 3 Regular Users");
  console.log("  Teams: 3");
  console.log("  Categories: 5");
  console.log("  Work Centers: 5");
  console.log("  Equipment: 8");
  console.log("  Maintenance Requests: 9");
  console.log("  Worksheets: 3");
  console.log("  Notifications: 7\n");

  console.log("📝 Test Account Credentials:");
  console.log("  Default Password: Demo@123\n");
  console.log("  Admin:");
  console.log("    - Rajesh Kumar (admin@gearguard.com)\n");
  console.log("  Managers:");
  console.log("    - Priya Sharma (manager1@gearguard.com)");
  console.log("    - Vikram Singh (manager2@gearguard.com)\n");
  console.log("  Technicians:");
  console.log(
    "    - Arjun Patel (arjun.patel@gearguard.com) - Production Team"
  );
  console.log(
    "    - Anjali Verma (anjali.verma@gearguard.com) - Production Team"
  );
  console.log(
    "    - Karan Singh (karan.singh@gearguard.com) - Production Team"
  );
  console.log(
    "    - Priya Tandon (priya.tandon@gearguard.com) - Production Team"
  );
  console.log(
    "    - Rahul Gupta (rahul.gupta@gearguard.com) - Electrical Team"
  );
  console.log("    - Neha Desai (neha.desai@gearguard.com) - Electrical Team");
  console.log(
    "    - Vikram Kumar (vikram.kumar@gearguard.com) - Electrical Team"
  );
  console.log("    - Suresh Iyer (suresh.iyer@gearguard.com) - HVAC Team");
  console.log("    - Rohit Nair (rohit.nair@gearguard.com) - HVAC Team\n");
  console.log("  Regular Users:");
  console.log("    - Divya Patel (divya.patel@gearguard.com)");
  console.log("    - Arun Reddy (arun.reddy@gearguard.com)");
  console.log("    - Sanjana Nair (sanjana.nair@gearguard.com)");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
