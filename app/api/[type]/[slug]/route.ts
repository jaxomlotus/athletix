import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getEntityType } from "@/lib/entity-utils";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ type: string; slug: string }> }
) {
  try {
    const { type, slug } = await params;
    const entityType = getEntityType(type);

    if (!entityType) {
      return NextResponse.json(
        { error: "Invalid entity type" },
        { status: 400 }
      );
    }

    const entity = await prisma.entity.findUnique({
      where: { slug, type: entityType },
      include: {
        parent: {
          include: {
            parent: {
              include: {
                parent: true,
              },
            },
          },
        },
        children: {
          include: {
            children: true,
            clips: {
              include: {
                clip: true,
              },
            },
          },
        },
        clips: {
          include: {
            clip: true,
          },
        },
      },
    });

    if (!entity) {
      return NextResponse.json(
        { error: "Entity not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ entity, type: entityType });
  } catch (error) {
    console.error("Error fetching entity:", error);
    return NextResponse.json(
      { error: "Failed to fetch entity" },
      { status: 500 }
    );
  }
}
