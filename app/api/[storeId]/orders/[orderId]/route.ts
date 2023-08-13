import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; orderId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

    const { shippingStatus } = body;

    if (!shippingStatus)
      return new NextResponse("Shipping status is required", { status: 400 });

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

    const color = await prismadb.order.updateMany({
      where: {
        id: params.orderId,
      },
      data: {
        shippingStatus,
      },
    });
    return NextResponse.json(color);
  } catch (error) {
    console.log("[ORDER_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
