"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import BikeAddForm from "../bike-information/bike-add-form";

interface BikeAddActionProps {
  onCreated?: () => void;
}

export const BikeAddAction = ({ onCreated }: BikeAddActionProps) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        if (!value) onCreated?.();
      }}
    >
      <DialogTrigger asChild>
        <Button className="gap-2 bg-gradient-to-r from-sky-500 to-sky-500 text-white shadow-sm hover:from-sky-600 hover:to-sky-600">
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add bike
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-xl p-5 sm:max-w-[920px] sm:p-6">
        <DialogHeader>
          <DialogTitle>Add new bike information</DialogTitle>
          <DialogDescription>
            Fill in the seller, bike, witness, and transaction details to create
            a new document.
          </DialogDescription>
        </DialogHeader>

        <BikeAddForm isOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
};

export default BikeAddAction;
