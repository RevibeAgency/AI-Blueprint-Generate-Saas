export default function BlueprintReviewScreen({ data, onClose }) {
    const {
        title,
        description,
        overall_score,
        market_analysis,
        core_features,
        suggested_improvements,
        tech_stack,
        pricing_plans,
        problem_statement,
        solution,
        monetization_strategy,
        roadmap
      } = data;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 text-white p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-6">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-400 hover:text-white text-xl"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold">Review Your AI Blueprint</h2>
        <p className="text-sm text-gray-400">
          Here’s the blueprint generated based on your input.
        </p>

        <div className="bg-[#1e1e1e] rounded-lg p-4 shadow-lg">
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <p className="text-sm text-gray-300">{description}</p>
        </div>

        <section className="bg-[#1e1e1e] rounded-lg p-4 shadow-md">
          <h4 className="text-lg font-semibold mb-2">
            Market Feasibility Analysis
          </h4>
          <p className="text-sm mb-2">Overall Score: {overall_score}/10</p>
          <div className="grid grid-cols-2 gap-4">
            {market_analysis.map((item, i) => (
              <div key={i} className="text-sm">
                {item.name}: {item.score}/10
              </div>
            ))}
          </div>
        </section>

        <section className="bg-[#1e1e1e] rounded-lg p-4 shadow-md">
          <h4 className="text-lg font-semibold mb-2">Suggested Improvements</h4>
          <ul className="list-disc ml-4 space-y-1 text-sm text-gray-300">
            {suggested_improvements.map((point, i) => (
              <li key={i}>{point}</li>
            ))}
          </ul>
        </section>

        <section className="bg-[#1e1e1e] rounded-lg p-4 shadow-md">
          <h4 className="text-lg font-semibold mb-2">Core Features</h4>
          <ul className="list-disc ml-4 space-y-1 text-sm text-gray-300">
            {core_features.map((feature, i) => (
              <li key={i}>{feature}</li>
            ))}
          </ul>
        </section>

        <section className="bg-[#1e1e1e] rounded-lg p-4 shadow-md">
          <h4 className="text-lg font-semibold mb-2">Technical Requirements</h4>
          <p className="text-sm">Recommended Level: {tech_stack.level}</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {tech_stack.stack.map((tech, i) => (
              <span
                key={i}
                className="px-2 py-1 bg-gray-800 rounded-md text-xs"
              >
                {tech}
              </span>
            ))}
          </div>
        </section>

        <section className="bg-[#1e1e1e] rounded-lg p-4 shadow-md">
          <h4 className="text-lg font-semibold mb-2">Pricing Plans</h4>
          <div className="grid grid-cols-3 gap-4">
            {pricing_plans.map((plan, i) => (
              <div key={i} className="bg-[#2e2e2e] p-4 rounded-md text-sm">
                <h5 className="font-bold text-lg">{plan.name}</h5>
                <p className="text-gray-400">{plan.price}</p>
                <p className="text-xs mt-1">{plan.description}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="flex justify-end space-x-4">
          <button className="bg-gray-600 px-4 py-2 rounded-md">Edit</button>
          <button className="bg-white text-black px-4 py-2 rounded-md">
            Accept
          </button>
        </div>
      </div>
      <section className="bg-[#1e1e1e] rounded-lg p-4 shadow-md space-y-4">
        <div>
          <h4 className="text-lg font-semibold mb-1">Problem</h4>
          <p className="text-sm text-gray-300">{data.problem_statement}</p>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-1">Solution</h4>
          <p className="text-sm text-gray-300">{data.solution}</p>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-1">Monetization Strategy</h4>
          <ul className="list-disc ml-4 space-y-1 text-sm text-gray-300">
            {data.monetization_strategy?.map((strategy, i) => (
              <li key={i}>{strategy}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-1">Roadmap</h4>
          <ul className="list-disc ml-4 space-y-1 text-sm text-gray-300">
            {data.roadmap?.map((item, i) => (
              <li key={i}>
                <strong>{item.stage}:</strong> {item.tasks?.join(", ")}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
