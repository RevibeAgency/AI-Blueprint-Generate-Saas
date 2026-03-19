import BlueprintForm from "@/components/BlueprintForm";

export default function BlueprintPage() {
  return (
    <div className="p-6">
      <h1 className="text-xl text-white mb-4">Generate a Blueprint</h1>
      <BlueprintForm projectId={"your-project-id"} />
    </div>
  );
}
