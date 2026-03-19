import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../api/projects";
import ProjectCard from "./ProjectCard";
import Sidebar from "./Sidebar";
import UserFlowPage from "./UserFlowPage";
import UserManagement from "./UserManagement";


export default function ProjectDashboard({
  showForm,
  setShowForm,
  form,
  setForm,
  editId,
  setEditId,
}) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('dashboard');

  // Get current user data
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDeleteProject = async (projectId) => {
    try {
      await deleteProject(projectId);
      setProjects(projects.filter(project => project.id !== projectId));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditProject = (project) => {
    setForm({ name: project.name, description: project.description });
    setEditId(project.id);
    setShowForm(true);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'user-flow':
        return <UserFlowPage />;
      case 'teams':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-white mb-4">Teams</h2>
            <p className="text-gray-400">Teams functionality coming soon...</p>
          </div>
        );
        case 'user-management':
      return <UserManagement />;
      case 'settings':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-white mb-4">Settings</h2>
            <p className="text-gray-400">Settings functionality coming soon...</p>
          </div>
        );
      default:
        return (
          <div>
            {/* Dashboard Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-white mb-2">Dashboard</h1>
                <p className="text-gray-400">Manage your SaaS projects and blueprints</p>
              </div>
            </div>

            {/* Project cards */}
            {projects.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-white mb-2">No Projects Yet</h3>
                <p className="text-gray-400 mb-6">Create your first project to get started with SaaS blueprint generation</p>
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-[#5D43FF] text-white px-6 py-3 rounded-lg hover:bg-[#4A3AFF] transition-colors"
                >
                  Create Your First Project
                </button>
              </div>
            ) : (
              <div className="flex flex-wrap gap-6 ml-0" style={{ alignItems: 'flex-start' }}>
                {projects.map(project => (
                  <div key={project.id}>
                    <ProjectCard project={project} onDelete={handleDeleteProject} onEdit={handleEditProject} />
                  </div>
                ))}
              </div>
            )}
          </div>
        );
    }
  };

  // ... keep all your project logic, forms, etc. as before

  return (
    <div className="min-h-screen bg-[#232324] flex">
      {/* Sidebar */}
      <Sidebar 
        user={user} 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage}
      />
      {/* Main Content */}
      <div className="flex-1 min-h-screen flex flex-col p-8">
        {/* Main area */}
        <main className="w-full h-full">
          {showForm && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center">
              <form
                className="bg-[#18181b] p-6 rounded-xl shadow-lg w-96"
                onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    if (editId) {
                      const updatedProject = await updateProject(editId, {
                        name: form.name,
                        description: form.description,
                      });
                      setProjects(projects.map((p) => (p.id === editId ? updatedProject : p)));
                      setEditId(null);
                    } else {
                      const newProject = await createProject({
                        name: form.name,
                        description: form.description,
                      });
                      setProjects([newProject, ...projects]);
                    }
                    setForm({ name: "", description: "" });
                    setShowForm(false);
                  } catch (err) {
                    setError(err.message);
                  }
                }}
              >
                <h2 className="text-white text-xl font-semibold mb-4">
                  {editId ? "Edit Project" : "Create New Project"}
                </h2>
                <div className="mb-4">
                  <label className="block text-white mb-1">Project Name</label>
                  <input
                    className="w-full px-3 py-2 rounded bg-[#232324] text-white border border-[#333] focus:outline-none"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-white mb-1">Description</label>
                  <textarea
                    className="w-full px-3 py-2 rounded bg-[#232324] text-white border border-[#333] focus:outline-none"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="bg-[#4285F4] text-white px-4 py-2 rounded"
                  >
                    {editId ? "Update" : "Create"}
                  </button>
                  <button
                    type="button"
                    className="bg-gray-600 text-white px-4 py-2 rounded"
                    onClick={() => {
                      setShowForm(false);
                      setEditId(null);
                      setForm({ name: "", description: "" });
                    }}
                  >
                    Cancel
                  </button>
                </div>
                {error && <div className="text-red-400 mt-2">{error}</div>}
              </form>
            </div>
          )}

          {/* Render current page content */}
          {renderCurrentPage()}
        </main>
      </div>
    </div>
  );
}