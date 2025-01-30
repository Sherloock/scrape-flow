import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { toast } from "sonner";

export function checkAuth() {
  const { userId } = auth();
  if (!userId) {
    redirect("/sign-in?error=authentication_required");
  }
  return userId;
}
