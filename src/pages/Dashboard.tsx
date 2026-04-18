import { useEffect, useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { projectAPI, type Project } from '../api/projects';
import { authStore } from '../store/authStore';
import './Dashboard.css';

interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalCost: number;
}

const mockChartData = [
  { month: 'Jan', projects: 4, activities: 24 },
  { month: 'Feb', projects: 3, activities: 21 },
  { month: 'Mar', projects: 5, activities: 29 },
  { month: 'Apr', projects: 4, activities: 25 },
  { month: 'May', projects: 6, activities: 31 },
  { month: 'Jun', projects: 5, activities: 28 },
];

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalCost: 0,
  });
  const [loading, setLoading] = useState(true);
  const user = authStore.user;

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const response = await projectAPI.getAll();
      const projectList = response.data;
      setProjects(projectList);

      const newStats: DashboardStats = {
        totalProjects: projectList.length,
        activeProjects: projectList.filter((p) => p.status === 'active').length,
        completedProjects: projectList.filter((p) => p.status === 'completed').length,
        totalCost: projectList.reduce((sum, p) => sum + p.total_cost, 0),
      };
      setStats(newStats);
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome, {user?.full_name || user?.username}</h1>
        <p>Here&apos;s an overview of your construction projects</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <p className="stat-label">Total Projects</p>
            <p className="stat-value">{stats.totalProjects}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🚀</div>
          <div className="stat-content">
            <p className="stat-label">Active Projects</p>
            <p className="stat-value">{stats.activeProjects}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <p className="stat-label">Completed</p>
            <p className="stat-value">{stats.completedProjects}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <p className="stat-label">Total Cost</p>
            <p className="stat-value">${stats.totalCost.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="charts-container">
        <div className="chart-card">
          <h3>Project Activity Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="projects" stroke="#8884d8" />
              <Line type="monotone" dataKey="activities" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Project Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="projects" fill="#8884d8" />
              <Bar dataKey="activities" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="recent-projects">
        <h3>Recent Projects</h3>
        {projects.length === 0 ? (
          <p className="no-projects">No projects yet. Create your first project to get started!</p>
        ) : (
          <div className="projects-table">
            <table>
              <thead>
                <tr>
                  <th>Project Name</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Cost</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody>
                {projects.slice(0, 5).map((project) => (
                  <tr key={project.id}>
                    <td className="project-name">{project.name}</td>
                    <td>{project.location}</td>
                    <td>
                      <span className={`status-badge status-${project.status}`}>{project.status}</span>
                    </td>
                    <td>${project.total_cost.toLocaleString()}</td>
                    <td>{project.total_duration_days} days</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
