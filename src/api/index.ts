// Re-export all API services for easier imports
import { authAPI } from './auth';
import { projectAPI } from './projects';

export { default as apiClient } from './client';
export * from './auth';
export * from './projects';

// Combine all APIs into a single export
export const api = {
  auth: authAPI,
  projects: projectAPI,
};
