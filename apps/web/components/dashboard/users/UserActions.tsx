"use client";

import type { User } from "@/types";

import { UserEditAction } from "../modal/UserEditAction";
import UserDeleteAction from "./UserDeleteAction";

interface UserActionsProps {
  id: string;
  user: User;
}

const UserActions = ({ user, id }: UserActionsProps) => {
  return (
    <div className="flex items-center justify-end gap-1.5">
      <UserEditAction user={user} id={id} />
      <UserDeleteAction user={user} id={id} />
    </div>
  );
};

export default UserActions;
