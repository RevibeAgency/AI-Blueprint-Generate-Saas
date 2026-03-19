import { useState, useEffect } from "react";
import { generateBlueprint } from "../api/openai.js";

export default function GenerateBlueprintModal({ project, onClose }) {
  const [title, setTitle] = useState(project.name || "");
  const [description, setDescription] = useState(project.description || "");
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stepsCompleted, setStepsCompleted] = useState(0);
  const [blueprint, setBlueprint] = useState(null);
  const [error, setError] = useState(null);
  const [step, setStep] = useState("form"); // form | generating | result

  const steps = [
    "Analyzing project description",
    "Generating project name",
    "Evaluation market feasibility",
    "Identifying core feature",
    "Determining technical requirement",
    "Creating development roadmap",
    "Generating improvement suggestion",
  ];

  // Simulate progress and call OpenAI API
  useEffect(() => {
    if (isGenerating && stepsCompleted < steps.length) {
      const timer = setTimeout(() => {
        setStepsCompleted((prev) => prev + 1);
        setProgress(Math.round(((stepsCompleted + 1) / steps.length) * 100));
      }, 1000); // 1 second per step
      return () => clearTimeout(timer);
    }

    // When progress reaches 100%, call OpenAI API
    if (isGenerating && progress >= 100 && !blueprint && !error) {
      console.log("Progress reached 100%, calling OpenAI API...");
      callOpenAI();
    }
  }, [
    isGenerating,
    stepsCompleted,
    progress,
    blueprint,
    error,
    title,
    description,
  ]);

  const callOpenAI = async () => {
    try {
      console.log("Calling OpenAI API...");
      setError(null);
      const result = await generateBlueprint(title, description);

      console.log("OpenAI API result:", result);

      if (result.error) {
        setError(result.error);
        setStep("form");
      } else {
        setBlueprint(result);
        setStep("result");
      }
    } catch (err) {
      console.error("OpenAI API Error:", err);

      // Handle specific error types
      if (err.message.includes("Rate limit exceeded")) {
        setError(
          "Rate limit exceeded. Please wait 1 minute and try again, or check your OpenAI account usage."
        );
      } else if (err.message.includes("Invalid API key")) {
        setError(
          "Invalid API key. Please check your .env file and ensure VITE_OPENAI_API_KEY is set correctly."
        );
      } else {
        setError(err.message);
      }

      // Show demo blueprint for testing purposes
      if (
        err.message.includes("Rate limit exceeded") ||
        err.message.includes("Invalid API key")
      ) {
        const demoBlueprint = {
          marketFeasibility: {
            overallScore: "8.3/10",
            metrics: [
              { name: "Uniqueness", score: 8, maxScore: 10 },
              { name: "Stickiness", score: 7, maxScore: 10 },
              { name: "Growth Trend", score: 8, maxScore: 10 },
              { name: "Pricing Potential", score: 9, maxScore: 10 },
              { name: "Upsell Potential", score: 9, maxScore: 10 },
              { name: "Customer Purchasing Power", score: 8, maxScore: 10 },
            ],
          },
          suggestedImprovements: [
            "Consider adding AI-driven competitive analysis to differentiate from existing solutions",
            "Implement interactive roadmap planning with real-time collaboration features",
            "Add financial modeling tools with scenario planning capabilities",
          ],
          coreFeatures: [
            "SaaS idea validation and scoring system",
            "Interactive project planning with AI recommendations",
            "Market fit analysis with actionable insights",
            "Technical stack recommendations",
            "Development resource planning",
            "Features prioritization framework",
          ],
          technicalRequirements: {
            expertiseLevel: "Mid Developer",
            techStack: [
              "Next.js 15",
              "React",
              "Tailwind CSS",
              "Uploadcare",
              "PostgreSQL",
              "TypeScript",
              "Framer Motion",
            ],
          },
          pricingPlans: [
            {
              name: "Starter",
              price: "$29/mo",
              description: "Perfect for solo entrepreneurs and small teams",
              features: [
                "Basic visualization",
                "Core blueprint features",
                "Email support",
              ],
            },
            {
              name: "Pro",
              price: "$199/mo",
              description: "For growing teams and established startups",
              features: [
                "Advanced visualization",
                "Priority support",
                "Custom integrations",
                "Team collaboration",
              ],
            },
            {
              name: "Enterprise",
              price: "$799/mo",
              description: "For established companies and large teams",
              features: [
                "All Pro features",
                "Dedicated support",
                "Custom development",
                "White-label options",
              ],
            },
          ],
        };

        setBlueprint(demoBlueprint);
        setStep("result");
        setError(
          "Demo blueprint shown due to API error. Please check your OpenAI API key and try again."
        );
      } else {
        setStep("form");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerate = () => {
    if (!title.trim() || !description.trim()) {
      setError("Please fill in both title and description");
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setStepsCompleted(0);
    setBlueprint(null);
    setError(null);
    setStep("generating");
  };

  const handleStartOver = () => {
    setStep("form");
    setBlueprint(null);
    setError(null);
    setIsGenerating(false);
    setProgress(0);
    setStepsCompleted(0);
  };

  const handleAccept = () => {
    // Here you can save the blueprint to your database or perform other actions
    console.log("Blueprint accepted:", blueprint);
    onClose();
  };

  const renderForm = () => (
    <div className="flex flex-col items-center space-y-6 h-full">
      <img
        src="./src/assets/logo.png"
        alt="AI Icon"
        className="w-12 h-12 rounded-md shadow-lg"
      />
      <div className="text-left w-full">
        <h2 className="text-xl font-semibold">Project Details</h2>
        <p className="text-sm text-gray-400 mt-2">
          Describe your AI project briefly and let us do all the heavy lifting
          for you!
        </p>
      </div>

      <div className="w-full text-left space-y-6">
        <div>
          <label className="text-sm text-gray-300">Project Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full mt-2 px-3 py-2 rounded-md bg-[#2A2A2A] border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Project Title"
          />
        </div>
        <div>
          <label className="text-sm text-gray-300">Project Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full mt-2 px-3 py-2 h-90 rounded-md bg-[#2A2A2A] border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Be more specific for better services (600 characters only)"
            maxLength={600}
          />
        </div>
      </div>

      {error && (
        <div className="w-full p-3 bg-red-900/20 border border-red-500 rounded-md text-red-300 text-sm">
          {error}
        </div>
      )}

      <button
        onClick={handleGenerate}
        className="w-full mt-auto bg-white text-black rounded-md py-2 font-medium hover:bg-gray-200"
      >
        Generate Blueprint
      </button>
    </div>
  );

  const renderGenerating = () => (
    <div className="flex flex-col items-center space-y-6 text-center h-full">
      <div className="w-12 h-12 bg-gray-700 rounded-md animate-pulse" />
      <h2 className="text-lg font-medium">Generating your SaaS blueprint</h2>

      <div className="w-full">
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-400 mt-2">{progress}%</p>
      </div>

      <ul className="text-left space-y-10 w-full mt-8">
        {steps.map((step, idx) => (
          <li key={idx} className="flex items-center space-x-2 text-xl">
            {idx < stepsCompleted ? (
              <span className="text-green-500">✔</span>
            ) : (
              <span className="text-gray-500">○</span>
            )}
            <span
              className={`${
                idx < stepsCompleted ? "text-gray-300" : "text-gray-500"
              }`}
            >
              {step}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );

  const renderResult = () => (
    <div className="flex flex-col h-full">
      <div className="text-center">
        <h2 className="text-xl font-semibold">Review Your AI Blueprint</h2>
        <p className="text-sm text-gray-400 mt-2">
          Here's the blueprint generated based on your input. Review the details
          and accept to create your project.
        </p>
      </div>
      <div className="flex-1 overflow-y-auto space-y-6 mt-5">
        {blueprint && (
          <>
            {/* Market Feasibility */}
            <div className="bg-[#2A2A2A] rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4">
                Market Feasibility Analysis
              </h3>
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-300">Overall Score</span>
                  <span className="text-lg font-semibold text-green-400">
                    {blueprint.marketFeasibility?.overallScore || "8.3/10"}
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                {blueprint.marketFeasibility?.metrics?.map((metric, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">{metric.name}</span>
                      <span className="text-gray-400">
                        {metric.score}/{metric.maxScore}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 transition-all duration-300"
                        style={{
                          width: `${(metric.score / metric.maxScore) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggested Improvements */}
            <div className="bg-[#2A2A2A] rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4">
                Suggested Improvements
              </h3>
              <ul className="space-y-2">
                {blueprint.suggestedImprovements?.map((improvement, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-orange-500 mt-1">•</span>
                    <span className="text-gray-300 text-sm">{improvement}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Core Features */}
            <div className="bg-[#2A2A2A] rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4">Core Features</h3>
              <ul className="space-y-2">
                {blueprint.coreFeatures?.map((feature, idx) => (
                  <li key={idx} className="flex items-center space-x-2">
                    <span className="text-green-500">✔</span>
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Technical Requirements */}
            <div className="bg-[#2A2A2A] rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <span className="mr-2"></span>
                Technical Requirements
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-400">
                    Recommended Expertise Level:
                  </span>
                  <span className="ml-2 text-gray-300 font-medium">
                    {blueprint.technicalRequirements?.expertiseLevel}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-gray-400">
                    Suggested Tech Stack:
                  </span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {blueprint.technicalRequirements?.techStack?.map(
                      (tech, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-blue-600/20 text-blue-300 rounded-full text-xs"
                        >
                          {tech}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing Plans */}
            <div className="bg-[#2A2A2A] rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4">
                Recommended Pricing Plans
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {blueprint.pricingPlans?.map((plan, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-lg border ${
                      plan.name === "Pro"
                        ? "border-white bg-white/5"
                        : "border-gray-600"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{plan.name}</h4>
                      {plan.name === "Pro" && (
                        <span className="text-yellow-400 text-sm">
                          ★ Recommended
                        </span>
                      )}
                    </div>
                    <div className="text-2xl font-bold mb-2">{plan.price}</div>
                    <p className="text-sm text-gray-400 mb-3">
                      {plan.description}
                    </p>
                    <ul className="space-y-1">
                      {plan.features?.map((feature, featureIdx) => (
                        <li key={featureIdx} className="text-xs text-gray-300">
                          • {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between pt-4 border-t border-gray-700">
        <button
          onClick={handleStartOver}
          className="px-6 py-2 text-gray-300 hover:text-white"
        >
          Start Over
        </button>
        <button
          onClick={handleGenerate}
          className="px-6 py-2 text-gray-300 hover:text-white"
        >
          Edit Details
        </button>
        <button
          onClick={handleAccept}
          className="px-6 py-2 bg-white text-black rounded-md font-medium hover:bg-gray-200"
        >
          Accept
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl flex flex-col h-[800px] bg-[#1A1A1A] text-white rounded-2xl shadow-xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl"
        >
          ×
        </button>

        {/* Debug info - remove this later */}
        <div className="absolute top-4 left-4 text-xs text-gray-500">
          Step: {step} | Progress: {progress}% | Blueprint:{" "}
          {blueprint ? "Yes" : "No"}
        </div>

        {step === "form" && renderForm()}
        {step === "generating" && renderGenerating()}
        {(step === "result" || (blueprint && !isGenerating)) && renderResult()}
      </div>
    </div>
  );
}
