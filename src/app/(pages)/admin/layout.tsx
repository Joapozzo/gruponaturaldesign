import { redirect } from "next/navigation";
import AdminClientLayout from "./AdminClientLayout";
import { getRoles } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const roles = await getRoles();
  const isAdmin = roles?.includes("ADMIN") ?? false;

  if (!isAdmin) {
    redirect("/auth/error?error=AccessDenied");
  }

  return (
    <AdminClientLayout>
      {children}
    </AdminClientLayout>
  );
}
