import { supabase } from './supabase';

const starterProjects = [
  { name: 'VALÉRIO AI Dashboard', type: 'Core product', progress: 20, agent: 'Manager', stage: 'Cloud foundation', description: 'AI command center with real projects, tasks, files, activity, and specialist agents.' },
  { name: 'VALÉRIO Brand System', type: 'Identity', progress: 82, agent: 'Design', stage: 'Polish', description: 'Logo, V monogram, typography, colors, Brand Book, covers, and social templates.' },
  { name: 'VALÉRIO DESIGN', type: 'Media channel', progress: 64, agent: 'Content', stage: 'Content sprint', description: 'Instagram, Facebook, TikTok, Telegram content ecosystem and publication pipeline.' },
  { name: 'VALÉRIO Madeira', type: 'Travel app', progress: 57, agent: 'Research', stage: 'Discovery', description: 'Premium Madeira guide with maps, routes, weather, events, bookings, translator, and offline mode.' },
  { name: 'Technical Base', type: 'Infrastructure', progress: 46, agent: 'Developer', stage: 'Foundation', description: 'Frontend, API/AI integrations, GitHub workflow, deployment, and product architecture.' },
  { name: 'AI Agents VALÉRIO', type: 'Automation', progress: 73, agent: 'Manager', stage: 'Operating', description: 'Six specialist agents coordinated by the central AI Manager.' },
  { name: 'Madeira Map & Routes', type: 'Feature module', progress: 39, agent: 'Research', stage: 'Mapping', description: 'Interactive maps, PR tracks, viewpoints, transport, and route planning.' },
  { name: 'Bookings & Excursions', type: 'Marketplace', progress: 31, agent: 'Business', stage: 'Modeling', description: 'Partner offers, reservations, excursions, and premium travel packages.' },
  { name: 'Social Launch Kit', type: 'Launch', progress: 69, agent: 'Content', stage: 'Production', description: 'First publications, reels scripts, carousel templates, covers, and messaging.' },
  { name: 'VALÉRIO Landing Page', type: 'Web', progress: 52, agent: 'Developer', stage: 'Wireframe', description: 'Premium landing page explaining VALÉRIO OS, products, and waitlist.' },
  { name: 'Analytics Layer', type: 'Data', progress: 44, agent: 'Business', stage: 'Dashboarding', description: 'Product metrics, content performance, project velocity, and KPI summaries.' },
  { name: 'Mobile App Shell', type: 'Mobile', progress: 28, agent: 'Developer', stage: 'Concept', description: 'Responsive mobile-first shell for Madeira and future VALÉRIO products.' },
];

const starterTasks = [
  { title: 'Finalize dashboard navigation flow', projectName: 'VALÉRIO AI Dashboard', assigned_agent: 'Manager', due_label: 'Today', status: 'active', priority: 'high' },
  { title: 'Connect project cards to cloud data', projectName: 'VALÉRIO AI Dashboard', assigned_agent: 'Developer', due_label: 'This week', status: 'active', priority: 'high' },
  { title: 'Prepare Brand Book file structure', projectName: 'VALÉRIO Brand System', assigned_agent: 'Design', due_label: 'This week', status: 'review', priority: 'normal' },
  { title: 'Write first VALÉRIO DESIGN posts', projectName: 'VALÉRIO DESIGN', assigned_agent: 'Content', due_label: 'Next week', status: 'active', priority: 'normal' },
  { title: 'Research Madeira routes and offline mode', projectName: 'VALÉRIO Madeira', assigned_agent: 'Research', due_label: 'Next week', status: 'active', priority: 'normal' },
  { title: 'Define GitHub release workflow', projectName: 'Technical Base', assigned_agent: 'Developer', due_label: 'Next week', status: 'review', priority: 'normal' },
  { title: 'Create monetization map for bookings', projectName: 'Bookings & Excursions', assigned_agent: 'Business', due_label: 'Later', status: 'queued', priority: 'normal' },
  { title: 'Draft assistant quick commands', projectName: 'AI Agents VALÉRIO', assigned_agent: 'Manager', due_label: 'Later', status: 'queued', priority: 'low' },
];

function requireClient() {
  if (!supabase) throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
}

export async function loadWorkspace(userId) {
  requireClient();
  const { error: profileError } = await supabase.from('workspace_profiles')
    .upsert({ user_id: userId }, { onConflict: 'user_id', ignoreDuplicates: true });
  if (profileError) throw profileError;

  const { data: profile, error: profileReadError } = await supabase
    .from('workspace_profiles').select('starter_seeded').eq('user_id', userId).single();
  if (profileReadError) throw profileReadError;

  if (!profile.starter_seeded) {
    const { error: seedError } = await supabase.from('projects').upsert(
      starterProjects.map((project) => ({ ...project, user_id: userId })),
      { onConflict: 'user_id,name', ignoreDuplicates: true },
    );
    if (seedError) throw seedError;

    const { data: seedProjects, error: seedProjectsError } = await supabase
      .from('projects').select('id,name').eq('user_id', userId);
    if (seedProjectsError) throw seedProjectsError;
    const projectIds = new Map(seedProjects.map((project) => [project.name, project.id]));
    const seedTasks = starterTasks
      .filter((task) => projectIds.has(task.projectName))
      .map(({ projectName, ...task }) => ({
        ...task,
        user_id: userId,
        project_id: projectIds.get(projectName),
      }));
    const { error: seedTaskError } = await supabase.from('tasks').upsert(seedTasks, {
      onConflict: 'user_id,title',
      ignoreDuplicates: true,
    });
    if (seedTaskError) throw seedTaskError;

    const { error: markSeededError } = await supabase.from('workspace_profiles')
      .update({ starter_seeded: true }).eq('user_id', userId);
    if (markSeededError) throw markSeededError;
  }

  const [projectsResult, tasksResult] = await Promise.all([
    supabase.from('projects').select('*').eq('user_id', userId).order('created_at', { ascending: true }),
    supabase.from('tasks').select('*').eq('user_id', userId).order('created_at', { ascending: true }),
  ]);
  if (projectsResult.error) throw projectsResult.error;
  if (tasksResult.error) throw tasksResult.error;
  return { projects: projectsResult.data, tasks: tasksResult.data };
}

export async function createProject(userId, values) {
  requireClient();
  const { data, error } = await supabase.from('projects').insert({ ...values, user_id: userId }).select().single();
  if (error) throw error;
  return data;
}

export async function updateProject(projectId, userId, values) {
  requireClient();
  const { data, error } = await supabase.from('projects').update(values)
    .eq('id', projectId).eq('user_id', userId).select().single();
  if (error) throw error;
  return data;
}

export async function deleteProject(projectId, userId) {
  requireClient();
  const { error } = await supabase.from('projects').delete().eq('id', projectId).eq('user_id', userId);
  if (error) throw error;
}

export async function createTask(userId, values) {
  requireClient();
  const { data, error } = await supabase.from('tasks').insert({ ...values, user_id: userId }).select().single();
  if (error) throw error;
  return data;
}

export async function updateTask(taskId, userId, values) {
  requireClient();
  const { data, error } = await supabase.from('tasks').update(values)
    .eq('id', taskId).eq('user_id', userId).select().single();
  if (error) throw error;
  return data;
}

export async function deleteTask(taskId, userId) {
  requireClient();
  const { error } = await supabase.from('tasks').delete().eq('id', taskId).eq('user_id', userId);
  if (error) throw error;
}
