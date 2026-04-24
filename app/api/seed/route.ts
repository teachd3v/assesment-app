import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST() {
  try {
    // Hapus data lama
    await prisma.surveyResponse.deleteMany();
    await prisma.wlaItem.deleteMany();
    await prisma.assessmentLog.deleteMany();
    await prisma.user.deleteMany();
    await prisma.department.deleteMany();

    // Seed departments
    const departments = await Promise.all([
      prisma.department.create({ data: { name: "Engineering" } }),
      prisma.department.create({ data: { name: "HR & People" } }),
      prisma.department.create({ data: { name: "Marketing" } }),
      prisma.department.create({ data: { name: "Finance" } }),
    ]);

    // Seed users
    const users = await Promise.all([
      prisma.user.create({
        data: { name: "Ahmad Fauzi", email: "ahmad@etos.id", role: "employee", departmentId: departments[0].id },
      }),
      prisma.user.create({
        data: { name: "Siti Rahayu", email: "siti@etos.id", role: "employee", departmentId: departments[1].id },
      }),
      prisma.user.create({
        data: { name: "Budi Santoso", email: "budi@etos.id", role: "employee", departmentId: departments[2].id },
      }),
      prisma.user.create({
        data: { name: "Admin HR", email: "admin@etos.id", role: "admin", departmentId: departments[1].id },
      }),
    ]);

    return NextResponse.json({
      message: "Seed berhasil",
      departments: departments.length,
      users: users.length,
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ 
      error: String(error), 
      details: error instanceof Error ? error.stack : undefined 
    }, { status: 500 });
  }
}
