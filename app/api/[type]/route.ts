import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getEntityType } from "@/lib/entity-utils";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ type: string }> }
) {
  try {
    const { type } = await params;
    const entityType = getEntityType(type);

    if (!entityType) {
      return NextResponse.json(
        { error: "Invalid entity type" },
        { status: 400 }
      );
    }

    const entities = await prisma.entity.findMany({
      where: { type: entityType },
      include: {
        parent: true,
        children: true,
      },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({ entities, type: entityType });
  } catch (error) {
    console.error("Error fetching entities:", error);
    return NextResponse.json(
      { error: "Failed to fetch entities" },
      { status: 500 }
    );
  }
}
