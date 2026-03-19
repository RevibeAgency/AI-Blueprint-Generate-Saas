import React, { useState } from "react";
import ManageRoles from "./ManageRoles";

const initialGroups = [
  { name: "Administration", status: "Active", type: "Owner" },
  { name: "Human Resources", status: "Active", type: "Owner" },
  { name: "Bank-Office", status: "Active", type: "Owner" },
  { name: "Billing", status: "Active", type: "Owner" },
  { name: "Social Media", status: "Active", type: "Owner" },
  { name: "Random", status: "Active", type: "Owner" },
];

export default function UserManagementContainer() {
  const [showRoles, setShowRoles] = useState(false);
  const [savedRoles, setSavedRoles] = useState([]);

  return showRoles ? (
    <ManageRoles
      onGoBack={() => setShowRoles(false)}
      onRolesUpdate={(updatedRoles) => setSavedRoles(updatedRoles)}
      initialRoles={savedRoles.length > 0 ? savedRoles : undefined}
    />
  ) : (
    <UserManagement
      onManageRolesClick={() => setShowRoles(true)}
      roles={savedRoles}
    />
  );
}

function UserManagement({ onManageRolesClick, roles }) {
  const [groups, setGroups] = useState(initialGroups);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");

  const handleSearch = (e) => setSearchTerm(e.target.value);
  const handleTypeFilter = (e) => setFilterType(e.target.value);

  const handleCreateGroup = () => {
    const name = prompt("Enter group name:");
    if (name) {
      setGroups([...groups, { name, status: "Active", type: "Owner" }]);
    }
  };

  // Get member count from roles
  const getMemberCount = (groupName) => {
    const role = roles.find((r) => r.name === groupName);
    return role?.members?.length || 0;
  };

  const filteredGroups = groups.filter((group) => {
    const matchesSearch = group.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType = filterType === "All" || group.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="text-white px-16 py-10 w-full font-sans flex flex-col h-full">
      <h1 className="text-2xl font-semibold mb-1">User Management</h1>
      <p className="text-gray-500 text-sm mb-6">
        Workspace &gt; <span className="text-white">Manage Groups</span>
      </p>

      {/* Controls */}
      <div className="flex justify-between items-center mb-8 text-sm">
        <div className="flex gap-12 items-center">
          <button className="flex items-center gap-2 text-gray-400">
            <svg
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 6.75h15m-15 5.25h15m-15 5.25h15"
              />
            </svg>
            Manage Groups
          </button>
          <div className="flex items-center gap-2 text-gray-400">
            <svg
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M17.5 10.5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search for Groups"
              className="bg-transparent border-b border-gray-600 focus:outline-none text-white placeholder-gray-500"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <button
            className="flex items-center gap-2 text-gray-400"
            onClick={onManageRolesClick}
          >
            <svg
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6l4 2"
              />
            </svg>
            Manage Roles
          </button>
        </div>

        <select
          value={filterType}
          onChange={handleTypeFilter}
          className="bg-black border border-gray-600 rounded px-3 py-1 text-white"
        >
          <option>All</option>
          <option>Owner</option>
        </select>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-4 font-semibold text-gray-500 text-sm border-b border-gray-700 pb-2 mb-4">
        <div>Groups</div>
        <div>Group Status</div>
        <div>Group Type</div>
        <div>Member Count</div>
      </div>

      {/* Group List */}
      <div className="grid gap-3">
        {filteredGroups.map((group, index) => {
          const count = getMemberCount(group.name);
          return (
            <div
              key={index}
              className="grid grid-cols-4 items-center py-4 border-b border-gray-800 text-normal"
            >
              <div className="font-medium text-white">{group.name}</div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
                <span>{group.status}</span>
              </div>
              <div>
                <span className="border border-gray-500 rounded-full px-3 py-1 flex w-fit">
                  {group.type}
                </span>
              </div>
              <div className="font-semibold">{count} Members</div>
            </div>
          );
        })}
      </div>

      {/* Create Button */}
      <div className="mt-auto ml-auto">
        <button
          className="bg-white text-black px-4 py-2 rounded text-sm font-medium shadow"
          onClick={handleCreateGroup}
        >
          Create Groups
        </button>
      </div>
    </div>
  );
}
