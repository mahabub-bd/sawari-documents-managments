"use client";

import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import type { User } from "@/types";
import { deleteDataById } from "@/utils/apiServices";
import { serverRevalidate } from "@/utils/revalidatePath";

import ConfirmDelete from "../modal/confirm-delete";

interface UserDeleteActionProps {
  user: User;
  id: string;
}

export default function UserDeleteAction({ user, id }: UserDeleteActionProps) {
  const handleDelete = async () => {
    try {
      await deleteDataById("users", id);
      toast.success("User deleted successfully!");
      serverRevalidate("/dashboard/users");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to delete user. Please try again.";
      console.error(`Error deleting user with ID: ${id}`, message);
      toast.error(message);
    }
  };

  return (
    <ConfirmDelete
      title="Delete user"
      description={`Are you sure you want to delete user "${user.name}"? This action cannot be undone.`}
      onConfirm={handleDelete}
      trigger={
        <Button
          type="button"
          variant="outline"
          size="icon"
          title="Delete user"
          aria-label={`Delete ${user.name}`}
          className="h-8 w-8 border-border/60 text-rose-600 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700 dark:text-rose-400 dark:hover:border-rose-500/40 dark:hover:bg-rose-500/10"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
        </Button>
      }
    />
  );
}
