import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

// GET: Obtener reportes del usuario
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const reports = await prisma.report.findMany({
      where: { userId: session.user.id },
      include: {
        brand1: { select: { id: true, name: true } },
        brand2: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(reports);
  } catch (error) {
    console.error("Error fetching reports:", error);
    return NextResponse.json(
      { error: "Error fetching reports" },
      { status: 500 }
    );
  }
}

// POST: Crear nuevo reporte
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { brand1Id, brand2Id, title, executiveSummary, insights, conclusion } =
      body;

    // Crear slug único
    const slug = `${title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .substring(0, 50)}-${Date.now()}`;

    const report = await prisma.report.create({
      data: {
        userId: session.user.id,
        brand1Id,
        brand2Id,
        title,
        slug,
        executiveSummary,
        insights,
        conclusion,
      },
      include: {
        brand1: { select: { name: true } },
        brand2: { select: { name: true } },
      },
    });

    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    console.error("Error creating report:", error);
    return NextResponse.json(
      { error: "Error creating report" },
      { status: 500 }
    );
  }
}

// DELETE: Eliminar reporte
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const reportId = searchParams.get("id");

    if (!reportId) {
      return NextResponse.json(
        { error: "Report ID is required" },
        { status: 400 }
      );
    }

    // Verificar que el reporte pertenezca al usuario
    const report = await prisma.report.findUnique({
      where: { id: reportId },
    });

    if (!report || report.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Report not found or unauthorized" },
        { status: 404 }
      );
    }

    await prisma.report.delete({
      where: { id: reportId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting report:", error);
    return NextResponse.json(
      { error: "Error deleting report" },
      { status: 500 }
    );
  }
}
