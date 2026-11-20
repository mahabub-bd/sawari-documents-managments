"use client";

import { Pencil } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { User } from "@/types";

import UserEditForm from "../users/UserEditForm";

interface UserEditActionProps {
  user: User;
  id: string;
}

export function UserEditAction({ user, id }: UserEditActionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        size="icon"
        aria-label={`Edit ${user.name}`}
        className="h-8 w-8 border-border/60 text-violet-600 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 dark:text-violet-400 dark:hover:border-violet-500/40 dark:hover:bg-violet-500/10"
      >
        <Pencil className="h-4 w-4" aria-hidden="true" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle>Edit user</DialogTitle>
            <DialogDescription>
              Update the account details and role for {user.name}.
            </DialogDescription>
          </DialogHeader>
          <UserEditForm user={user} isOpen={setIsOpen} id={id} />
        </DialogContent>
      </Dialog>
    </>
  );
}
