import React, { useState, useEffect } from "react";

const initialRoles = [
  { name: "Administration", members: [] },
  { name: "Human Resources", members: [] },
  { name: "Bank-Office", members: [] },
  { name: "Social Media", members: [] },
  { name: "Billing", members: [] },
  { name: "Random", members: [] },
];

export default function ManageRoles({ onGoBack, onRolesUpdate, initialRoles }) {
  const defaultRoles = [
    { name: "Administration", members: [] },
    { name: "Human Resources", members: [] },
    { name: "Bank-Office", members: [] },
    { name: "Social Media", members: [] },
    { name: "Billing", members: [] },
    { name: "Random", members: [] },
  ];

  const [roles, setRoles] = useState(initialRoles || defaultRoles);
  const [searchTerm, setSearchTerm] = useState(""); // ✅ add this
  const [filterType, setFilterType] = useState("All");

  useEffect(() => {
    if (onRolesUpdate) {
      onRolesUpdate(roles);
    }
  }, [roles]);

  const handleSearch = (e) => setSearchTerm(e.target.value);
  const handleTypeFilter = (e) => setFilterType(e.target.value);

  const handleAddMember = (roleName) => {
    const email = prompt("Enter member's email:");
    if (email) {
      setRoles((prev) =>
        prev.map((role) =>
          role.name === roleName
            ? { ...role, members: [...role.members, email] }
            : role
        )
      );
    }
  };

  const handleRemoveMember = (roleName, memberIndex) => {
    setRoles((prev) =>
      prev.map((role) =>
        role.name === roleName
          ? {
              ...role,
              members: role.members.filter((_, i) => i !== memberIndex),
            }
          : role
      )
    );
  };

  const handleEditMember = (roleName, memberIndex) => {
    const newEmail = prompt("Update member's email:");
    if (newEmail) {
      setRoles((prev) =>
        prev.map((role) =>
          role.name === roleName
            ? {
                ...role,
                members: role.members.map((email, i) =>
                  i === memberIndex ? newEmail : email
                ),
              }
            : role
        )
      );
    }
  };

  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const roleColor = {
    Administration: "border-blue-700 text-blue-300",
    "Human Resources": "border-yellow-700 text-yellow-300",
    "Bank-Office": "border-red-700 text-red-300",
    "Social Media": "border-purple-700 text-purple-300",
    "Billing": "border-purple-700 text-purple-300",
    "Random": "border-purple-700 text-purple-300",
  };

  return (
    <div className="text-white px-16 py-10 w-full font-sans flex flex-col h-full bg-black">
      <h1 className="text-2xl font-semibold mb-1">User Management</h1>
      <p className="text-gray-500 text-sm mb-6">
        Workspace &gt; <span className="text-white">Manage Roles</span>
      </p>

      {/* Controls */}
      <div className="flex justify-between items-center mb-8 text-sm">
        <div className="flex gap-12 items-center">
          {/* Search */}
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
              placeholder="Search for Roles"
              className="bg-transparent border-b border-gray-600 focus:outline-none text-white placeholder-gray-500"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>

          {/* Go Back */}
          <button
            className="flex items-center gap-2 text-gray-400"
            onClick={onGoBack}
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
                d="M4.5 6.75h15m-15 5.25h15m-15 5.25h15"
              />
            </svg>
            Go Back
          </button>
        </div>

        {/* Role Filter (placeholder) */}
        <select
          value={filterType}
          onChange={handleTypeFilter}
          className="bg-black border border-gray-600 rounded px-3 py-1 text-white"
        >
          <option>All</option>
        </select>
      </div>

      {/* Roles Table */}
      <div className="w-full border border-gray-700 rounded overflow-hidden">
        {filteredRoles.map((role, index) => (
          <div
            key={index}
            className="grid grid-cols-3 items-center border-b border-gray-800 py-6 px-4"
          >
            {/* Role Name with count */}
            <div>
              <span
                className={`border px-3 py-1 rounded ${
                  roleColor[role.name] || "border-gray-600 text-white"
                }`}
              >
                {role.name} ({role.members.length})
              </span>
            </div>

            {/* Members List */}
            <div className="flex gap-2 flex-wrap">
              {role.members.map((member, i) => (
                <span
                  key={i}
                  className="border border-gray-500 rounded-full px-3 py-1 text-sm text-white bg-black flex items-center gap-2"
                >
                  {member}
                  <button
                    onClick={() => handleEditMember(role.name, i)}
                    className="text-blue-400 hover:text-blue-600"
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleRemoveMember(role.name, i)}
                    className="text-red-500 hover:text-red-700"
                    title="Remove"
                  >
                    ❌
                  </button>
                </span>
              ))}
            </div>

            {/* Add Members Button */}
            <div className="flex justify-end">
              <button
                onClick={() => handleAddMember(role.name)}
                className="border border-white px-3 py-1 rounded text-white text-sm"
              >
                + Add members
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
