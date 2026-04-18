import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Upload } from 'lucide-react';
import { projectAPI, type Project } from '../api/projects';
import './Projects.css';

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    start_date: '',
    end_date: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const response = await projectAPI.getAll();
      setProjects(response.data);
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await projectAPI.create(formData);
      setProjects([...projects, response.data]);
      setShowForm(false);
      setFormData({
        name: '',
        description: '',
        location: '',
        start_date: '',
        end_date: '',
      });
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  const handleDeleteProject = async (id: number) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        await projectAPI.delete(id);
        setProjects(projects.filter((p) => p.id !== id));
      } catch (error) {
        console.error('Failed to delete project:', error);
      }
    }
  };

  const handleProjectClick = (projectId: number) => {
    navigate(`/projects/${projectId}`);
  };

  if (loading) {
    return <div className="loading">Loading projects...</div>;
  }

  return (
    <div className="projects-page">
      <div className="projects-header">
        <h1>Projects</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          <Plus size={20} />
          New Project
        </button>
      </div>

      {showForm && (
        <div className="form-container">
          <h3>Create New Project</h3>
          <form onSubmit={handleCreateProject} className="project-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Project Name</label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter project name"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="location">Location</label>
                <input
                  id="location"
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Enter project location"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter project description"
                rows={3}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="start_date">Start Date</label>
                <input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="end_date">End Date</label>
                <input
                  id="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-buttons">
              <button type="submit" className="btn-success">
                Create Project
              </button>
              <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="projects-grid">
        {projects.length === 0 ? (
          <div className="no-projects">
            <p>No projects found. Create your first project to get started!</p>
          </div>
        ) : (
          projects.map((project) => (
            <div key={project.id} className="project-card" onClick={() => handleProjectClick(project.id)}>
              <div className="project-header">
                <h3>{project.name}</h3>
                <span className={`status-badge status-${project.status}`}>{project.status}</span>
              </div>

              <p className="project-description">{project.description}</p>

              <div className="project-info">
                <div className="info-item">
                  <span className="label">Location</span>
                  <span className="value">{project.location}</span>
                </div>
                <div className="info-item">
                  <span className="label">Cost</span>
                  <span className="value">${project.total_cost}</span>
                </div>
                <div className="info-item">
                  <span className="label">Duration</span>
                  <span className="value">{project.total_duration_days} days</span>
                </div>
              </div>

              <div className="project-actions" onClick={(e) => e.stopPropagation()}>
                <button className="action-btn edit" title="Edit">
                  <Edit2 size={18} />
                </button>
                <button className="action-btn upload" title="Upload BOQ">
                  <Upload size={18} />
                </button>
                <button
                  className="action-btn delete"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDeleteProject(project.id);
                  }}
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
