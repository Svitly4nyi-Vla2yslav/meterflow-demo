import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/AppLayout';
import { ToastProvider } from './components/Toast';
import { DashboardPage } from './pages/DashboardPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { ProjectCreatePage } from './pages/ProjectCreatePage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { ProjectEditPage } from './pages/ProjectEditPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { TasksPage } from './pages/TasksPage';

export default function App() {
  return <ToastProvider><AppLayout><Routes>
    <Route path="/" element={<Navigate to="/dashboard" replace />} />
    <Route path="/dashboard" element={<DashboardPage />} />
    <Route path="/projects" element={<ProjectsPage />} />
    <Route path="/projects/new" element={<ProjectCreatePage />} />
    <Route path="/projects/:id" element={<ProjectDetailPage />} />
    <Route path="/projects/:id/edit" element={<ProjectEditPage />} />
    <Route path="/tasks" element={<TasksPage />} />
    <Route path="/documents" element={<DocumentsPage />} />
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Routes></AppLayout></ToastProvider>;
}
