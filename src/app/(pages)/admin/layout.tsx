import { redirect } from "next/navigation";
import AdminClientLayout from "./AdminClientLayout";
import { getCurrentSession } from "@/lib/auth";

/**
 * Layout estricto para panel admin. Solo rol ADMIN puede estar aquí.
 * Usuarios sin sesión (invitados) → login. Usuarios con sesión pero sin rol ADMIN → acceso denegado.
 * Las rutas públicas y las de auth para USER/invitados no deben renderar este layout.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/auth/login");
  }

  const isAdmin =
    session.role === "ADMIN" ||
    (Array.isArray(session.role) && session.role.includes("ADMIN"));

  if (!isAdmin) {
    redirect("/auth/error?error=AccessDenied");
  }

  return (
    <AdminClientLayout>
      {children}
    </AdminClientLayout>
  );
}
