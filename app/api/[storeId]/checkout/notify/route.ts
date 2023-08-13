import { CORS_HEADERS } from "@/lib/config";
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const fieldsArray = await request.formData();

  const data: Record<string, any> = {};
  fieldsArray.forEach((value, key) => {
    data[key] = value;
  });

  if (data.payment_status === "COMPLETE") {
    const orderId = data.custom_str1;

    await prismadb.order.updateMany({
      where: {
        id: orderId,
      },
      data: {
        isPaid: true,
        shippingStatus: "INPROGRESS",
      },
    });
  }

  return new NextResponse("Success", { status: 201, headers: CORS_HEADERS });
}
