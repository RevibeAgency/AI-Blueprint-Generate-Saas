import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import Auth from "./components/Auth";
import ProjectDashboard from "./components/ProjectDashboard";
import OnboardingModal from "./components/OnboardingModal";
import GenerateBlueprintModal from "./components/GenerateBlueprintModal";
import BlueprintReviewScreen from "./components/BlueprintReviewScreen";

function App() {
  const [session, setSession] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });
  const [editId, setEditId] = useState(null);

  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [generatedBlueprint, setGeneratedBlueprint] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        checkOnboardingStatus(session.user);
      } else {
        setLoading(false);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        if (session?.user) {
          await checkOnboardingStatus(session.user);
        } else {
          setLoading(false);
          setShowOnboarding(false);
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const checkOnboardingStatus = async (user) => {
    try {
      const onboardingCompleted = user.user_metadata?.onboarding_completed;
      if (!onboardingCompleted) {
        setShowOnboarding(true);
      }
    } catch (error) {
      console.error("Error checking onboarding status:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  const handleGenerateBlueprint = (projectId) => {
    setSelectedProjectId(projectId);
    setShowGenerateModal(true);
  };

  const handleBlueprintGenerated = (blueprintData) => {
    setGeneratedBlueprint(blueprintData);
    setShowGenerateModal(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return <Auth onAuth={() => {}} />;
  }

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white relative w-scree">
      {showOnboarding ? (
        <OnboardingModal
          user={session.user}
          onComplete={handleOnboardingComplete}
        />
      ) : generatedBlueprint ? (
        <BlueprintReviewScreen blueprint={generatedBlueprint} />
      ) : (
        <>
          <div className="flex justify-end p-4 gap-4 fixed top-0 right-0 left-0 z-10">
            <button
              className="border border-[#393E46] text-[#5f5f5f] font-medium px-6 py-2 rounded bg-[#0f0f0f] hover:bg-[#232329] transition"
              onClick={() => {
                setShowForm(true);
                setEditId(null);
                setForm({ name: "", description: "" });
              }}
            >
              Add New Project
            </button>
            <button
              onClick={handleLogout}
              className="bg-[#4D55CC] hover:bg-[#4300FF] text-white font-bold py-2 px-4 rounded"
            >
              Logout
            </button>
          </div>

          <ProjectDashboard
            showForm={showForm}
            setShowForm={setShowForm}
            form={form}
            setForm={setForm}
            editId={editId}
            setEditId={setEditId}
            onGenerateBlueprint={handleGenerateBlueprint} // ← pass handler to ProjectDashboard
          />

          {showGenerateModal && (
            <GenerateBlueprintModal
              projectId={selectedProjectId}
              onClose={() => setShowGenerateModal(false)}
              onGenerated={handleBlueprintGenerated}
            />
          )}
        </>
      )}
    </div>
  );
}

export default App;
