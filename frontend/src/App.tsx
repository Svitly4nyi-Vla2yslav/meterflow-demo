import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/AppLayout';
import { DashboardPage } from './pages/DashboardPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { TasksPage } from './pages/TasksPage';

export default function App() {
  return <AppLayout><Routes><Route path="/" element={<Navigate to="/dashboard" replace />} /><Route path="/dashboard" element={<DashboardPage />} /><Route path="/projects" element={<ProjectsPage />} /><Route path="/projects/:id" element={<ProjectDetailPage />} /><Route path="/tasks" element={<TasksPage />} /><Route path="*" element={<Navigate to="/dashboard" replace />} /></Routes></AppLayout>;
}
