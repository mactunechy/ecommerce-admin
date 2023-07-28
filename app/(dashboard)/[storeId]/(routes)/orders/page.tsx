import React from "react";
import { format } from "date-fns";

import prismadb from "@/lib/prismadb";
import { BillboardClient } from "./components/client";
import { OrderColumn } from "./components/columns";
import { priceFormatter } from "@/lib/utils";

const OrdersPage = async ({ params }: { params: { storeId: string } }) => {
  const orders = await prismadb.order.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedOrders: OrderColumn[] = orders.map((item) => ({
    id: item.id,
    phone: item.phone,
    address: item.address,
    products: item.orderItems
      .map((orderItem) => orderItem.product.name)
      .join(", "),
    totalPrice: priceFormatter(
      item.orderItems.reduce(
        (total, current) => total + Number(current.product.price),
        0
      )
    ),
    isPaid: item.isPaid,
    createdAt: format(item.createdAt, "MMM do yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardClient data={formattedOrders} />
      </div>
    </div>
  );
};

export default OrdersPage;
