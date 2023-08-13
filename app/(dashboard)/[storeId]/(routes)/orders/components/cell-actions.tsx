"use client";

import { useState } from "react";
import {
  ArrowLeftRight,
  ArrowRightLeft,
  Copy,
  Edit,
  MoreHorizontal,
  Trash,
  X,
  XCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

import { OrderColumn } from "./columns";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { AlertModal } from "@/components/modals/alert-modal";

interface CellActionsProps {
  data: OrderColumn;
}

type shippingStatus = "PENDING" | "INPROGRESS" | "COMPLETE" | "CANCELLED";

const CellActions: React.FC<CellActionsProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const router = useRouter();
  const params = useParams();

  const onChangeShippingStatus = async (newStatus: shippingStatus) => {
    if (newStatus === data.shippingStatus) return;
    try {
      setLoading(true);

      await axios.patch(`/api/${params.storeId}/orders/${data.id}`, {
        shippingStatus: newStatus,
      });

      router.refresh();
      router.push(`/${params.storeId}/orders`);
      toast.success(`Order ${newStatus.toLowerCase()}.`);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="h-8 w-8 p-0" variant={"ghost"}>
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => onChangeShippingStatus("INPROGRESS")}
          >
            <ArrowLeftRight className="h-4 w-4 mr-2" />
            Move to in progress
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onChangeShippingStatus("COMPLETE")}>
            <ArrowRightLeft className="h-4 w-4 mr-2" />
            Move to complete
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onChangeShippingStatus("CANCELLED")}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default CellActions;
