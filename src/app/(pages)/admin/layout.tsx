import { redirect } from "next/navigation";
import AdminClientLayout from "./AdminClientLayout";
import { getRoles } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const roles = await getRoles();
  
  // if (!roles || !Array.isArray(roles) || !roles.includes("admin")) {
  //   redirect("/unauthorized");
  // }

  return (
    <AdminClientLayout>
      {children}
    </AdminClientLayout>
  );
}
