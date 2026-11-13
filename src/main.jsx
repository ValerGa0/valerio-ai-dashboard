import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Activity, ArrowRight, BarChart3, Bot, CheckCircle2, ChevronRight,
  CircleAlert, Clock3, FolderKanban, LayoutDashboard, LogOut, Plus,
  Search, Settings, Sparkles, Trash2, Pencil, X, RefreshCw,
} from 'lucide-react';
import './styles.css';
import { isSupabaseConfigured, supabase } from './lib/supabase';
import {
  createProject, updateProject, deleteProject,
  createTask, updateTask, deleteTask, loadWorkspace,
} from './lib/workspace';

const agents = [
  { id: 'manager', name: 'Manager', role: 'Central orchestration', icon: 'V', status: 'online', output: 'Prioritizes projects, assigns tasks, and keeps every product moving.' },
  { id: 'design', name: 'Design', role: 'Visual systems', icon: '✦', status: 'online', output: 'Creates layouts, visual rules, assets, and social templates.' },
  { id: 'business', name: 'Business', role: 'Strategy & monetization', icon: '◈', status: 'planning', output: 'Turns ideas into business models, milestones, and pricing.' },
  { id: 'content', name: 'Content', role: 'Media & copy', icon: '◌', status: 'writing', output: 'Writes posts, scripts, landing copy, and launch narratives.' },
  { id: 'research', name: 'Research', role: 'Market intelligence', icon: '⌁', status: 'scanning', output: 'Collects insights, competitors, trends, and product opportunities.' },
  { id: 'developer', name: 'Developer', role: 'Build & code', icon: '⌘', status: 'building', output: 'Plans architecture, UI states, integrations, and release workflow.' },
];

const emptyProject = { name: '', type: 'Project', description: '', agent: 'Manager', stage: 'Planning', progress: 0 };
const emptyTask = { title: '', project_id: '', assigned_agent: 'Manager', due_label: '', status: 'queued', priority: 'normal' };

function App() {
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [workspaceLoading, setWorkspaceLoading] = useState(false);
  const [authMode, setAuthMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authMessage, setAuthMessage] = useState('');
  const [authError, setAuthError] = useState('');
  const [active, setActive] = useState('Dashboard');
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [modal, setModal] = useState(null);
  const [formValues, setFormValues] = useState(emptyProject);
  const [taskFilter, setTaskFilter] = useState('all');
  const [busy, setBusy] = useState(false);
  const [pageError, setPageError] = useState('');
  const [toast, setToast] = useState('');

  const selectedProject = projects.find((project) => project.id === selectedProjectId) || projects[0] || null;
  const openTasks = tasks.filter((task) => task.status !== 'done').length;
  const completedTasks = tasks.filter((task) => task.status === 'done').length;
  const projectTaskCount = useMemo(() => {
    const counts = new Map();
    tasks.forEach((task) => counts.set(task.project_id, (counts.get(task.project_id) || 0) + 1));
    return counts;
  }, [tasks]);

  const notify = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 2400);
  };

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setAuthLoading(false);
      return undefined;
    }
    let alive = true;
    supabase.auth.getSession().then(({ data, error }) => {
      if (!alive) return;
      if (error) setAuthError(error.message);
      setSession(data?.session || null);
      setAuthLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setAuthError('');
      setAuthMessage('');
    });
    return () => {
      alive = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!session?.user?.id) {
      setProjects([]);
      setTasks([]);
      setSelectedProjectId(null);
      return undefined;
    }
    let alive = true;
    setWorkspaceLoading(true);
    setPageError('');
    loadWorkspace(session.user.id)
      .then((workspace) => {
        if (!alive) return;
        setProjects(workspace.projects);
        setTasks(workspace.tasks);
        setSelectedProjectId((current) =>
          workspace.projects.some((project) => project.id === current)
            ? current
            : workspace.projects[0]?.id || null
        );
      })
      .catch((error) => {
        if (alive) setPageError(error.message || 'Could not load the cloud workspace.');
      })
      .finally(() => {
        if (alive) setWorkspaceLoading(false);
      });
    return () => { alive = false; };
  }, [session?.user?.id]);

  const signIn = async (event) => {
    event.preventDefault();
    setBusy(true); setAuthError(''); setAuthMessage('');
    try {
      if (authMode === 'signup') {
        const { data, error } = await supabase.auth.signUp({ email: email.trim(), password });
        if (error) throw error;
        if (!data.session) setAuthMessage('Account created. Check your email to confirm the address, then sign in.');
        else setAuthMessage('Account created. Loading your workspace…');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) throw error;
      }
    } catch (error) {
      setAuthError(error.message || 'Authentication failed.');
    } finally {
      setBusy(false);
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) setPageError(error.message);
  };

  const refreshWorkspace = async () => {
    if (!session?.user?.id) return;
    setWorkspaceLoading(true); setPageError('');
    try {
      const workspace = await loadWorkspace(session.user.id);
      setProjects(workspace.projects); setTasks(workspace.tasks);
      setSelectedProjectId((current) => workspace.projects.some((project) => project.id === current) ? current : workspace.projects[0]?.id || null);
      notify('Cloud workspace synchronized');
    } catch (error) {
      setPageError(error.message || 'Synchronization failed.');
    } finally {
      setWorkspaceLoading(false);
    }
  };

  const openProjectForm = (project = null) => {
    setFormValues(project ? {
      name: project.name, type: project.type, description: project.description,
      agent: project.agent, stage: project.stage, progress: project.progress,
    } : emptyProject);
    setModal({ type: 'project', id: project?.id || null });
  };

  const openTaskForm = (task = null) => {
    setFormValues(task ? {
      title: task.title, project_id: task.project_id, assigned_agent: task.assigned_agent,
      due_label: task.due_label || '', status: task.status, priority: task.priority,
    } : { ...emptyTask, project_id: selectedProject?.id || projects[0]?.id || '' });
    setModal({ type: 'task', id: task?.id || null });
  };

  const saveProject = async (event) => {
    event.preventDefault();
    if (!formValues.name.trim()) return;
    setBusy(true); setPageError('');
    try {
      if (modal.id) {
        const updated = await updateProject(modal.id, session.user.id, formValues);
        setProjects((items) => items.map((item) => item.id === updated.id ? updated : item));
        notify('Project updated in cloud');
      } else {
        const created = await createProject(session.user.id, formValues);
        setProjects((items) => [...items, created]);
        setSelectedProjectId(created.id);
        notify('Project saved to cloud');
      }
      setModal(null);
    } catch (error) {
      setPageError(error.message || 'Could not save project.');
    } finally { setBusy(false); }
  };

  const removeProject = async (project) => {
    if (!window.confirm('Delete "' + project.name + '" and all its tasks?')) return;
    setBusy(true); setPageError('');
    try {
      await deleteProject(project.id, session.user.id);
      setProjects((items) => items.filter((item) => item.id !== project.id));
      setTasks((items) => items.filter((item) => item.project_id !== project.id));
      if (selectedProjectId === project.id) setSelectedProjectId(projects.find((item) => item.id !== project.id)?.id || null);
      notify('Project deleted');
    } catch (error) { setPageError(error.message || 'Could not delete project.'); }
    finally { setBusy(false); }
  };

  const saveTask = async (event) => {
    event.preventDefault();
    if (!formValues.title.trim() || !formValues.project_id) return;
    setBusy(true); setPageError('');
    try {
      if (modal.id) {
        const updated = await updateTask(modal.id, session.user.id, formValues);
        setTasks((items) => items.map((item) => item.id === updated.id ? updated : item));
        notify('Task updated in cloud');
      } else {
        const created = await createTask(session.user.id, formValues);
        setTasks((items) => [...items, created]);
        notify('Task saved to cloud');
      }
      setModal(null);
    } catch (error) { setPageError(error.message || 'Could not save task.'); }
    finally { setBusy(false); }
  };

  const changeTaskStatus = async (task) => {
    const status = task.status === 'done' ? 'active' : 'done';
    setTasks((items) => items.map((item) => item.id === task.id ? { ...item, status } : item));
    try {
      const updated = await updateTask(task.id, session.user.id, { status });
      setTasks((items) => items.map((item) => item.id === updated.id ? updated : item));
    } catch (error) {
      setTasks((items) => items.map((item) => item.id === task.id ? task : item));
      setPageError(error.message || 'Could not update task status.');
    }
  };

  const removeTask = async (task) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await deleteTask(task.id, session.user.id);
      setTasks((items) => items.filter((item) => item.id !== task.id));
      notify('Task deleted');
    } catch (error) { setPageError(error.message || 'Could not delete task.'); }
  };

  if (!isSupabaseConfigured) return <SetupScreen />;
  if (authLoading) return <LoadingScreen label="Connecting securely…" />;
  if (!session) return <AuthScreen
    mode={authMode} setMode={setAuthMode} email={email} setEmail={setEmail}
    password={password} setPassword={setPassword} onSubmit={signIn}
    busy={busy} error={authError} message={authMessage}
  />;

  const nav = [
    ['Dashboard', LayoutDashboard], ['Projects', FolderKanban], ['Tasks', CheckCircle2],
    ['Agents', Bot], ['Analytics', BarChart3], ['Settings', Settings],
  ];
  const visibleTasks = tasks.filter((task) => taskFilter === 'all' || task.status === taskFilter);

  return <div className="app">
    <aside className="sidebar">
      <button className="brand" onClick={() => setActive('Dashboard')}>
        <span className="monogram">V</span><span><b>VALÉRIO</b><small>AI COMMAND CENTER</small></span>
      </button>
      <nav>{nav.map(([name, Icon]) => <button key={name} onClick={() => setActive(name)} className={active === name ? 'navitem active' : 'navitem'}>
        <Icon size={17}/>{name}{name === 'Tasks' && <em>{openTasks}</em>}
      </button>)}</nav>
      <div className="profile"><span className="avatar">V</span><span><b>{session.user.email}</b><small>Cloud workspace owner</small></span></div>
    </aside>
    <main>
      <header><div className="crumb">VALÉRIO AI <ChevronRight size={14}/> Workspace <ChevronRight size={14}/> {active}</div>
        <div className="topbar"><label className="search"><Search size={16}/><input placeholder="Search projects and tasks…" onChange={(event) => {
          const value = event.target.value.toLowerCase();
          if (value) setActive('Projects');
        }}/></label><button className="icon" onClick={refreshWorkspace} title="Sync cloud data"><RefreshCw size={16}/></button></div>
      </header>
      <section className="content">
        <div className="hero"><div><span className="eyebrow"><i/>CLOUD WORKSPACE · SECURE</span><h1>VALÉRIO AI Dashboard</h1><p>Your projects and tasks, saved to Supabase and synchronized across devices.</p></div>
          <button className="primary" onClick={() => openTaskForm()}><Plus size={16}/>New task</button></div>
        {pageError && <div className="notice error"><CircleAlert size={17}/><span>{pageError}</span><button onClick={() => setPageError('')}><X size={15}/></button></div>}
        {workspaceLoading ? <LoadingScreen label="Loading your cloud workspace…"/> : <>
          <div className="command-panel">
            <div className="orb">V</div><div><span className="label">CENTRAL AI MANAGER · FOUNDATION</span><h2>{selectedProject?.name || 'Your workspace'}</h2>
              <p>{selectedProject?.description || 'Create your first project to start building the VALÉRIO roadmap.'}</p></div>
            <div className="assistant-mini"><span><Sparkles size={15}/>WORKSPACE STATUS</span><div className="cloud-status"><b>{projects.length} projects</b><b>{openTasks} open tasks</b></div></div>
          </div>
          <div className="workspace">
            <div className="section-head"><span className="label">{active}</span><button onClick={refreshWorkspace}>Sync now <RefreshCw size={14}/></button></div>
            {active === 'Dashboard' && <DashboardView projects={projects} tasks={tasks} openTasks={openTasks} completedTasks={completedTasks} projectTaskCount={projectTaskCount} onOpenProject={(id) => { setSelectedProjectId(id); setActive('Projects'); }} onNewProject={() => openProjectForm()} onNewTask={() => openTaskForm()} onToggleTask={changeTaskStatus}/>}
            {active === 'Projects' && <ProjectsView projects={projects} selectedProject={selectedProject} tasks={tasks} projectTaskCount={projectTaskCount} onSelect={setSelectedProjectId} onNew={() => openProjectForm()} onEdit={openProjectForm} onDelete={removeProject} onNewTask={openTaskForm}/>}
            {active === 'Tasks' && <TasksView tasks={visibleTasks} projects={projects} filter={taskFilter} setFilter={setTaskFilter} onNew={() => openTaskForm()} onEdit={openTaskForm} onDelete={removeTask} onToggle={changeTaskStatus}/>}
            {active === 'Agents' && <AgentsView/>}
            {active === 'Analytics' && <div className="analytics"><Metric icon={FolderKanban} label="Projects" value={projects.length}/><Metric icon={CheckCircle2} label="Open Tasks" value={openTasks}/><Metric icon={CheckCircle2} label="Completed Tasks" value={completedTasks}/><Metric icon={Activity} label="Completion" value={tasks.length ? Math.round(completedTasks / tasks.length * 100) + '%' : '0%'}/></div>}
            {active === 'Settings' && <div className="panel settings-panel"><h3>Cloud account</h3><p>{session.user.email}</p><small>Workspace data is stored in Supabase. Row Level Security restricts records to their owner.</small><button className="secondary" onClick={signOut}><LogOut size={15}/>Sign out</button></div>}
          </div>
        </>}
      </section>
    </main>
    {modal && <EditorModal modal={modal} values={formValues} setValues={setFormValues} projects={projects} onClose={() => setModal(null)} onSubmit={modal.type === 'project' ? saveProject : saveTask} busy={busy}/>}
    {toast && <div className="toast"><CheckCircle2 size={15}/>{toast}</div>}
  </div>;
}

function AuthScreen({ mode, setMode, email, setEmail, password, setPassword, onSubmit, busy, error, message }) {
  return <div className="auth-shell"><div className="auth-card"><div className="auth-brand"><span className="monogram">V</span><span><b>VALÉRIO</b><small>AI COMMAND CENTER</small></span></div>
    <span className="eyebrow"><i/>PRIVATE CLOUD WORKSPACE</span><h1>{mode === 'signin' ? 'Welcome back' : 'Create your workspace'}</h1>
    <p>Sign in to access your projects and tasks from any device.</p>
    <form onSubmit={onSubmit} className="editor-form"><label>Email address<input type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com"/></label>
      <label>Password<input type="password" autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} minLength="8" required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 8 characters"/></label>
      {error && <div className="notice error">{error}</div>}{message && <div className="notice success">{message}</div>}
      <button className="primary full" disabled={busy}>{busy ? 'Please wait…' : mode === 'signin' ? 'Sign in securely' : 'Create account'}</button>
    </form>
    <button className="text-button" onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); }}>{mode === 'signin' ? 'New to VALÉRIO? Create an account' : 'Already have an account? Sign in'}</button>
  </div></div>;
}

function SetupScreen() {
  return <div className="auth-shell"><div className="auth-card"><div className="auth-brand"><span className="monogram">V</span><span><b>VALÉRIO</b><small>AI COMMAND CENTER</small></span></div>
    <span className="eyebrow"><i/>ONE-TIME SETUP</span><h1>Connect your cloud</h1><p>Supabase is selected, but its project credentials are not configured yet.</p>
    <ol className="setup-steps"><li>Create a project in Supabase.</li><li>Run <code>supabase/migrations/202611130001_projects_tasks.sql</code> in the SQL Editor.</li><li>Copy <code>.env.example</code> to <code>.env.local</code> and add the project URL and publishable/anon key.</li><li>Restart the app with <code>npm run dev</code>.</li></ol>
    <small className="muted">Never put the Supabase service_role key in browser environment variables.</small>
  </div></div>;
}

function LoadingScreen({ label }) {
  return <div className="loading-screen"><div className="spinner"/><p>{label}</p></div>;
}

function DashboardView({ projects, tasks, openTasks, completedTasks, projectTaskCount, onOpenProject, onNewProject, onNewTask, onToggleTask }) {
  return <>
    <div className="analytics"><Metric icon={FolderKanban} label="Active Projects" value={projects.length}/><Metric icon={CheckCircle2} label="Open Tasks" value={openTasks}/><Metric icon={CheckCircle2} label="Completed" value={completedTasks}/><Metric icon={Activity} label="Task Completion" value={tasks.length ? Math.round(completedTasks / tasks.length * 100) + '%' : '0%'}/></div>
    <div className="section-title-row"><h2>Projects</h2><button className="secondary" onClick={onNewProject}><Plus size={15}/>Create project</button></div>
    <ProjectGrid projects={projects.slice(0, 6)} projectTaskCount={projectTaskCount} onSelect={onOpenProject}/>
    <div className="section-title-row"><h2>Recent tasks</h2><button className="secondary" onClick={onNewTask}><Plus size={15}/>Create task</button></div>
    <TaskRows tasks={tasks.slice(-6).reverse()} onToggle={onToggleTask}/>
  </>;
}

function ProjectsView({ projects, selectedProject, tasks, projectTaskCount, onSelect, onNew, onEdit, onDelete, onNewTask }) {
  return <><div className="section-title-row"><h2>All projects <small>{projects.length} in your cloud workspace</small></h2><button className="primary" onClick={onNew}><Plus size={15}/>New project</button></div>
    <ProjectGrid projects={projects} projectTaskCount={projectTaskCount} onSelect={onSelect} selectedId={selectedProject?.id}/>
    {selectedProject && <div className="panel project-detail"><div className="panel-title"><div><span className="label">SELECTED PROJECT</span><h3>{selectedProject.name}</h3></div><div className="inline-actions"><button className="secondary" onClick={() => onEdit(selectedProject)}><Pencil size={14}/>Edit</button><button className="danger" onClick={() => onDelete(selectedProject)}><Trash2 size={14}/>Delete</button></div></div>
      <p>{selectedProject.description}</p><div className="detail-meta"><span>{selectedProject.type}</span><span>{selectedProject.agent}</span><span>{selectedProject.stage}</span><span>{selectedProject.progress}% progress</span></div>
      <div className="section-title-row"><h3>Project tasks</h3><button className="secondary" onClick={() => onNewTask({ project_id: selectedProject.id })}><Plus size={14}/>Add task</button></div>
      <TaskRows tasks={tasks.filter((task) => task.project_id === selectedProject.id)} onToggle={() => {}}/>
    </div>}
  </>;
}

function ProjectGrid({ projects, projectTaskCount, onSelect, selectedId }) {
  if (!projects.length) return <EmptyState title="No projects yet" text="Create your first project to start organizing the VALÉRIO roadmap."/>;
  return <div className="cards projects-grid">{projects.map((project) => <button className={selectedId === project.id ? 'project-card selected' : 'project-card'} key={project.id} onClick={() => onSelect(project.id)}>
    <span>{project.type}</span><h3>{project.name}</h3><p>{project.description}</p><div className="meta"><b>{project.agent}</b><b>{projectTaskCount.get(project.id) || 0} tasks</b></div><div className="bar"><i style={{ width: project.progress + '%' }}/></div><small>{project.progress}% · {project.stage}</small>
  </button>)}</div>;
}

function TasksView({ tasks, projects, filter, setFilter, onNew, onEdit, onDelete, onToggle }) {
  return <><div className="section-title-row"><h2>All tasks <small>{tasks.length} shown</small></h2><div className="inline-actions"><select value={filter} onChange={(event) => setFilter(event.target.value)}><option value="all">All statuses</option><option value="queued">Queued</option><option value="active">Active</option><option value="review">In review</option><option value="done">Completed</option></select><button className="primary" onClick={onNew}><Plus size={15}/>New task</button></div></div>
    {!tasks.length ? <EmptyState title="No tasks in this view" text="Create a task or choose another status filter."/> : <div className="panel list"><TaskRows tasks={tasks} onToggle={onToggle} projects={projects} onEdit={onEdit} onDelete={onDelete}/></div>}
  </>;
}

function TaskRows({ tasks, onToggle, projects, onEdit, onDelete }) {
  if (!tasks.length) return <EmptyState title="No tasks yet" text="Add a task to this project when you're ready."/>;
  return <div className="task-list">{tasks.map((task) => {
    const project = projects?.find((item) => item.id === task.project_id);
    return <div key={task.id} className={task.status === 'done' ? 'row task-row done' : 'row task-row'}>
      <button className="task-check" onClick={() => onToggle(task)} aria-label={task.status === 'done' ? 'Reopen task' : 'Complete task'}><CheckCircle2 size={18}/></button>
      <span className="task-copy"><b>{task.title}</b><small>{project?.name || 'Project'} · {task.assigned_agent} · {task.due_label || 'No due date'}</small></span>
      <em className={'status status-' + task.status}>{task.status}</em>
      {onEdit && <button className="row-action" onClick={() => onEdit(task)} aria-label="Edit task"><Pencil size={14}/></button>}
      {onDelete && <button className="row-action" onClick={() => onDelete(task)} aria-label="Delete task"><Trash2 size={14}/></button>}
    </div>;
  })}</div>;
}

function AgentsView() {
  return <div className="cards agent-grid">{agents.map((agent) => <div className="agent-card" key={agent.id}><div className="agent-icon">{agent.icon}</div><span>{agent.status}</span><h3>{agent.name}</h3><p>{agent.role}</p><small>{agent.output}</small></div>)}</div>;
}

function EditorModal({ modal, values, setValues, projects, onClose, onSubmit, busy }) {
  const project = modal.type === 'project';
  const set = (key, value) => setValues((current) => ({ ...current, [key]: value }));
  return <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <div className="editor-modal"><div className="modal-head"><div><span className="label">{modal.id ? 'EDIT' : 'NEW'} {project ? 'PROJECT' : 'TASK'}</span><h2>{project ? 'Project details' : 'Task details'}</h2></div><button className="icon" onClick={onClose}><X size={17}/></button></div>
      <form className="editor-form" onSubmit={onSubmit}>
        {project ? <>
          <label>Project name<input required maxLength="120" value={values.name} onChange={(event) => set('name', event.target.value)}/></label>
          <label>Project type<input value={values.type} onChange={(event) => set('type', event.target.value)}/></label>
          <label>Description<textarea rows="3" value={values.description} onChange={(event) => set('description', event.target.value)}/></label>
          <div className="form-grid"><label>Responsible agent<select value={values.agent} onChange={(event) => set('agent', event.target.value)}>{agents.map((agent) => <option key={agent.id}>{agent.name}</option>)}</select></label><label>Stage<input value={values.stage} onChange={(event) => set('stage', event.target.value)}/></label></div>
          <label>Progress: {values.progress}%<input type="range" min="0" max="100" value={values.progress} onChange={(event) => set('progress', Number(event.target.value))}/></label>
        </> : <>
          <label>Task title<input required maxLength="240" value={values.title} onChange={(event) => set('title', event.target.value)}/></label>
          <label>Project<select required value={values.project_id} onChange={(event) => set('project_id', event.target.value)}>{projects.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
          <div className="form-grid"><label>Assigned agent<select value={values.assigned_agent} onChange={(event) => set('assigned_agent', event.target.value)}>{agents.map((agent) => <option key={agent.id}>{agent.name}</option>)}</select></label><label>Due date / label<input value={values.due_label} onChange={(event) => set('due_label', event.target.value)} placeholder="e.g. Friday"/></label></div>
          <div className="form-grid"><label>Status<select value={values.status} onChange={(event) => set('status', event.target.value)}><option value="queued">Queued</option><option value="active">Active</option><option value="review">In review</option><option value="done">Completed</option></select></label><label>Priority<select value={values.priority} onChange={(event) => set('priority', event.target.value)}><option value="low">Low</option><option value="normal">Normal</option><option value="high">High</option></select></label></div>
        </>}
        <div className="modal-actions"><button type="button" className="secondary" onClick={onClose}>Cancel</button><button className="primary" disabled={busy}>{busy ? 'Saving…' : 'Save to cloud'}</button></div>
      </form>
    </div>
  </div>;
}

function Metric({ icon: Icon, label, value }) { return <div className="metric"><Icon size={18}/><span>{label}</span><b>{value}</b></div>; }
function EmptyState({ title, text }) { return <div className="empty-state"><FolderKanban size={24}/><b>{title}</b><p>{text}</p></div>; }

createRoot(document.getElementById('root')).render(<App/>);
