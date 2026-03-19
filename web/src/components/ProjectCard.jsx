import { useState } from "react";
import GenerateBlueprintModal from "./GenerateBlueprintModal"; // ✅ make sure path is correct

export default function ProjectCard({ project, onEdit, onDelete }) {
  const [showModal, setShowModal] = useState(false);

  const handleGenerateClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div
      className="rounded-[15px] overflow-hidden shadow-lg bg-[#222] w-full max-w-sm flex flex-col relative"
      style={{ minHeight: 480 }}
    >
      {/* Edit/Delete Buttons */}
      <div className="absolute top-3 right-3 flex gap-2 z-10">
        <button
          onClick={() => onEdit?.(project)}
          className="p-2 bg-[#2c2c2c] hover:bg-[#3a3a3a] rounded-md text-white"
        >
          {/* Edit Icon */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
          </svg>
        </button>
        <button
          onClick={() => onDelete?.(project.id)}
          className="p-2 bg-[#2c2c2c] hover:bg-red-600 rounded-md text-white"
        >
          {/* Trash Icon */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-2 14H7L5 6" />
            <path d="M10 11v6" />
            <path d="M14 11v6" />
            <path d="M9 6V4h6v2" />
          </svg>
        </button>
      </div>

      {/* Top section */}
      <div className="relative h-40 bg-[#5D5CFF]">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <rect width="100" height="100" fill="#5D5CFF" />
          <polygon points="10,10 40,10 70,100 40,100" fill="#D9D9D9" />
          <polygon points="50,10 80,10 110,100 80,100" fill="#D9D9D9" />
        </svg>

        <div className="absolute left-8 -bottom-10 w-20 h-20 rounded-xl bg-[#5D5CFF] border-2 border-black flex items-center justify-center shadow-lg">
          <svg width="40" height="40" viewBox="0 0 40 40">
            <rect width="40" height="40" rx="12" fill="#5D5CFF" />
            <ellipse cx="15" cy="20" rx="6" ry="9" fill="#18181b" />
            <ellipse cx="27" cy="20" rx="6" ry="9" fill="#18181b" />
          </svg>
        </div>
      </div>

      {/* Bottom section */}
      <div className="flex-1 bg-[#222] pt-16 pb-8 px-8 flex flex-col">
        <div className="text-3xl font-semibold text-white mb-2">
          {project.name || "Project Name"}
        </div>
        <div className="text-[#888] mb-4 text-lg">
          Created on{" "}
          {project.created_at
            ? new Date(project.created_at).toLocaleDateString()
            : "xxxxxxx"}
        </div>
        <div className="text-[#888] text-lg mb-8">
          {project.description || "Descriptions"}
        </div>

        <div className="mt-auto flex gap-4 flex-wrap">
          {/* Analytics */}
          <button className="flex-1 flex items-center justify-center gap-2 bg-[#292929] hover:bg-[#333] text-[#ccc] text-base font-medium py-2 rounded-lg transition">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="12" width="3" height="6" rx="1" />
              <rect x="8.5" y="8" width="3" height="10" rx="1" />
              <rect x="15" y="4" width="3" height="14" rx="1" />
            </svg>
            Analytics
          </button>

          {/* Flow */}
          <button className="flex-1 flex items-center justify-center gap-2 bg-[#292929] hover:bg-[#333] text-[#ccc] text-base font-medium py-2 rounded-lg transition">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="9" width="16" height="2" rx="1" />
              <rect x="2" y="15" width="12" height="2" rx="1" />
            </svg>
            Flow
          </button>

          {/* Tasks */}
          <button className="flex-1 flex items-center justify-center gap-2 bg-[#292929] hover:bg-[#333] text-[#ccc] text-base font-medium py-2 rounded-lg transition">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="14" height="12" rx="2" />
              <path d="M7 8h6M7 12h4" />
            </svg>
            Tasks
          </button>

          {/* ✅ Generate */}
          <button
            onClick={handleGenerateClick}
            className="flex-1 flex items-center justify-center gap-2 bg-[#5715FD] hover:bg-[#4D55CC] text-white text-base font-medium py-2 rounded-lg transition"
          >
            Generate
          </button>
        </div>
      </div>

      {/* ✅ Modal */}
      {showModal && (
     <GenerateBlueprintModal
     project={project}
     onClose={() => setShowModal(false)}
   />
   
      )}
    </div>
  );
}