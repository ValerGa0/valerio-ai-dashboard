import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  Bot,
  CalendarDays,
  CheckCircle2,
  CheckSquare,
  ChevronRight,
  Clock3,
  Command,
  FileText,
  Files,
  FolderKanban,
  Gauge,
  LayoutDashboard,
  MessageSquare,
  Plus,
  Search,
  Send,
  Settings,
  Sparkles,
  Users,
  Wand2,
  Zap,
} from 'lucide-react';
import './styles.css';

const agents = [
  { id: 'manager', name: 'Manager', role: 'Central orchestration', icon: 'V', status: 'online', focus: 'VALÉRIO OS roadmap', output: 'Prioritizes projects, assigns tasks, and keeps every product moving.' },
  { id: 'design', name: 'Design', role: 'Visual systems', icon: '✦', status: 'online', focus: 'Luxury-tech UI kit', output: 'Creates layouts, visual rules, assets, and social templates.' },
  { id: 'business', name: 'Business', role: 'Strategy & monetization', icon: '◈', status: 'planning', focus: 'Launch offers', output: 'Turns ideas into business models, milestones, and pricing.' },
  { id: 'content', name: 'Content', role: 'Media & copy', icon: '◌', status: 'writing', focus: 'First publication pack', output: 'Writes posts, scripts, landing copy, and launch narratives.' },
  { id: 'research', name: 'Research', role: 'Market intelligence', icon: '⌁', status: 'scanning', focus: 'Madeira user needs', output: 'Collects insights, competitors, trends, and product opportunities.' },
  { id: 'developer', name: 'Developer', role: 'Build & code', icon: '⌘', status: 'building', focus: 'Interactive prototype', output: 'Plans architecture, UI states, integrations, and release workflow.' },
];

const projects = [
  { id: 'dashboard', name: 'VALÉRIO AI Dashboard', type: 'Core product', progress: 88, agent: 'Manager', stage: 'Prototype', tasks: 5, description: 'AI command center with projects, agents, tasks, files, activity, analytics, and assistant.' },
  { id: 'brand', name: 'VALÉRIO Brand System', type: 'Identity', progress: 82, agent: 'Design', stage: 'Polish', tasks: 4, description: 'Logo, V monogram, typography, colors, brand book, covers, and social templates.' },
  { id: 'design', name: 'VALÉRIO DESIGN', type: 'Media channel', progress: 64, agent: 'Content', stage: 'Content sprint', tasks: 6, description: 'Instagram, Facebook, TikTok, Telegram content ecosystem and publication pipeline.' },
  { id: 'madeira', name: 'VALÉRIO Madeira', type: 'Travel app', progress: 57, agent: 'Research', stage: 'Discovery', tasks: 7, description: 'Premium Madeira guide with map, routes, weather, events, bookings, translator, and offline mode.' },
  { id: 'technical', name: 'Technical Base', type: 'Infrastructure', progress: 46, agent: 'Developer', stage: 'Foundation', tasks: 8, description: 'Frontend, API/AI integrations, GitHub workflow, deployment, and product architecture.' },
  { id: 'agents-os', name: 'AI Agents VALÉRIO', type: 'Automation', progress: 73, agent: 'Manager', stage: 'Operating', tasks: 5, description: 'Six specialist agents coordinated by the central AI Manager.' },
  { id: 'madeira-map', name: 'Madeira Map & Routes', type: 'Feature module', progress: 39, agent: 'Research', stage: 'Mapping', tasks: 9, description: 'Interactive maps, PR tracks, viewpoints, transport, and route planning.' },
  { id: 'bookings', name: 'Bookings & Excursions', type: 'Marketplace', progress: 31, agent: 'Business', stage: 'Modeling', tasks: 5, description: 'Partner offers, reservations, excursions, and premium travel packages.' },
  { id: 'social-kit', name: 'Social Launch Kit', type: 'Launch', progress: 69, agent: 'Content', stage: 'Production', tasks: 6, description: 'First publications, reels scripts, carousel templates, covers, and messaging.' },
  { id: 'landing', name: 'VALÉRIO Landing Page', type: 'Web', progress: 52, agent: 'Developer', stage: 'Wireframe', tasks: 4, description: 'Premium landing page explaining VALÉRIO OS, products, and waitlist.' },
  { id: 'analytics', name: 'Analytics Layer', type: 'Data', progress: 44, agent: 'Business', stage: 'Dashboarding', tasks: 6, description: 'Product metrics, content performance, project velocity, and KPI summaries.' },
  { id: 'mobile-shell', name: 'Mobile App Shell', type: 'Mobile', progress: 28, agent: 'Developer', stage: 'Concept', tasks: 8, description: 'Responsive mobile-first shell for Madeira and future VALÉRIO products.' },
];

const baseTasks = [
  { id: 1, title: 'Finalize dashboard navigation flow', project: 'VALÉRIO AI Dashboard', agent: 'Manager', due: 'Today 10:30', status: 'active' },
  { id: 2, title: 'Connect 12 project cards to details', project: 'VALÉRIO AI Dashboard', agent: 'Developer', due: 'Today 12:00', status: 'active' },
  { id: 3, title: 'Prepare Brand Book file structure', project: 'VALÉRIO Brand System', agent: 'Design', due: 'Today 14:00', status: 'review' },
  { id: 4, title: 'Write first VALÉRIO DESIGN posts', project: 'VALÉRIO DESIGN', agent: 'Content', due: 'Tomorrow', status: 'active' },
  { id: 5, title: 'Research Madeira routes and offline mode', project: 'VALÉRIO Madeira', agent: 'Research', due: 'Aug 16', status: 'active' },
  { id: 6, title: 'Define GitHub release workflow', project: 'Technical Base', agent: 'Developer', due: 'Aug 17', status: 'review' },
  { id: 7, title: 'Create monetization map for bookings', project: 'Bookings & Excursions', agent: 'Business', due: 'Aug 18', status: 'queued' },
  { id: 8, title: 'Draft assistant quick commands', project: 'AI Agents VALÉRIO', agent: 'Manager', due: 'Aug 19', status: 'queued' },
];

const files = ['VALÉRIO Master Plan.pdf', 'Brand Book v0.8.fig', 'Dashboard UI System.fig', 'Madeira Routes Research.xlsx', 'AI Agents Operating Rules.md', 'Social Launch Kit.zip'];
const activities = ['Manager assigned Developer to Dashboard prototype', 'Design uploaded Brand Book v0.8', 'Research added 14 Madeira route notes', 'Content drafted launch post set', 'Business updated booking marketplace assumptions'];
const calendar = ['Dashboard review — Today 16:00', 'Brand sprint — Aug 14', 'Madeira research checkpoint — Aug 16', 'Launch content approval — Aug 18'];
const quickActions = ['Create task', 'Open project', 'Ask AI Manager', 'Upload file', 'Schedule sprint', 'Generate report'];

function App() {
  const [active, setActive] = useState('Dashboard');
  const [selectedProject, setSelectedProject] = useState(projects[0]);
  const [selectedAgent, setSelectedAgent] = useState(agents[0]);
  const [tasks, setTasks] = useState(baseTasks);
  const [assistantInput, setAssistantInput] = useState('');
  const [messages, setMessages] = useState([{ from: 'ai', text: 'VALÉRIO AI is ready. Choose a project, agent, or task and I will propose the next move.' }]);
  const [toast, setToast] = useState('');

  const showToast = (message) => { setToast(message); setTimeout(() => setToast(''), 1800); };
  const projectTasks = useMemo(() => tasks.filter((task) => task.project === selectedProject.name), [tasks, selectedProject]);
  const nav = [
    ['Dashboard', LayoutDashboard], ['Projects', FolderKanban], ['Agents', Bot], ['Tasks', CheckSquare], ['Files', Files], ['Activity', Activity], ['Calendar', CalendarDays], ['Analytics', BarChart3], ['AI Assistant', MessageSquare], ['Settings', Settings],
  ];
  const toggleTask = (id) => setTasks(tasks.map((task) => task.id === id ? { ...task, status: task.status === 'done' ? 'active' : 'done' } : task));
  const openProject = (project) => { setSelectedProject(project); setActive('Projects'); showToast(`${project.name} opened`); };
  const openAgent = (agent) => { setSelectedAgent(agent); setActive('Agents'); showToast(`${agent.name} agent opened`); };
  const sendMessage = () => {
    const prompt = assistantInput.trim() || `Create next action for ${selectedProject.name}`;
    setMessages([...messages, { from: 'user', text: prompt }, { from: 'ai', text: `Next VALÉRIO move: keep ${selectedProject.name} in ${selectedProject.stage}, assign ${selectedAgent.name}, and close ${projectTasks.length || 1} priority task(s).` }]);
    setAssistantInput(''); setActive('AI Assistant');
  };

  return <div className="app">
    <aside className="sidebar">
      <button className="brand" onClick={() => setActive('Dashboard')}><span className="monogram">V</span><span><b>VALÉRIO</b><small>AI COMMAND CENTER</small></span></button>
      <nav>{nav.map(([name, Icon]) => <button key={name} onClick={() => setActive(name)} className={active === name ? 'navitem active' : 'navitem'}><Icon size={17} />{name}{name === 'Tasks' && <em>{tasks.filter(t => t.status !== 'done').length}</em>}</button>)}</nav>
      <div className="profile"><span className="avatar">VG</span><span><b>ValerGa</b><small>Owner · Premium OS</small></span></div>
    </aside>

    <main>
      <header><div className="crumb">VALÉRIO AI <ChevronRight size={14}/> Dashboard <ChevronRight size={14}/> {active}</div><div className="topbar"><label className="search"><Search size={16}/><input onFocus={() => showToast('Global search active')} placeholder="Search projects, agents, tasks..." /></label><button onClick={() => showToast('No new notifications')} className="icon"><Bell size={17}/></button></div></header>
      <section className="content">
        <div className="hero"><div><span className="eyebrow"><i/>AI MANAGER · ONLINE</span><h1>VALÉRIO AI Dashboard</h1><p>Projects → Agents → Tasks → Files → Activity → AI Assistant. Every module is clickable and operational.</p></div><button className="primary" onClick={sendMessage}><Sparkles size={17}/>Run next action</button></div>

        <div className="command-panel">
          <div className="orb">V</div><div><span className="label">CENTRAL AI MANAGER</span><h2>{selectedProject.name}</h2><p>{selectedProject.description}</p></div>
          <div className="assistant-mini"><span><Command size={15}/>Ask VALÉRIO AI</span><div><input value={assistantInput} onChange={(e) => setAssistantInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendMessage()} placeholder="What should we build next?"/><button onClick={sendMessage}><Send size={15}/></button></div></div>
        </div>

        <Dashboard active={active} setActive={setActive} projects={projects} openProject={openProject} agents={agents} openAgent={openAgent} selectedProject={selectedProject} selectedAgent={selectedAgent} tasks={tasks} toggleTask={toggleTask} files={files} activities={activities} calendar={calendar} messages={messages} setMessages={setMessages} quickActions={quickActions} showToast={showToast} />
      </section>
    </main>
    {toast && <div className="toast"><Zap size={15}/>{toast}</div>}
  </div>;
}

function Dashboard(props) {
  const { active, projects, openProject, agents, openAgent, selectedProject, selectedAgent, tasks, toggleTask, files, activities, calendar, messages, quickActions, setActive, showToast } = props;
  const renderProjects = <div className="cards projects-grid">{projects.map((project) => <button className={selectedProject.id === project.id ? 'project-card selected' : 'project-card'} key={project.id} onClick={() => openProject(project)}><span>{project.type}</span><h3>{project.name}</h3><p>{project.description}</p><div className="meta"><b>{project.agent}</b><b>{project.tasks} tasks</b></div><div className="bar"><i style={{ width: `${project.progress}%` }}/></div><small>{project.progress}% · {project.stage}</small></button>)}</div>;
  const renderAgents = <div className="cards agent-grid">{agents.map((agent) => <button className={selectedAgent.id === agent.id ? 'agent-card selected' : 'agent-card'} key={agent.id} onClick={() => openAgent(agent)}><div className="agent-icon">{agent.icon}</div><span>{agent.status}</span><h3>{agent.name}</h3><p>{agent.role}</p><small>{agent.output}</small></button>)}</div>;
  const renderTasks = <div className="panel list"><div className="panel-title"><h3>Clickable Tasks</h3><button onClick={() => showToast('New task created')}><Plus size={14}/>New task</button></div>{tasks.map((task) => <button key={task.id} onClick={() => toggleTask(task.id)} className={task.status === 'done' ? 'row done' : 'row'}><CheckCircle2 size={17}/><span><b>{task.title}</b><small>{task.project} · {task.agent}</small></span><em>{task.due}</em></button>)}</div>;
  const renderFiles = <div className="panel list"><div className="panel-title"><h3>Files</h3><button onClick={() => showToast('Upload dialog opened')}><Plus size={14}/>Upload</button></div>{files.map((file, i) => <button className="row" key={file} onClick={() => showToast(`${file} opened`)}><FileText size={17}/><span><b>{file}</b><small>{i + 2}.{i + 4} MB · VALÉRIO workspace</small></span><ArrowUpRight size={15}/></button>)}</div>;
  const renderActivity = <div className="panel list">{activities.map((item, i) => <button className="row" key={item} onClick={() => showToast('Activity item opened')}><Activity size={17}/><span><b>{item}</b><small>{i + 1}h ago · live workspace event</small></span></button>)}</div>;
  const renderCalendar = <div className="panel list">{calendar.map((item) => <button className="row" key={item} onClick={() => showToast(`${item} opened`)}><Clock3 size={17}/><span><b>{item}</b><small>Calendar checkpoint</small></span></button>)}</div>;
  const renderAnalytics = <div className="analytics"><Metric icon={Gauge} label="OS Progress" value="61%"/><Metric icon={Users} label="Agents Active" value="6/6"/><Metric icon={CheckSquare} label="Open Tasks" value={tasks.filter(t => t.status !== 'done').length}/><Metric icon={FolderKanban} label="Projects" value="12"/></div>;
  const renderAssistant = <div className="panel chat">{messages.map((m, i) => <div key={i} className={m.from === 'ai' ? 'bubble ai' : 'bubble user'}>{m.text}</div>)}</div>;
  const renderSettings = <div className="settings"><Metric icon={Sparkles} label="Theme" value="Luxury Dark"/><Metric icon={Bot} label="Default Agent" value={selectedAgent.name}/><Metric icon={FolderKanban} label="Workspace" value="VALÉRIO OS"/></div>;
  const sections = { Dashboard: <><div className="split"><div><h2>12 Real Projects</h2>{renderProjects}</div><div><h2>Quick Actions</h2><QuickActions actions={quickActions} showToast={showToast}/>{renderAnalytics}</div></div>{renderAgents}{renderTasks}</>, Projects: renderProjects, Agents: renderAgents, Tasks: renderTasks, Files: renderFiles, Activity: renderActivity, Calendar: renderCalendar, Analytics: renderAnalytics, 'AI Assistant': renderAssistant, Settings: renderSettings };
  return <div className="workspace"><div className="section-head"><span className="label">{active}</span><button onClick={() => setActive('Dashboard')}>Back to Dashboard <ArrowRight size={14}/></button></div>{sections[active]}</div>;
}
function Metric({ icon: Icon, label, value }) { return <div className="metric"><Icon size={18}/><span>{label}</span><b>{value}</b></div>; }
function QuickActions({ actions, showToast }) { return <div className="quick">{actions.map((a) => <button key={a} onClick={() => showToast(`${a} launched`)}><Wand2 size={15}/>{a}</button>)}</div>; }

createRoot(document.getElementById('root')).render(<App />);
