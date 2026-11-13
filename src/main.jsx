import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Activity, ArrowRight, ArrowUpRight, BarChart3, Bell, Bot, CalendarDays,
  CheckCircle2, CheckSquare, ChevronDown, ChevronRight, Clock3, FileText,
  Files, FolderKanban, Gauge, LayoutDashboard, MessageSquare, Plus, Search,
  Send, Settings, Sparkles, Users, Wand2, Zap, Menu, X
} from 'lucide-react';
import './styles.css';
import { supabase, isSupabaseConfigured } from './lib/supabase';

const initialAgents = [
  { id: 'design', name: 'Design Agent', role: 'Creativity & Design', icon: '✦', color: 'gold', status: 'Online', task: 'VALÉRIO Brand System' },
  { id: 'business', name: 'Business Agent', role: 'Strategy & Growth', icon: '◈', color: 'blue', status: 'Online', task: 'Business roadmap' },
  { id: 'content', name: 'Content Agent', role: 'Content & Copy', icon: '✎', color: 'purple', status: 'Online', task: 'Social launch kit' },
  { id: 'research', name: 'Research Agent', role: 'Data & Insights', icon: '⌕', color: 'cyan', status: 'Online', task: 'Madeira research' },
  { id: 'developer', name: 'Developer Agent', role: 'Code & Technology', icon: '</>', color: 'orange', status: 'Online', task: 'Dashboard prototype' },
  { id: 'manager', name: 'Manager Agent', role: 'Planning & Control', icon: '◎', color: 'violet', status: 'Online', task: 'VALÉRIO OS roadmap' },
];

const initialProjects = [
  { id: 'dashboard', name: 'VALÉRIO AI Dashboard', type: 'Core platform', progress: 88, agent: 'Developer', status: 'In progress', tasks: 5, description: 'The central command center for the VALÉRIO ecosystem.' },
  { id: 'brand', name: 'VALÉRIO Brand System', type: 'Brand identity', progress: 76, agent: 'Design', status: 'In progress', tasks: 4, description: 'Monogram, visual language, brand book, and social templates.' },
  { id: 'madeira', name: 'VALÉRIO Madeira', type: 'Digital product', progress: 58, agent: 'Research', status: 'In progress', tasks: 8, description: 'A premium island guide with maps, routes, bookings, and AI assistance.' },
  { id: 'design-channel', name: 'VALÉRIO DESIGN', type: 'Media & content', progress: 64, agent: 'Content', status: 'Planning', tasks: 6, description: 'A unified content system for Instagram, Facebook, TikTok, and Telegram.' },
  { id: 'agents', name: 'AI Agents VALÉRIO', type: 'Automation', progress: 72, agent: 'Manager', status: 'In progress', tasks: 5, description: 'Six specialist agents coordinated by one AI Manager.' },
  { id: 'technical', name: 'Technical Base', type: 'Infrastructure', progress: 46, agent: 'Developer', status: 'Planning', tasks: 7, description: 'Supabase persistence, AI Gateway, integrations, and deployment workflow.' },
];

const initialTasks = [
  { id: 1, title: 'Complete the main dashboard layout', project: 'VALÉRIO AI Dashboard', agent: 'Developer', due: 'Today', priority: 'High', done: false },
  { id: 2, title: 'Connect projects and task workflows', project: 'VALÉRIO AI Dashboard', agent: 'Manager', due: 'Tomorrow', priority: 'High', done: false },
  { id: 3, title: 'Finalize the V monogram and color system', project: 'VALÉRIO Brand System', agent: 'Design', due: 'Aug 16', priority: 'Medium', done: false },
  { id: 4, title: 'Prepare the first social content pack', project: 'VALÉRIO DESIGN', agent: 'Content', due: 'Aug 18', priority: 'Medium', done: false },
  { id: 5, title: 'Map Madeira app core user journeys', project: 'VALÉRIO Madeira', agent: 'Research', due: 'Aug 20', priority: 'Medium', done: false },
];

const initialActivity = [
  { agent: 'Design Agent', action: 'обновил файл Brand Guidelines.pdf', time: '5 мин назад', color: 'gold' },
  { agent: 'Content Agent', action: 'создал черновик публикации', time: '18 мин назад', color: 'purple' },
  { agent: 'Research Agent', action: 'добавил исследование Madeira', time: '32 мин назад', color: 'cyan' },
  { agent: 'Developer Agent', action: 'подготовил структуру интерфейса', time: '1 ч назад', color: 'blue' },
  { agent: 'Manager Agent', action: 'обновил план задач', time: '2 ч назад', color: 'orange' },
];

const nav = [
  ['Dashboard', LayoutDashboard], ['Projects', FolderKanban], ['Tasks', CheckSquare],
  ['Calendar', CalendarDays], ['Files', Files], ['Analytics', BarChart3],
];

function App() {
  const [session, setSession] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [authEmail, setAuthEmail] = useState('');
  const [authMessage, setAuthMessage] = useState('');
  const [authBusy, setAuthBusy] = useState(false);
  const [page, setPage] = useState('Dashboard');
  const [agents] = useState(initialAgents);
  const [projects, setProjects] = useState(initialProjects);
  const [tasks, setTasks] = useState(initialTasks);
  const [activity, setActivity] = useState(initialActivity);
  const [selectedProject, setSelectedProject] = useState(initialProjects[0]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [query, setQuery] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [chat, setChat] = useState([{ role: 'ai', text: 'Здравствуйте! Я VALÉRIO AI Manager. Выберите проект или задачу — помогу определить следующий шаг.' }]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [mobileNav, setMobileNav] = useState(false);
  const [toast, setToast] = useState('');

  const notify = (message) => { setToast(message); window.clearTimeout(notify.timer); notify.timer = window.setTimeout(() => setToast(''), 2400); };
  const openProject = (project) => { setSelectedProject(project); setPage('Project details'); };
  const openAgent = (agent) => { setSelectedAgent(agent); setPage('Agent workspace'); };

  useEffect(() => {
    if (!supabase) { setAuthReady(true); return; }
    let active = true;
    supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return;
      if (error) setAuthMessage(error.message);
      setSession(data?.session || null); setAuthReady(true);
    }).catch((error) => { if (active) { setAuthMessage(error.message || 'Не удалось проверить сессию.'); setAuthReady(true); } });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => { if (active) setSession(nextSession); });
    return () => { active = false; subscription.unsubscribe(); };
  }, []);

  useEffect(() => {
    if (!session?.user?.id || !supabase) return;
    let active = true;
    const loadWorkspace = async () => {
      const { data: projectRows, error: projectError } = await supabase.from('valerio_projects').select('*').order('created_at', { ascending: true });
      if (projectError) { notify('Ошибка загрузки проектов: ' + projectError.message); return; }
      let savedProjects = projectRows || [];
      if (savedProjects.length === 0) {
        const seedProjects = initialProjects.map((p) => ({ user_id: session.user.id, name: p.name, description: p.description, category: p.type, assigned_agent: p.agent, status: p.status === 'In progress' ? 'in_progress' : 'planning', progress: p.progress }));
        const { data, error } = await supabase.from('valerio_projects').insert(seedProjects).select('*');
        if (error) { notify('Не удалось создать стартовые проекты: ' + error.message); return; }
        savedProjects = data || [];
      }
      const { data: taskRows, error: taskError } = await supabase.from('valerio_tasks').select('*').order('created_at', { ascending: false });
      if (taskError) { notify('Ошибка загрузки задач: ' + taskError.message); return; }
      let savedTasks = taskRows || [];
      if (savedTasks.length === 0) {
        const idsByName = new Map(savedProjects.map((p) => [p.name, p.id]));
        const seedTasks = initialTasks.map((t) => ({ user_id: session.user.id, project_id: idsByName.get(t.project) || null, title: t.title, assigned_agent: t.agent, priority: t.priority.toLowerCase(), status: t.done ? 'done' : 'todo' }));
        const { data, error } = await supabase.from('valerio_tasks').insert(seedTasks).select('*');
        if (error) { notify('Не удалось создать стартовые задачи: ' + error.message); return; }
        savedTasks = data || [];
      }
      if (!active) return;
      const names = new Map(savedProjects.map((p) => [p.id, p.name]));
      const mappedProjects = savedProjects.map((p) => ({ id: p.id, name: p.name, type: p.category, progress: p.progress, agent: p.assigned_agent, status: p.status === 'in_progress' ? 'In progress' : p.status, tasks: savedTasks.filter((t) => t.project_id === p.id).length, description: p.description }));
      setProjects(mappedProjects); setSelectedProject(mappedProjects[0] || null);
      setTasks(savedTasks.map((t) => ({ id: t.id, title: t.title, project: names.get(t.project_id) || 'Без проекта', agent: t.assigned_agent, due: t.due_date || 'Не назначено', priority: t.priority.charAt(0).toUpperCase() + t.priority.slice(1), done: t.status === 'done' })));
    };
    loadWorkspace();
    return () => { active = false; };
  }, [session?.user?.id]);

  const addTask = async (event) => {
    event.preventDefault();
    if (!taskTitle.trim() || !selectedProject || !supabase || !session?.user?.id) return;
    const { data, error } = await supabase.from('valerio_tasks').insert({ user_id: session.user.id, project_id: selectedProject.id, title: taskTitle.trim(), assigned_agent: 'Manager', priority: 'medium', status: 'todo' }).select('*').single();
    if (error) { notify('Не удалось сохранить задачу: ' + error.message); return; }
    const task = { id: data.id, title: data.title, project: selectedProject.name, agent: data.assigned_agent, due: 'Не назначено', priority: 'Medium', done: false };
    setTasks((current) => [task, ...current]);
    setProjects((current) => current.map((p) => p.id === selectedProject.id ? { ...p, tasks: p.tasks + 1 } : p));
    setSelectedProject((current) => current ? { ...current, tasks: current.tasks + 1 } : current);
    setTaskTitle(''); setShowTaskForm(false); setPage('Tasks'); notify('Задача сохранена в облаке');
  };
  const sendChat = () => {
    if (!chatInput.trim()) return;
    const prompt = chatInput.trim();
    setChat((current) => [...current, { role: 'user', text: prompt }, { role: 'ai', text: 'Запрос принят. Следующий шаг: уточнить результат, назначить ответственного агента и разбить работу на проверяемые задачи. Подключение реальной модели AI Gateway будет следующим этапом.' }]);
    setChatInput('');
    setPage('AI Manager');
  };
  const filteredProjects = useMemo(() => projects.filter((project) => (project.name + ' ' + project.type).toLowerCase().includes(query.toLowerCase())), [projects, query]);
  const completed = tasks.filter((task) => task.done).length;

  const toggleTask = async (id) => {
    const task = tasks.find((item) => item.id === id);
    if (!task || !supabase) return;
    const done = !task.done;
    const { error } = await supabase.from('valerio_tasks').update({ status: done ? 'done' : 'todo', updated_at: new Date().toISOString() }).eq('id', id);
    if (error) { notify('Не удалось обновить задачу: ' + error.message); return; }
    setTasks((current) => current.map((item) => item.id === id ? { ...item, done } : item));
    notify(done ? 'Задача завершена' : 'Задача возвращена в работу');
  };
  const quick = (action) => {
    if (action === 'New task') { setShowTaskForm(true); return; }
    if (action === 'New project') {
      if (!supabase || !session?.user?.id) { notify('Сначала войдите в аккаунт'); return; }
      supabase.from('valerio_projects').insert({ user_id: session.user.id, name: 'Новый проект VALÉRIO', category: 'Новый проект', assigned_agent: 'Manager', status: 'planning', progress: 0, description: 'Опишите результат проекта и первый этап.' }).select('*').single().then(({ data, error }) => {
        if (error) { notify('Не удалось создать проект: ' + error.message); return; }
        const project = { id: data.id, name: data.name, type: data.category, progress: data.progress, agent: data.assigned_agent, status: 'Planning', tasks: 0, description: data.description };
        setProjects((current) => [project, ...current]); setSelectedProject(project); setPage('Project details'); notify('Проект сохранён в Supabase');
      }); return;
    }
    if (action === 'AI Assistant') { setPage('AI Manager'); return; }
    notify(action + ' — функция будет подключена на следующем этапе');
  };

  if (!authReady) return <AuthScreen title="VALÉRIO OS" message="Проверяем защищённую сессию..." />;
  if (!isSupabaseConfigured) return <AuthScreen title="Подключение облака" message="Не заданы VITE_SUPABASE_URL и VITE_SUPABASE_PUBLISHABLE_KEY. Добавьте их в настройки окружения Vercel." setup />;
  if (!session) return <AuthScreen title="Добро пожаловать в VALÉRIO" message={authMessage || 'Войдите по безопасной ссылке, которую мы отправим на вашу почту.'} email={authEmail} setEmail={setAuthEmail} busy={authBusy} onSubmit={async (event) => {
    event.preventDefault(); setAuthBusy(true); setAuthMessage('');
    const { error } = await supabase.auth.signInWithOtp({ email: authEmail.trim(), options: { emailRedirectTo: window.location.origin } });
    setAuthBusy(false); setAuthMessage(error ? error.message : 'Ссылка для входа отправлена. Проверьте почту.');
  }} />;

  return <div className="app-shell">
    <aside className={'sidebar ' + (mobileNav ? 'sidebar-open' : '')}>
      <button className="brand" onClick={() => setPage('Dashboard')}><span className="brand-mark">V</span><span className="brand-copy"><b>VALÉRIO AI</b><small>COMMAND CENTER</small></span><span className="mobile-close" aria-hidden="true"><X size={16}/></span></button>
      <div className="nav-label">MAIN</div>
      <nav className="main-nav">{nav.map(([label, Icon]) => <button key={label} className={'nav-link ' + (page === label ? 'active' : '')} onClick={() => { setPage(label); setMobileNav(false); }}><Icon size={17}/><span>{label}</span>{label === 'Tasks' && <em>{tasks.filter(t => !t.done).length}</em>}</button>)}</nav>
      <div className="nav-label agent-label">AI AGENTS</div>
      <div className="agent-nav">{agents.map((agent) => <button key={agent.id} onClick={() => { openAgent(agent); setMobileNav(false); }} className="agent-nav-item"><span className={'agent-symbol ' + agent.color}>{agent.icon}</span><span><b>{agent.name}</b><small>{agent.role}</small></span></button>)}</div>
      <div className="nav-label">SYSTEM</div>
      <button className="nav-link" onClick={() => setPage('Files')}><FileText size={17}/>Knowledge Base</button>
      <button className="nav-link" onClick={() => setPage('Settings')}><Settings size={17}/>Settings</button>
      <div className="sidebar-bottom"><div className="profile-avatar">VG</div><div><b>ValerGa</b><small>AI Manager · Owner</small></div><span className="online-dot"/></div>
    </aside>

    <main className="main-area">
      <header className="topbar">
        <button className="mobile-menu" onClick={() => setMobileNav(true)}><Menu size={19}/></button>
        <label className="global-search"><Search size={16}/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Поиск по проектам, задачам, файлам, агентам..."/><kbd>⌘ K</kbd></label>
        <div className="top-actions"><button className="top-icon" onClick={() => notify('Новых уведомлений нет')}><Bell size={18}/><i/></button><button className="top-icon" onClick={() => setPage('Settings')}><Settings size={18}/></button><button className="user-chip" onClick={() => supabase.auth.signOut()} title="Выйти"><div className="user-avatar">V</div><span><b>{session.user.email || 'ValerGa'}</b><small>Выйти из аккаунта</small></span><ChevronDown size={14}/></button></div>
      </header>

      <div className="page-content">
        <div className="welcome-row"><div><div className="eyebrow"><span className="pulse"/>YOUR PERSONAL AI COMMAND CENTER</div><h1>{page === 'Dashboard' ? 'Добро пожаловать, ValerGa!' : page}</h1><p>{page === 'Dashboard' ? 'Управляйте проектами, агентами и идеями из одного пространства.' : 'Единое рабочее пространство VALÉRIO OS.'}</p></div><div className="date-chip"><span>VALÉRIO OS</span><b>13 NOV 2026</b></div></div>

        {page === 'Dashboard' && <>
          <section className="hero-banner">
            <div className="hero-copy"><span>VALÉRIO · COMMAND CENTER</span><h2>Ideas become projects.<br/>Projects become reality.</h2><p>Одна система. Шесть AI-агентов. Ваши проекты под контролем.</p></div>
            <div className="hero-stats"><div><b>{projects.length}</b><small>Проектов</small></div><div><b>{tasks.length}</b><small>Задач</small></div><div><b>{agents.length}</b><small>AI-агентов</small></div></div>
          </section>
          <section className="metrics-grid">
            <Metric icon={FolderKanban} label="Активные проекты" value={projects.length} trend="+2 на этой неделе"/>
            <Metric icon={CheckSquare} label="Задачи в работе" value={tasks.filter(t => !t.done).length} trend={completed + ' завершено'}/>
            <Metric icon={Bot} label="AI-агенты" value={agents.length} trend="Система готова"/>
            <Metric icon={Files} label="Файлы и документы" value="—" trend="Подключим хранилище"/>
          </section>
          <section className="section-block"><SectionTitle title="AI-АГЕНТЫ VALÉRIO" action="Все агенты" onAction={() => setPage('AI Agents')}/><div className="agents-grid">{agents.map((agent) => <button key={agent.id} className="agent-card" onClick={() => openAgent(agent)}><span className={'agent-emblem ' + agent.color}>{agent.icon}</span><b>{agent.name}</b><small>{agent.role}</small><span className="agent-online"><i/>{agent.status}</span><span className="agent-open">Открыть <ArrowRight size={13}/></span></button>)}</div></section>
          <div className="dashboard-columns">
            <section className="section-block"><SectionTitle title="МОИ ПРОЕКТЫ" action="Все проекты" onAction={() => setPage('Projects')}/><div className="project-list">{projects.slice(0, 5).map((project) => <ProjectRow key={project.id} project={project} onClick={() => openProject(project)}/>)}</div></section>
            <section className="section-block"><SectionTitle title="ЛЕНТА АКТИВНОСТИ" action="Все события" onAction={() => setPage('Activity')}/><div className="activity-list">{activity.slice(0, 5).map((item, index) => <div className="activity-row" key={index}><span className={'activity-dot ' + item.color}/><div><b>{item.agent}</b><p>{item.action}</p><small>{item.time}</small></div></div>)}</div></section>
          </div>
          <div className="dashboard-columns lower-columns">
            <section className="section-block"><SectionTitle title="СЕГОДНЯШНИЕ ЗАДАЧИ" action="Все задачи" onAction={() => setPage('Tasks')}/><TaskList tasks={tasks.slice(0, 5)} toggleTask={toggleTask}/></section>
            <section className="section-block"><SectionTitle title="БЫСТРЫЕ ДЕЙСТВИЯ"/><div className="quick-actions">{['New project','New task','AI Assistant','Upload file'].map((item) => <button key={item} onClick={() => quick(item)}><Plus size={16}/>{item === 'New project' ? 'Новый проект' : item === 'New task' ? 'Новая задача' : item === 'AI Assistant' ? 'Спросить AI' : 'Загрузить файл'}</button>)}</div><div className="mini-note"><Sparkles size={16}/><span>VALÉRIO AI Manager готов помочь с планированием следующего шага.</span></div></section>
          </div>
        </>}

        {page === 'Projects' && <section className="section-block"><SectionTitle title="ВСЕ ПРОЕКТЫ" action="Новый проект" onAction={() => quick('New project')}/><div className="project-grid">{filteredProjects.map((project) => <ProjectCard key={project.id} project={project} onClick={() => openProject(project)}/>)}</div></section>}
        {page === 'Project details' && <section className="detail-layout"><div className="section-block detail-main"><span className="eyebrow">{selectedProject.type}</span><h2>{selectedProject.name}</h2><p>{selectedProject.description}</p><div className="detail-progress"><span>Прогресс</span><b>{selectedProject.progress}%</b><div className="progress-track"><i style={{width: selectedProject.progress + '%'}}/></div></div><SectionTitle title="ЗАДАЧИ ПРОЕКТА" action="Новая задача" onAction={() => setShowTaskForm(true)}/><TaskList tasks={tasks.filter(t => t.project === selectedProject.name)} toggleTask={toggleTask}/></div><div className="section-block"><SectionTitle title="ПАРАМЕТРЫ"/><Metric icon={Bot} label="Ответственный агент" value={selectedProject.agent}/><Metric icon={CheckSquare} label="Всего задач" value={selectedProject.tasks}/><Metric icon={Activity} label="Статус" value={selectedProject.status}/></div></section>}
        {page === 'Tasks' && <section className="section-block"><SectionTitle title="УПРАВЛЕНИЕ ЗАДАЧАМИ" action="Новая задача" onAction={() => setShowTaskForm(true)}/><TaskList tasks={tasks} toggleTask={toggleTask}/></section>}
        {page === 'AI Agents' && <section className="section-block"><SectionTitle title="ШЕСТЬ СПЕЦИАЛИСТОВ VALÉRIO"/><div className="agents-grid large">{agents.map((agent) => <button key={agent.id} className="agent-card" onClick={() => openAgent(agent)}><span className={'agent-emblem ' + agent.color}>{agent.icon}</span><b>{agent.name}</b><small>{agent.role}</small><span className="agent-online"><i/>{agent.status}</span><span className="agent-open">Открыть <ArrowRight size={13}/></span></button>)}</div></section>}
        {page === 'Agent workspace' && <section className="section-block agent-workspace"><span className={'agent-emblem big ' + (selectedAgent?.color || 'gold')}>{selectedAgent?.icon || 'V'}</span><span className="eyebrow">SPECIALIST WORKSPACE</span><h2>{selectedAgent?.name || 'AI Agent'}</h2><p>{selectedAgent?.role}</p><div className="agent-focus"><b>Текущий фокус</b><span>{selectedAgent?.task}</span></div><button className="gold-button" onClick={() => setPage('AI Manager')}><MessageSquare size={16}/>Открыть диалог с агентом</button></section>}
        {page === 'AI Manager' && <section className="section-block chat-panel"><div className="chat-heading"><span className="agent-emblem gold">V</span><div><b>VALÉRIO AI Manager</b><small>Центральный координатор экосистемы</small></div></div><div className="chat-messages">{chat.map((message, i) => <div key={i} className={'chat-bubble ' + message.role}>{message.text}</div>)}</div><div className="chat-compose"><input value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendChat()} placeholder="Напишите запрос AI Manager..."/><button onClick={sendChat}><Send size={16}/></button></div><small className="disclaimer">Сейчас работает интерфейс диалога. Подключение реальной модели через Vercel AI Gateway — отдельный следующий этап.</small></section>}
        {page === 'Calendar' && <section className="section-block"><SectionTitle title="КАЛЕНДАРЬ VALÉRIO"/>{['Сегодня · Проверка Dashboard','14 ноября · Brand System review','16 ноября · Madeira research checkpoint','18 ноября · Social content approval'].map((event) => <div className="calendar-row" key={event}><CalendarDays size={17}/>{event}</div>)}</section>}
        {page === 'Files' && <section className="section-block"><SectionTitle title="ФАЙЛЫ И ДОКУМЕНТЫ" action="Загрузить файл" onAction={() => notify('Загрузка файлов подключается следующим этапом')}/>{['VALÉRIO Master Plan','Brand Book','Dashboard UI System','Madeira Research','AI Agents Operating Rules'].map((file) => <div className="calendar-row" key={file}><FileText size={17}/>{file}<span>Ожидает подключения хранилища</span></div>)}</section>}
        {page === 'Analytics' && <section className="section-block"><SectionTitle title="АНАЛИТИКА VALÉRIO OS"/><div className="metrics-grid"><Metric icon={Gauge} label="Средний прогресс проектов" value="67%"/><Metric icon={CheckSquare} label="Задачи выполнены" value={completed + '/' + tasks.length}/><Metric icon={Users} label="Активные агенты" value="6/6"/><Metric icon={Activity} label="Активность" value="Live UI"/></div></section>}
        {page === 'Activity' && <section className="section-block"><SectionTitle title="АКТИВНОСТЬ WORKSPACE"/>{activity.map((item, index) => <div className="activity-row full" key={index}><span className={'activity-dot ' + item.color}/><div><b>{item.agent}</b><p>{item.action}</p><small>{item.time}</small></div></div>)}</section>}
        {page === 'Settings' && <section className="section-block"><SectionTitle title="НАСТРОЙКИ WORKSPACE"/><div className="settings-grid"><Metric icon={Sparkles} label="Интерфейс" value="Luxury Dark"/><Metric icon={Bot} label="AI Manager" value="Gateway pending"/><Metric icon={Files} label="Хранилище" value="Supabase next step"/></div></section>}
        {showTaskForm && <div className="modal-backdrop" onClick={() => setShowTaskForm(false)}><form className="task-modal" onSubmit={addTask} onClick={(e) => e.stopPropagation()}><button type="button" className="modal-close" onClick={() => setShowTaskForm(false)}>×</button><span className="eyebrow">NEW TASK</span><h2>Создать задачу</h2><p>Проект: {selectedProject.name}</p><input autoFocus value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} placeholder="Название задачи" required/><button className="gold-button" type="submit"><Plus size={16}/>Создать задачу</button></form></div>}
      </div>
      <footer><span>VALÉRIO AI COMMAND CENTER</span><span>Made with precision <b>V</b> by VALÉRIO</span></footer>
    </main>
    {mobileNav && <button className="mobile-scrim" onClick={() => setMobileNav(false)} aria-label="Close navigation"/>}
    {toast && <div className="toast"><Zap size={15}/>{toast}</div>}
  </div>;
}

function AuthScreen({ title, message, email, setEmail, busy, onSubmit, setup }) { return <div className="auth-screen"><div className="auth-card"><div className="brand-mark auth-mark">V</div><span className="eyebrow">VALÉRIO AI · COMMAND CENTER</span><h1>{title}</h1><p>{message}</p>{!setup && <form onSubmit={onSubmit}><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Ваш email" required/><button className="gold-button" disabled={busy}>{busy ? 'Отправляем...' : 'Получить ссылку для входа'}</button></form>}</div></div>; }
function Metric({ icon: Icon, label, value, trend }) { return <div className="metric-card"><div className="metric-top"><Icon size={17}/><span>{label}</span></div><b className="metric-value">{value}</b>{trend && <small>{trend}</small>}</div>; }
function SectionTitle({ title, action, onAction }) { return <div className="section-title"><h2>{title}</h2>{action && <button onClick={onAction}>{action}<ArrowUpRight size={13}/></button>}</div>; }
function ProjectRow({ project, onClick }) { return <button className="project-row" onClick={onClick}><span className="project-thumb">{project.name.startsWith('VALÉRIO') ? 'V' : '◈'}</span><span className="project-info"><b>{project.name}</b><small>{project.type}</small></span><span className="project-progress"><i><b style={{width: project.progress + '%'}}/></i><small>{project.progress}%</small></span><span className="status-pill">{project.status}</span><ChevronRight size={15}/></button>; }
function ProjectCard({ project, onClick }) { return <button className="project-card" onClick={onClick}><span className="eyebrow">{project.type}</span><h3>{project.name}</h3><p>{project.description}</p><div className="progress-track"><i style={{width: project.progress + '%'}}/></div><div className="project-card-bottom"><small>{project.agent} · {project.tasks} задач</small><b>{project.progress}%</b></div></button>; }
function TaskList({ tasks, toggleTask }) { return <div className="task-list">{tasks.length === 0 ? <p className="empty-state">Пока нет задач для этого проекта.</p> : tasks.map((task) => <button className={'task-row ' + (task.done ? 'completed' : '')} key={task.id} onClick={() => toggleTask(task.id)}><CheckCircle2 size={17}/><span><b>{task.title}</b><small>{task.project} · {task.agent}</small></span><em className={'priority ' + task.priority.toLowerCase()}>{task.priority}</em><small className="task-due">{task.due}</small></button>)}</div>; }

createRoot(document.getElementById('root')).render(<App/>);
