"use client";

import { ColumnDef } from "@tanstack/react-table";
import CellActions from "./cell-actions";

export type OrderColumn = {
  id: string;
  phone: string;
  isPaid: boolean;
  totalPrice: string;
  shippingStatus: string;
  products: string;
  createdAt: string;
};

export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: "products",
    header: "Products",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "totalPrice",
    header: "Total Price",
  },
  {
    accessorKey: "isPaid",
    header: "Paid",
    cell: ({ row }) => (row.original.isPaid ? "Yes" : "No"),
  },
  {
    accessorKey: "shippingStatus",
    header: "Shipping Status",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellActions data={row.original} />,
  },
];
