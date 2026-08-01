import { getPortfolioProfile } from "@/lib/portfolio-content";
import { ProfileAdminForm } from "@/components/profile-admin-form";

export default async function AdminProfilePage() {
  return <section aria-labelledby="profile-admin-heading"><h2 id="profile-admin-heading" className="mb-1 text-xl font-semibold text-foreground">Profile</h2><p className="mb-6 text-sm text-muted-foreground">Update the profile content shown on the public portfolio.</p><div className="gh-card p-5 sm:p-6"><ProfileAdminForm initialProfile={await getPortfolioProfile()} /></div></section>;
}
