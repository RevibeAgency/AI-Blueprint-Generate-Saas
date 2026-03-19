import { supabase } from "../supabaseClient";

// Get all projects for the authenticated user
export async function getProjects() {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

// Create a new project
export async function createProject({ name, description }) {
  // Get the current user
  const { data: { user } } = await supabase.auth.getUser();
  
  const { data, error } = await supabase
    .from("projects")
    .insert([{ 
      name, 
      description,
      owner_id: user.id 
    }])
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Update a project
export async function updateProject(id, updates) {
  const { data, error } = await supabase
    .from("projects")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Delete a project
export async function deleteProject(id) {
  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", id);
  if (error) throw error;
}