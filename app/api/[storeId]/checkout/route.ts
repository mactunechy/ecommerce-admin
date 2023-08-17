import { CORS_HEADERS } from "@/lib/config";
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { createPaymentSession, isValidationError } from "payfast-lib";
import { PayfastPaymentProps } from "payfast-lib/dist/types";

const PAYFAST_CONFIG = {
  merchant_id: process.env.MERCHANT_ID!,
  merchant_key: process.env.MERCHANT_KEY!,
  return_url: process.env.RETURN_URL!,
  cancel_url: process.env.CANCEL_URL!,
  notify_url: process.env.NOTIFY_URL!,
  env: process.env.PAYFAST_ENV as "prod" | "sandbox",
  passPhrase: process.env.PASSPHRASE,
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: CORS_HEADERS });
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  const { productIds, name, email, phone, address } = await req.json();

  if (!productIds || productIds.length === 0) {
    return new NextResponse("Product ids are required", {
      status: 400,
      headers: CORS_HEADERS,
    });
  }

  const products = await prismadb.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
  });

  const order = await prismadb.order.create({
    data: {
      storeId: params.storeId,
      phone,
      email,
      isPaid: false,
      orderItems: {
        create: productIds.map((productId: string) => ({
          product: {
            connect: {
              id: productId,
            },
          },
        })),
      },
    },
  });

  const totalPrice = products.reduce(
    (total, current) => total + Number(current.price),
    0
  );

  const paymentOptions: PayfastPaymentProps = {
    name_first: name,
    email_address: email,
    amount: totalPrice.toString(),
    item_name: products.map((product) => product.name).join(", "),
    custom_str1: order.id,
    custom_str2: JSON.stringify(productIds),
  };

  try {
    const result = await createPaymentSession(PAYFAST_CONFIG, paymentOptions);
    return NextResponse.json(result, { status: 200, headers: CORS_HEADERS });
  } catch (error) {
    if (isValidationError(error)) {
      return NextResponse.json(error, { status: 400, headers: CORS_HEADERS });
    }
    return NextResponse.json(error, { status: 500, headers: CORS_HEADERS });
  }
}
