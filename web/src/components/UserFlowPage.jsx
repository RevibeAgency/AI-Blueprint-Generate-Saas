import { useState, useEffect } from 'react';
import KanbanBoard from './KanbanBoard';
import { getProjects } from '../api/projects';

export default function UserFlowPage() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data);
      if (data.length > 0) {
        setSelectedProject(data[0]);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="h-full">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">User Flow Diagram</h1>
        <p className="text-gray-400">Visualize and manage your SaaS user journey with our interactive Kanban board</p>
      </div>

      {/* Project Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-white mb-2">
          Select Project
        </label>
        <select
          value={selectedProject?.id || ''}
          onChange={(e) => {
            const project = projects.find(p => p.id === e.target.value);
            setSelectedProject(project);
          }}
          className="bg-[#18181b] border border-[#232329] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select a project...</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>

      {/* Kanban Board */}
      {selectedProject ? (
        <div className="bg-[#232324] rounded-lg p-6 border border-[#333]">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-white mb-1">{selectedProject.name}</h2>
            <p className="text-gray-400 text-sm">{selectedProject.description}</p>
          </div>
          <KanbanBoard 
            projectTitle={selectedProject.name}
            projectDescription={selectedProject.description}
          />
        </div>
      ) : (
        <div className="bg-[#18181b] rounded-lg p-8 border border-[#232329] text-center">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-white mb-2">No Project Selected</h3>
          <p className="text-gray-400">Please select a project to view its user flow diagram.</p>
        </div>
      )}
    </div>
  );
}