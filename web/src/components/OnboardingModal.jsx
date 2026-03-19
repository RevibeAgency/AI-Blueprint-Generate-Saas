import { useState } from "react";
import { supabase } from "../supabaseClient";

export default function OnboardingModal({ user, onComplete }) {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState("");
  const [teamName, setTeamName] = useState("");
  const [teamMembers, setTeamMembers] = useState([]);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const roles = [
    { id: "founder", label: "Founder/CEO", description: "Leading the startup vision" },
    { id: "developer", label: "Developer", description: "Building the product" },
    { id: "designer", label: "Designer", description: "Creating user experiences" },
    { id: "marketer", label: "Marketer", description: "Growing the business" },
    { id: "other", label: "Other", description: "Custom role" }
  ];

  // Function to get role display name
  const getRoleDisplayName = (roleId) => {
    const role = roles.find(r => r.id === roleId);
    return role ? role.label : roleId;
  };

  const handleAddTeamMember = () => {
    if (newMemberEmail && !teamMembers.includes(newMemberEmail)) {
      setTeamMembers([...teamMembers, newMemberEmail]);
      setNewMemberEmail("");
    }
  };

  const handleRemoveTeamMember = (email) => {
    setTeamMembers(teamMembers.filter(member => member !== email));
  };

  const handleComplete = async () => {
    setLoading(true);
    setError("");
    
    try {
      // Update user profile with role and team info
      const { error } = await supabase.auth.updateUser({
        data: {
          role: getRoleDisplayName(role),
          team_name: teamName,
          team_members: teamMembers,
          onboarding_completed: true,
          display_name: teamName || user.email?.split('@')[0] || 'User'
        }
      });

      if (error) throw error;
      
      // Create a default project for the user
      const { error: projectError } = await supabase
        .from('projects')
        .insert([{
          name: teamName || 'My First Project',
          description: 'Welcome to SaaSgenius! This is your first project.',
          status: 'active',
          owner_id: user.id
        }]);

      if (projectError) throw projectError;

      onComplete();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = async () => {
    setLoading(true);
    try {
      await supabase.auth.updateUser({
        data: {
          onboarding_completed: true
        }
      });
      onComplete();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-[#18181b] rounded-2xl shadow-2xl p-6 sm:p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">
            Welcome to SaaSgenius!
          </h2>
          <p className="text-[#a1a1aa] text-sm">
            Let's set up your profile to get started
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-[#a1a1aa] mb-2">
            <span>Step {step} of 2</span>
            <span>{step === 1 ? 'Role' : 'Team'}</span>
          </div>
          <div className="w-full bg-[#232329] rounded-full h-2">
            <div 
              className="bg-[#4300FF] h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 2) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step 1: Role Selection */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">What's your role?</h3>
            <div className="space-y-3">
              {roles.map((roleOption) => (
                <button
                  key={roleOption.id}
                  onClick={() => setRole(roleOption.id)}
                  className={`w-full p-4 rounded-lg border-2 transition-all ${
                    role === roleOption.id
                      ? 'border-[#4300FF] bg-[#4300FF] bg-opacity-10'
                      : 'border-[#232329] bg-[#232329] hover:border-[#4D55CC]'
                  }`}
                >
                  <div className="text-left">
                    <div className="font-medium text-white">{roleOption.label}</div>
                    <div className="text-sm text-[#a1a1aa]">{roleOption.description}</div>
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={() => setStep(2)}
              disabled={!role}
              className="w-full bg-[#4300FF] hover:bg-[#4D55CC] disabled:bg-[#232329] disabled:text-[#a1a1aa] text-white font-bold py-3 px-4 rounded-lg transition"
            >
              Continue
            </button>
          </div>
        )}

        {/* Step 2: Team Setup */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Team Setup (Optional)</h3>
            
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Team/Company Name
              </label>
              <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="Enter your team name"
                className="w-full p-3 rounded-lg bg-[#232329] text-white border border-transparent focus:border-[#4300FF] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Add Team Members (Optional)
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="email"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  placeholder="team@example.com"
                  className="flex-1 p-3 rounded-lg bg-[#232329] text-white border border-transparent focus:border-[#4300FF] focus:outline-none"
                />
                <button
                  onClick={handleAddTeamMember}
                  disabled={!newMemberEmail}
                  className="px-4 py-3 bg-[#4300FF] hover:bg-[#4D55CC] disabled:bg-[#232329] text-white rounded-lg transition"
                >
                  Add
                </button>
              </div>
              
              {teamMembers.length > 0 && (
                <div className="space-y-2">
                  {teamMembers.map((email, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-[#232329] rounded-lg">
                      <span className="text-white text-sm">{email}</span>
                      <button
                        onClick={() => handleRemoveTeamMember(email)}
                        className="text-red-400 hover:text-red-300"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setStep(1)}
                className="flex-1 bg-[#232329] hover:bg-[#2a2a2a] text-white font-bold py-3 px-4 rounded-lg transition"
              >
                Back
              </button>
              <button
                onClick={handleComplete}
                disabled={loading}
                className="flex-1 bg-[#4300FF] hover:bg-[#4D55CC] text-white font-bold py-3 px-4 rounded-lg transition"
              >
                {loading ? 'Setting up...' : 'Complete Setup'}
              </button>
            </div>
            
            <button
              onClick={handleSkip}
              disabled={loading}
              className="w-full text-[#a1a1aa] hover:text-white text-sm underline"
            >
              Skip for now
            </button>
          </div>
        )}

        {error && (
          <div className="text-red-500 text-sm mt-4 text-center">{error}</div>
        )}
      </div>
    </div>
  );
}