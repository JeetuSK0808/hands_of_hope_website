import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";

export const dynamic = "force-dynamic";

export default async function RootPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (!user.branch_id && user.role === "member") redirect("/join-branch");
  redirect("/dashboard");
}
