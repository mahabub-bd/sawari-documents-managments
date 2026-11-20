import type { User } from "@/types";
import { fetchData } from "@/utils/apiServices";

import { UserListSearch } from "./user-list-search";

export default async function UserList() {
  let users: User[] = [];
  let error: string | null = null;

  try {
    const data = await fetchData("users");
    users = Array.isArray(data) ? data : [];
  } catch (fetchError) {
    console.error("Error loading users:", fetchError);
    error =
      "Could not load users right now. Please refresh the page or try again later.";
  }

  return <UserListSearch users={users} error={error} />;
}
