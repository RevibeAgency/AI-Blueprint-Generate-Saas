export default function BlueprintCard({ blueprint }) {
    const { title, problem_statement, generated_data } = blueprint;
  
    return (
      <div className="bg-[#18181b] border border-[#4D55CC] p-5 rounded-2xl shadow-lg text-white mb-6">
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className="text-[#a1a1aa] mb-4">{problem_statement}</p>
  
        {Object.entries(generated_data).map(([key, val]) => (
          <div key={key} className="mb-4">
            <h3 className="text-lg font-semibold capitalize mb-1">{key.replace(/_/g, " ")}</h3>
            <p className="text-sm whitespace-pre-wrap">{val}</p>
          </div>
        ))}
      </div>
    );
  }
  