import { getAllProjects } from "@/lib/portfolio-content";
import { ProjectsAdminDashboard } from "@/components/projects-admin-dashboard";

export default async function AdminProjectsPage() {
  return <ProjectsAdminDashboard initialProjects={await getAllProjects()} />;
}
