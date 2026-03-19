export default function Sidebar({ user, role, currentPage, setCurrentPage }) {
  return (
    <aside className="hidden md:flex flex-col w-64 h-screen bg-[#111] p-6 justify-between z-20">
      <div>
        {/* Profile Card */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-xl bg-[#5D43FF] flex items-center justify-center text-2xl font-bold text-white">
            {user?.name?.[0] || "M"}
          </div>
          <div>
            <div className="text-xs text-[#a1a1aa]">{role || "Team"}</div>
            <div className="font-semibold text-white">{user?.name || "Username"}</div>
            <div className="text-xs text-[#a1a1aa]">{user?.user_metadata?.role || "CEO"}</div>
          </div>
        </div>
        {/* Search */}
        <input
          className="w-full mb-6 p-2 rounded bg-[#18181b] text-white text-sm border border-[#232329] focus:outline-none"
          placeholder="Search"
        />
        {/* Navigation */}
        <nav className="flex flex-col gap-2">
          <button 
            onClick={() => setCurrentPage('dashboard')}
            className={`text-left py-2 px-3 rounded transition-colors ${
              currentPage === 'dashboard' 
                ? 'bg-[#5D43FF] text-white' 
                : 'text-white hover:bg-[#232329]'
            }`}
          >
            Dashboard
          </button>           
          <button 
            onClick={() => setCurrentPage('user-flow')}
            className={`text-left py-2 px-3 rounded transition-colors ${
              currentPage === 'user-flow' 
                ? 'bg-[#5D43FF] text-white' 
                : 'text-white hover:bg-[#232329]'
            }`}
          >
            User Flow
          </button>
          <button 
            onClick={() => setCurrentPage('user-management')}
            className={`text-left py-2 px-3 rounded transition-colors ${
              currentPage === 'teams' 
                ? 'bg-[#5D43FF] text-white' 
                : 'text-white hover:bg-[#232329]'
            }`}
          >
            Teams
          </button>
          <button 
            onClick={() => setCurrentPage('settings')}
            className={`text-left py-2 px-3 rounded transition-colors ${
              currentPage === 'settings' 
                ? 'bg-[#5D43FF] text-white' 
                : 'text-white hover:bg-[#232329]'
            }`}
          >
            Setting
          </button>
        </nav>
      </div>
      {/* Settings/Logo at bottom */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-[#232329] flex items-center justify-center text-white text-lg font-bold">s</div>
        <span className="text-[#a1a1aa] text-xs"> </span>
      </div>
    </aside>
  );
}