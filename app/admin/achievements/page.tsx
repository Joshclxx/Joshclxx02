import { getAllAchievements } from "@/lib/portfolio-content";
import { AchievementsAdminDashboard } from "@/components/achievements-admin-dashboard";

export default async function AdminAchievementsPage() {
  return <AchievementsAdminDashboard initialAchievements={await getAllAchievements()} />;
}
