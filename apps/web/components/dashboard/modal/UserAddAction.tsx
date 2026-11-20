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
} from "@/components/ui/dialog";

import UserAddForm from "../users/UserAddForm";

export function UserAddAction() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="gap-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-sm hover:from-violet-600 hover:to-fuchsia-600"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
        Add user
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle>Add new user</DialogTitle>
            <DialogDescription>
              Create an account and assign the right access level.
            </DialogDescription>
          </DialogHeader>

          <UserAddForm isOpen={setIsOpen} />
        </DialogContent>
      </Dialog>
    </>
  );
}
