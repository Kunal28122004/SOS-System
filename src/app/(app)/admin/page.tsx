import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminDashboard from "@/components/admin/AdminDashboard";
import type { Admin } from "@/lib/definitions";

async function getAdmin(): Promise<Admin | null> {
    const cookie = cookies().get('guardianangel-session');
    if (!cookie) return null;
    try {
        const session = JSON.parse(cookie.value);
        if (session.isLoggedIn && session.user.role === 'admin') {
            return session.user;
        }
        return null;
    } catch {
        return null;
    }
}


export default async function AdminPage() {
    const admin = await getAdmin();

    if (!admin) {
        redirect('/');
    }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Live monitoring of user locations and SOS alerts for ID: <code className="font-semibold text-primary">{admin.id}</code>
        </p>
      </div>
      <AdminDashboard adminId={admin.id} />
    </div>
  );
}
