import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; categoryId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

    const { name, billboardId } = body;

    if (!name) return new NextResponse("Name is required", { status: 400 });

    if (!billboardId)
      return new NextResponse("Billboard id is required", { status: 400 });

    if (!params.storeId)
      return new NextResponse("Store id is required", { status: 400 });

    const storeByUserId = prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId)
      return new NextResponse("Unauthorized", { status: 403 });

    const category = await prismadb.category.updateMany({
      where: {
        id: params.categoryId,
      },
      data: {
        name,
        billboardId,
      },
    });
    return NextResponse.json(category);
  } catch (error) {
    console.log("[CATEGORIES_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; categoryId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

    if (!params.storeId)
      return new NextResponse("Store id is required", { status: 400 });

    const storeByUserId = prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId)
      return new NextResponse("Unauthorized", { status: 403 });

    await prismadb.category.deleteMany({
      where: {
        id: params.categoryId,
      },
    });
    return new NextResponse("", { status: 201 });
  } catch (error) {
    console.log("[CATEGORIES_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { categoryId: string } }
) {
  try {
    if (!params.categoryId)
      return new NextResponse("Category id is required", { status: 400 });

    const category = await prismadb.category.findUnique({
      where: {
        id: params.categoryId,
      },
      include: {
        billboard: true,
      },
    });
    return NextResponse.json(category);
  } catch (error) {
    console.log("[CATEGORY_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
