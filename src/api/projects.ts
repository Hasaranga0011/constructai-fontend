import apiClient from './client';

export interface Project {
  id: number;
  name: string;
  description: string;
  location: string;
  start_date: string;
  end_date: string;
  total_duration_days: number;
  total_cost: number;
  status: 'draft' | 'active' | 'completed';
  boq_file_path?: string;
  schedule_data?: object;
  created_at: string;
  updated_at: string;
}

export interface ProjectCreate {
  name: string;
  description: string;
  location: string;
  start_date: string;
  end_date: string;
}

export const projectAPI = {
  getAll: () => apiClient.get<Project[]>('/projects/'),
  getById: (id: number) => apiClient.get<Project>(`/projects/${id}`),
  create: (data: ProjectCreate) => apiClient.post<Project>('/projects/', data),
  update: (id: number, data: Partial<Project>) => apiClient.put<Project>(`/projects/${id}`, data),
  delete: (id: number) => apiClient.delete(`/projects/${id}`),
  uploadBOQ: (id: number, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post(`/projects/${id}/upload-boq`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};
