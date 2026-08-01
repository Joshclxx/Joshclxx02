import { cookies } from "next/headers";
import { AdminLogin } from "@/components/admin-login";
import { AdminShell } from "@/components/admin-shell";
import { isValidAdminSession, PORTFOLIO_ADMIN_SESSION_COOKIE } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = cookies().get(PORTFOLIO_ADMIN_SESSION_COOKIE)?.value;
  if (!isValidAdminSession(session)) return <AdminLogin />;
  return <AdminShell>{children}</AdminShell>;
}
