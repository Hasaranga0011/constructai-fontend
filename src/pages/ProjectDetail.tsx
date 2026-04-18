import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Download } from 'lucide-react';
import { projectAPI, type Project } from '../api/projects';
import './ProjectDetail.css';

interface Activity {
  id: number;
  code: string;
  name: string;
  duration: number;
  early_start: number;
  early_finish: number;
  late_start: number;
  late_finish: number;
  total_float: number;
  is_critical: boolean;
  quantity: number;
  unit: string;
  unit_cost: number;
  total_cost: number;
}

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingBoQ, setUploadingBoQ] = useState(false);

  useEffect(() => {
    if (id) {
      loadProject();
    }
  }, [id]);

  const loadProject = async () => {
    try {
      const projectId = parseInt(id || '0', 10);
      const response = await projectAPI.getById(projectId);
      setProject(response.data);
      // Load activities here if endpoint available
    } catch (error) {
      console.error('Failed to load project:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBOQUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !project) return;

    setUploadingBoQ(true);
    try {
      await projectAPI.uploadBOQ(project.id, file);
      // Reload project to get updated data
      await loadProject();
    } catch (error) {
      console.error('Failed to upload BOQ:', error);
    } finally {
      setUploadingBoQ(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading project details...</div>;
  }

  if (!project) {
    return <div className="error">Project not found</div>;
  }

  return (
    <div className="project-detail">
      <div className="detail-header">
        <button className="btn-back" onClick={() => navigate('/projects')}>
          <ArrowLeft size={20} />
          Back to Projects
        </button>
        <h1>{project.name}</h1>
      </div>

      <div className="detail-content">
        <div className="detail-section">
          <h3>Project Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Status</label>
              <span className={`status-badge status-${project.status}`}>{project.status}</span>
            </div>
            <div className="info-item">
              <label>Location</label>
              <span>{project.location}</span>
            </div>
            <div className="info-item">
              <label>Total Cost</label>
              <span>${project.total_cost.toLocaleString()}</span>
            </div>
            <div className="info-item">
              <label>Total Duration</label>
              <span>{project.total_duration_days} days</span>
            </div>
          </div>

          <div className="description-section">
            <label>Description</label>
            <p>{project.description}</p>
          </div>

          <div className="dates-section">
            <div className="info-item">
              <label>Start Date</label>
              <span>{new Date(project.start_date).toLocaleDateString()}</span>
            </div>
            <div className="info-item">
              <label>End Date</label>
              <span>{new Date(project.end_date).toLocaleDateString()}</span>
            </div>
            <div className="info-item">
              <label>Created</label>
              <span>{new Date(project.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="detail-section">
          <h3>Bill of Quantities (BOQ)</h3>
          <div className="boq-section">
            {project.boq_file_path ? (
              <div className="boq-info">
                <p>BOQ File Uploaded</p>
                <div className="file-info">
                  <span>{project.boq_file_path}</span>
                  <button className="btn-download">
                    <Download size={18} />
                    Download
                  </button>
                </div>
              </div>
            ) : (
              <p className="no-boq">No BOQ file uploaded yet</p>
            )}

            <div className="boq-upload">
              <label htmlFor="boq-upload" className="upload-label">
                <Upload size={20} />
                <span>{uploadingBoQ ? 'Uploading...' : 'Upload BOQ File'}</span>
              </label>
              <input
                id="boq-upload"
                type="file"
                accept=".xlsx,.xls"
                onChange={handleBOQUpload}
                disabled={uploadingBoQ}
                style={{ display: 'none' }}
              />
              <p className="upload-note">Supported formats: .xlsx, .xls</p>
            </div>
          </div>
        </div>

        <div className="detail-section">
          <h3>Project Activities</h3>
          {activities.length === 0 ? (
            <p className="no-activities">No activities defined. Upload a BOQ file to generate activities.</p>
          ) : (
            <div className="activities-table">
              <table>
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Activity Name</th>
                    <th>Duration</th>
                    <th>Early Start</th>
                    <th>Early Finish</th>
                    <th>Critical</th>
                    <th>Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {activities.map((activity) => (
                    <tr key={activity.id} className={activity.is_critical ? 'critical' : ''}>
                      <td>{activity.code}</td>
                      <td>{activity.name}</td>
                      <td>{activity.duration}</td>
                      <td>{activity.early_start}</td>
                      <td>{activity.early_finish}</td>
                      <td>
                        <span className={activity.is_critical ? 'critical-yes' : 'critical-no'}>
                          {activity.is_critical ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td>${activity.total_cost.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="detail-section">
          <h3>Gantt Chart</h3>
          <div className="gantt-placeholder">
            <p>Gantt chart visualization will be displayed here once activities are added</p>
          </div>
        </div>
      </div>
    </div>
  );
}
