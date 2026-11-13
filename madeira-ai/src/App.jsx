import React, { useEffect, useMemo, useState } from 'react';
import {
  Anchor, ArrowUpRight, Bookmark, BriefcaseBusiness, Building2, CarFront,
  Check, ChevronDown, Compass, Globe2, Hotel, Languages, Leaf, Map,
  MapPin, Menu, MessageCircle, Navigation, Mountain, Search, Send, ShieldCheck,
  Sparkles, Sun, Waves, X, CloudSun, Plane, CircleUserRound, LogIn, LogOut
} from 'lucide-react';
import { supabase, supabaseConfigured } from './lib/supabase';

const copy = {
  ru: {
    nav:['Обзор','Исследовать','Недвижимость','Путешествия','Бизнес и инвестиции','Транспорт','Погода','AI-консьерж'],
    eyebrow:'ОДИН ОСТРОВ · МНОГО ВОЗМОЖНОСТЕЙ',
    headline:'Откройте Мадейру\nпо-новому.',
    intro:'Ваш интеллектуальный центр острова — для путешествий, жизни, недвижимости и новых идей.',
    explore:'Исследовать остров', ask:'Спросить MADEIRA AI', discover:'Остров в фокусе',
    forAll:'Для путешественников, жителей и инвесторов',
    quick:'Всё необходимое — в одном месте',
    places:'Места, которые стоит открыть', areas:'Регионы острова',
    property:'Недвижимость и земля', propertyText:'Изучайте районы, готовьте проверку объекта и сохраняйте интересные варианты.',
    business:'Бизнес-возможности', businessText:'Идеи для исследования, партнёрства и развития местных сервисов.',
    travel:'Планируйте поездку', travelText:'Маршруты, природа, океан и впечатления на любой вкус.',
    map:'Интерактивная карта', concierge:'Ваш помощник по Мадейре',
    search:'Поиск мест, районов и идей…', saved:'Сохранённое', signIn:'Войти', signOut:'Выйти',
    guest:'Гостевой режим', cloud:'Облачный аккаунт', demo:'Демо-режим',
    all:'Все', nature:'Природа', city:'Города', coast:'Побережье',
    askPlaceholder:'Спросите о Мадейре…', send:'Отправить',
    preview:'Источники данных', previewText:'Официальные источники Мадейры и погодные данные IPMA уже подключены в серверном коде. Для активации AI-консьержа требуется настроить серверный ключ OpenAI.',
    author:'Создано VALÉRIO',
    locationTitle:'Погода рядом с вами', locationHint:'Нажмите кнопку, чтобы показать погоду и город по GPS.', locate:'Определить моё местоположение', locating:'Определяем местоположение…', refreshLocation:'Обновить', feelsLike:'Ощущается как', humidity:'Влажность', wind:'Ветер', locationPermission:'Разрешите доступ к геолокации в браузере.', locationUnavailable:'Геолокация недоступна на этом устройстве.', locationFailed:'Не удалось определить местоположение. Проверьте разрешение браузера.'
  },
  en: {
    nav:['Overview','Explore','Real estate','Travel','Business & invest','Transport','Weather','AI concierge'],
    eyebrow:'ONE ISLAND · MANY POSSIBILITIES',
    headline:'Discover Madeira\nin a new way.',
    intro:'Your intelligent island hub for travel, living, real estate and new opportunities.',
    explore:'Explore the island', ask:'Ask MADEIRA AI', discover:'Island in focus',
    forAll:'For travellers, residents and investors', quick:'Everything you need in one place',
    places:'Places worth discovering', areas:'Island regions',
    property:'Real estate & land', propertyText:'Explore areas, prepare property due diligence and save interesting options.',
    business:'Business opportunities', businessText:'Ideas to research, partnerships and local services.',
    travel:'Plan your trip', travelText:'Routes, nature, ocean and experiences for every traveller.',
    map:'Interactive map', concierge:'Your Madeira assistant',
    search:'Search places, areas and ideas…', saved:'Saved', signIn:'Sign in', signOut:'Sign out',
    guest:'Guest mode', cloud:'Cloud account', demo:'Demo mode',
    all:'All', nature:'Nature', city:'Cities', coast:'Coast',
    askPlaceholder:'Ask about Madeira…', send:'Send',
    preview:'Data sources', previewText:'Official Madeira sources and IPMA weather data are wired into the server. The OpenAI server key must be configured to activate the AI concierge.',
    author:'Created by VALÉRIO',
    locationTitle:'Weather near you', locationHint:'Use the button to show local weather and your city using GPS.', locate:'Use my location', locating:'Finding your location…', refreshLocation:'Refresh', feelsLike:'Feels like', humidity:'Humidity', wind:'Wind', locationPermission:'Allow location access in your browser.', locationUnavailable:'Geolocation is unavailable on this device.', locationFailed:'Could not determine your location. Check browser permission.'
  },
  pt: {
    nav:['Visão geral','Explorar','Imobiliário','Viagens','Negócios e investimento','Transportes','Tempo','Assistente IA'],
    eyebrow:'UMA ILHA · MUITAS POSSIBILIDADES',
    headline:'Descubra a Madeira\nde uma nova forma.',
    intro:'O seu centro inteligente da ilha para viajar, viver, imobiliário e novas oportunidades.',
    explore:'Explorar a ilha', ask:'Perguntar à MADEIRA AI', discover:'A ilha em destaque',
    forAll:'Para viajantes, residentes e investidores', quick:'Tudo o que precisa num só lugar',
    places:'Locais a descobrir', areas:'Regiões da ilha',
    property:'Imobiliário e terrenos', propertyText:'Explore zonas, prepare a análise do imóvel e guarde opções interessantes.',
    business:'Oportunidades de negócio', businessText:'Ideias para pesquisar, parcerias e serviços locais.',
    travel:'Planeie a sua viagem', travelText:'Percursos, natureza, oceano e experiências para todos.',
    map:'Mapa interativo', concierge:'O seu assistente da Madeira',
    search:'Pesquisar locais, zonas e ideias…', saved:'Guardados', signIn:'Entrar', signOut:'Sair',
    guest:'Modo visitante', cloud:'Conta na nuvem', demo:'Modo de demonstração',
    all:'Todos', nature:'Natureza', city:'Cidades', coast:'Costa',
    askPlaceholder:'Pergunte sobre a Madeira…', send:'Enviar',
    preview:'Fontes de dados', previewText:'As fontes oficiais da Madeira e os dados meteorológicos do IPMA já estão ligados no servidor. É necessário configurar a chave OpenAI no servidor para ativar o assistente IA.',
    author:'Criado por VALÉRIO',
    locationTitle:'Meteorologia perto de si', locationHint:'Toque no botão para ver o tempo local e a sua cidade por GPS.', locate:'Usar a minha localização', locating:'A determinar localização…', refreshLocation:'Atualizar', feelsLike:'Sensação térmica', humidity:'Humidade', wind:'Vento', locationPermission:'Permita o acesso à localização no navegador.', locationUnavailable:'A geolocalização não está disponível neste dispositivo.', locationFailed:'Não foi possível determinar a localização. Verifique a permissão do navegador.'
  }
};

const places = [
  {id:'pico-ruivo',name:'Pico Ruivo',area:'Santana',kind:'nature',tag:'Горы и панорамы',icon:Mountain,desc:'Одна из самых высоких вершин острова. Перед походом проверяйте состояние маршрутов и погоду.'},
  {id:'funchal',name:'Funchal',area:'Южное побережье',kind:'city',tag:'Городская жизнь',icon:Building2,desc:'Столица острова: набережная, рынки, музеи, рестораны и городские прогулки.'},
  {id:'porto-moniz',name:'Porto Moniz',area:'Северо-запад',kind:'coast',tag:'Океан и бассейны',icon:Waves,desc:'Известен природными лавовыми бассейнами и видами на Атлантику.'},
  {id:'ponta-sao-lourenco',name:'Ponta de São Lourenço',area:'Machico',kind:'nature',tag:'Тропа у океана',icon:Compass,desc:'Восточный полуостров с выразительными скалами и открытыми океанскими видами.'},
  {id:'cabo-girao',name:'Cabo Girão',area:'Câmara de Lobos',kind:'coast',tag:'Смотровая площадка',icon:MapPin,desc:'Высокая прибрежная смотровая площадка с панорамой южного побережья.'},
  {id:'santana',name:'Santana',area:'Север острова',kind:'city',tag:'Традиционная архитектура',icon:Leaf,desc:'Горный муниципалитет, известный традиционными треугольными домами.'}
];

const areas = [
  {name:'Funchal',note:'Столичная инфраструктура, услуги и городская жизнь'},
  {name:'Câmara de Lobos',note:'Прибрежные районы рядом с Фуншалом'},
  {name:'Calheta',note:'Юго-запад, побережье и сельские территории'},
  {name:'Machico',note:'Восток острова и доступ к аэропорту'},
  {name:'Santana',note:'Горы, природа и северное побережье'},
  {name:'Porto Moniz',note:'Северо-запад и природный туризм'}
];

const ideas = [
  {title:'Сервисы для самостоятельных путешественников',kind:'Туризм',priority:'Исследовать',text:'Проверить спрос на единый сервис маршрутов, транспорта, локальных гидов и бронирований.'},
  {title:'Поддержка владельцев жилья',kind:'Недвижимость',priority:'Исследовать',text:'Изучить потребность в управлении объектами, обслуживании и сопровождении гостей.'},
  {title:'Локальные впечатления вне высокого сезона',kind:'Партнёрства',priority:'Исследовать',text:'Проверить возможности совместных предложений с местными операторами и производителями.'}
];

function App(){
  const [lang,setLang]=useState('ru');
  const [active,setActive]=useState('overview');
  const [filter,setFilter]=useState('all');
  const [query,setQuery]=useState('');
  const [saved,setSaved]=useState(()=>JSON.parse(localStorage.getItem('madeira-saved')||'[]'));
  const [user,setUser]=useState(null);
  const [authOpen,setAuthOpen]=useState(false);
  const [authMode,setAuthMode]=useState('signin');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [authError,setAuthError]=useState('');
  const [busy,setBusy]=useState(false);
  const [assistantBusy,setAssistantBusy]=useState(false);
  const [weatherData,setWeatherData]=useState(null);
  const [weatherError,setWeatherError]=useState('');
  const [locationWeather,setLocationWeather]=useState(null);
  const [locationBusy,setLocationBusy]=useState(false);
  const [locationError,setLocationError]=useState('');
  const [sources,setSources]=useState([]);
  const [chat,setChat]=useState([]);
  const [message,setMessage]=useState('');
  const [mobileOpen,setMobileOpen]=useState(false);
  const t=copy[lang];

  useEffect(()=>{
    if(!supabase) return;
    supabase.auth.getSession().then(({data})=>setUser(data.session?.user||null));
    const {data:{subscription}}=supabase.auth.onAuthStateChange((_event,session)=>setUser(session?.user||null));
    return ()=>subscription.unsubscribe();
  },[]);

  useEffect(()=>{
    localStorage.setItem('madeira-saved',JSON.stringify(saved));
  },[saved]);

  useEffect(()=>{
    fetch('/api/sources').then(r=>r.ok?r.json():Promise.reject()).then(data=>setSources(data.sources||[])).catch(()=>setSources([]));
  },[]);

  useEffect(()=>{
    if(active!=='weather'||weatherData) return;
    fetch('/api/weather').then(r=>r.ok?r.json():r.json().then(e=>Promise.reject(new Error(e.error||'IPMA unavailable')))).then(setWeatherData).catch(e=>setWeatherError(e.message||'IPMA data unavailable'));
  },[active,weatherData]);

  useEffect(()=>{
    if(!supabase||!user) return;
    supabase.from('saved_places').select('place_id').eq('user_id',user.id)
      .then(({data,error})=>{if(!error&&data)setSaved(data.map(x=>x.place_id));});
  },[user]);

  const visiblePlaces=useMemo(()=>places.filter(p=>(filter==='all'||p.kind===filter)&&
    (p.name+' '+p.area+' '+p.tag).toLowerCase().includes(query.toLowerCase())),[filter,query]);

  const toggleSaved=async(id)=>{
    const next=saved.includes(id)?saved.filter(x=>x!==id):[...saved,id];
    setSaved(next);
    if(supabase&&user){
      if(next.includes(id)) await supabase.from('saved_places').upsert({user_id:user.id,place_id:id},{onConflict:'user_id,place_id'});
      else await supabase.from('saved_places').delete().eq('user_id',user.id).eq('place_id',id);
    }
  };

  const submitAuth=async(e)=>{
    e.preventDefault();setBusy(true);setAuthError('');
    if(!supabase){setAuthError('Сначала подключите VITE_SUPABASE_URL и VITE_SUPABASE_ANON_KEY.');setBusy(false);return;}
    const result=authMode==='signup'
      ? await supabase.auth.signUp({email,password})
      : await supabase.auth.signInWithPassword({email,password});
    if(result.error)setAuthError(result.error.message);
    else if(authMode==='signup'&&!result.data.session)setAuthError('Проверьте почту и подтвердите регистрацию.');
    else setAuthOpen(false);
    setBusy(false);
  };

  const signOut=async()=>{if(supabase)await supabase.auth.signOut();setUser(null);};

  const detectLocation=()=>{
    if(!navigator.geolocation){setLocationError(t.locationUnavailable);return;}
    setLocationBusy(true);setLocationError('');
    navigator.geolocation.getCurrentPosition(async({coords})=>{
      try{
        const params=new URLSearchParams({lat:String(coords.latitude),lon:String(coords.longitude)});
        const response=await fetch('/api/location-weather?'+params.toString());
        const data=await response.json();
        if(!response.ok)throw new Error(data.error||'Location weather unavailable');
        setLocationWeather(data);
      }catch(error){setLocationError(error.message||t.locationFailed);}
      finally{setLocationBusy(false);}
    },(error)=>{
      setLocationError(error.code===1?t.locationPermission:t.locationFailed);
      setLocationBusy(false);
    },{enableHighAccuracy:false,timeout:10000,maximumAge:300000});
  };

  const weatherDescription=(code)=>{
    const labels={0:['Ясно','Clear','Céu limpo'],1:['Преимущественно ясно','Mainly clear','Predominantemente limpo'],2:['Переменная облачность','Partly cloudy','Parcialmente nublado'],3:['Пасмурно','Overcast','Encoberto'],45:['Туман','Fog','Nevoeiro'],48:['Изморозь и туман','Rime fog','Nevoeiro gelado'],51:['Лёгкая морось','Light drizzle','Chuvisco fraco'],53:['Морось','Drizzle','Chuvisco'],55:['Сильная морось','Dense drizzle','Chuvisco intenso'],61:['Небольшой дождь','Light rain','Chuva fraca'],63:['Дождь','Rain','Chuva'],65:['Сильный дождь','Heavy rain','Chuva forte'],71:['Небольшой снег','Light snow','Neve fraca'],73:['Снег','Snow','Neve'],75:['Сильный снег','Heavy snow','Neve forte'],80:['Кратковременный дождь','Rain showers','Aguaceiros'],81:['Ливни','Rain showers','Aguaceiros'],82:['Сильные ливни','Heavy showers','Aguaceiros fortes'],95:['Гроза','Thunderstorm','Trovoada'],96:['Гроза с градом','Thunderstorm with hail','Trovoada com granizo'],99:['Сильная гроза с градом','Severe thunderstorm','Trovoada forte']};
    return labels[code]?.[['ru','en','pt'].indexOf(lang)]|| (lang==='en'?'Weather conditions':lang==='pt'?'Condições meteorológicas':'Погодные условия');
  };

  const sendChat=async(e)=>{
    e.preventDefault();if(!message.trim()||assistantBusy)return;
    const q=message.trim();
    const next=[...chat,{role:'user',text:q}];
    setChat(next);setMessage('');setAssistantBusy(true);
    try{
      const response=await fetch('/api/concierge',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:next.slice(-10).map(m=>({role:m.role,content:m.text}))})});
      const data=await response.json();
      if(!response.ok)throw new Error(data.error||'AI service unavailable');
      setChat(old=>[...old,{role:'assistant',text:data.answer}]);
    }catch(error){setChat(old=>[...old,{role:'assistant',text:'MADEIRA AI: '+error.message+'\nПроверьте OPENAI_API_KEY в серверных переменных Vercel.'}]);}
    finally{setAssistantBusy(false);}
  };

  const openSection=(id)=>{setActive(id);setMobileOpen(false);};

  const renderHeader=()=> <header className="topbar">
    <button className="mobile-menu" onClick={()=>setMobileOpen(!mobileOpen)} aria-label="Menu"><Menu size={20}/></button>
    <div className="crumb"><span>MADEIRA AI</span><i>/</i>{t.nav[['overview','explore','property','travel','invest','transport','weather','concierge'].indexOf(active)]}</div>
    <div className="top-actions">
      <label className="searchbox"><Search size={16}/><input value={query} onChange={e=>{setQuery(e.target.value);if(active==='overview')setActive('explore');}} placeholder={t.search}/><kbd>⌘ K</kbd></label>
      <select className="language" value={lang} onChange={e=>setLang(e.target.value)} aria-label="Language"><option value="ru">RU</option><option value="en">EN</option><option value="pt">PT</option></select>
      {user?<button className="user-pill" onClick={signOut}><CircleUserRound size={16}/><span>{user.email?.split('@')[0]}</span><LogOut size={14}/></button>:<button className="sign-button" onClick={()=>setAuthOpen(true)}><LogIn size={15}/>{t.signIn}</button>}
    </div>
  </header>;

  const placeCard=(p)=> <article className="place-card" key={p.id}>
    <div className={'place-art art-'+p.kind}><p.icon size={31}/><span>{p.tag}</span></div>
    <div className="place-body"><div className="place-meta"><span><MapPin size={12}/>{p.area}</span><button className={saved.includes(p.id)?'saved active':'saved'} onClick={()=>toggleSaved(p.id)} aria-label="Save place"><Bookmark size={16} fill={saved.includes(p.id)?'currentColor':'none'}/></button></div><h3>{p.name}</h3><p>{p.desc}</p></div>
  </article>;

  return <div className="app-shell">
    <aside className={'sidebar '+(mobileOpen?'open':'')}>
      <div className="brand"><div className="brand-mark"><Compass size={23}/></div><div><b>MADEIRA AI</b><small>ISLAND INTELLIGENCE</small></div><button className="close-menu" onClick={()=>setMobileOpen(false)}><X size={18}/></button></div>
      <div className="side-label">DISCOVER</div>
      <nav>{['overview','explore','property','travel','invest','transport','weather','concierge'].map((id,i)=>{
        const icons=[Map,Compass,Building2,Plane,BriefcaseBusiness,CarFront,CloudSun,MessageCircle];const Icon=icons[i];
        return <button key={id} className={active===id?'nav-item active':'nav-item'} onClick={()=>openSection(id)}><Icon size={17}/><span>{t.nav[i]}</span>{id==='concierge'&&<span className="new-dot"/>}</button>;
      })}</nav>
      <div className="sidebar-bottom">
        <div className="account-state"><span className="status-dot"/><div><b>{user?t.cloud:t.guest}</b><small>{supabaseConfigured?'Supabase '+(user?'connected':'ready'):t.demo}</small></div></div>
        <div className="creator">{t.author}</div>
      </div>
    </aside>

    <main className="main-area">
      {renderHeader()}
      <div className="page-content">
        {active==='overview'&&<section>
          <div className="hero">
            <div className="hero-copy"><div className="eyebrow"><span/> {t.eyebrow}</div><h1>{t.headline.split('\n').map((s,i)=><React.Fragment key={s}>{i>0&&<br/>}{s}</React.Fragment>)}</h1><p>{t.intro}</p><div className="hero-actions"><button className="primary" onClick={()=>openSection('explore')}>{t.explore}<ArrowUpRight size={16}/></button><button className="ghost" onClick={()=>openSection('concierge')}><Sparkles size={16}/>{t.ask}</button></div><div className="hero-foot"><span className="avatar-stack"><i>✦</i><i>⌂</i><i>↗</i></span>{t.forAll}</div></div>
            <div className="hero-visual"><div className="sun-glow"/><div className="hero-orbit orbit-one"/><div className="hero-orbit orbit-two"/><div className="hero-island"><Mountain size={88} strokeWidth={1}/><Waves size={50} strokeWidth={1}/></div><div className="floating-chip chip-top"><MapPin size={14}/> 32° 45′ N · 16° 57′ W</div><div className="floating-chip chip-bottom"><Sun size={15}/> Atlantic · Madeira</div><div className="hero-caption">ATLANTIC<br/><b>MADEIRA</b></div></div>
          </div>
          <div className="location-weather-card">
            <div className="location-weather-heading"><div><span className="eyebrow">LIVE · LOCAL WEATHER</span><h2>{t.locationTitle}</h2></div><div className="location-weather-icon"><CloudSun size={27}/></div></div>
            {locationWeather? <div className="location-weather-data"><div className="location-temperature"><strong>{Math.round(locationWeather.current.temperatureC)}°</strong><span>{weatherDescription(locationWeather.current.weatherCode)}</span><small>{locationWeather.location.name}{locationWeather.location.country?', '+locationWeather.location.country:''}</small></div><div className="location-weather-details"><span>{t.feelsLike} <b>{Math.round(locationWeather.current.feelsLikeC)}°C</b></span><span>{t.humidity} <b>{locationWeather.current.humidity}%</b></span><span>{t.wind} <b>{Math.round(locationWeather.current.windKmh)} km/h</b></span></div></div>:<p className="location-weather-hint">{t.locationHint}</p>}
            {locationError&&<p className="location-weather-error" role="status">{locationError}</p>}
            <button className="location-detect-button" onClick={detectLocation} disabled={locationBusy}><Navigation size={15}/>{locationBusy?t.locating:locationWeather?t.refreshLocation:t.locate}</button>
            {locationWeather&&<small className="location-weather-updated">Open-Meteo · {new Date(locationWeather.fetchedAt).toLocaleTimeString()}</small>}
          </div>
          <div className="section-heading"><div><span className="eyebrow">{t.discover}</span><h2>{t.quick}</h2></div><span className="subtle-tag">01 / 08</span></div>
          <div className="feature-grid">
            <button className="feature-card feature-explore" onClick={()=>openSection('explore')}><div className="feature-icon"><Compass/></div><span>01 · EXPLORE</span><h3>{t.places}</h3><ArrowUpRight/></button>
            <button className="feature-card feature-property" onClick={()=>openSection('property')}><div className="feature-icon"><Building2/></div><span>02 · PROPERTY</span><h3>{t.property}</h3><ArrowUpRight/></button>
            <button className="feature-card feature-travel" onClick={()=>openSection('travel')}><div className="feature-icon"><Plane/></div><span>03 · TRAVEL</span><h3>{t.travel}</h3><ArrowUpRight/></button>
            <button className="feature-card feature-invest" onClick={()=>openSection('invest')}><div className="feature-icon"><BriefcaseBusiness/></div><span>04 · OPPORTUNITY</span><h3>{t.business}</h3><ArrowUpRight/></button>
          </div>
          <div className="split-section">
            <div className="section-heading"><div><span className="eyebrow">EXPLORE THE ISLAND</span><h2>{t.places}</h2></div><button className="text-link" onClick={()=>openSection('explore')}>Все места <ArrowUpRight size={15}/></button></div>
            <div className="places-grid">{places.slice(0,3).map(placeCard)}</div>
          </div>
          <div className="bottom-promo"><div className="promo-icon"><Sparkles/></div><div><span className="eyebrow">MADEIRA AI CONCIERGE</span><h2>{t.concierge}</h2><p>{t.previewText}</p></div><button className="primary" onClick={()=>openSection('concierge')}>{t.ask}<ArrowUpRight size={16}/></button></div>
        </section>}

        {active==='explore'&&<section className="module-page"><div className="module-intro"><span className="eyebrow">EXPLORE MADEIRA</span><h1>{t.places}</h1><p>{t.intro}</p></div><div className="filter-row">{[['all',t.all],['nature',t.nature],['city',t.city],['coast',t.coast]].map(([id,label])=><button key={id} onClick={()=>setFilter(id)} className={filter===id?'filter active':'filter'}>{label}</button>)}</div><div className="places-grid">{visiblePlaces.map(placeCard)}</div><div className="map-panel"><div className="map-heading"><div><span className="eyebrow">OPENSTREETMAP</span><h2>{t.map}</h2></div><Map size={22}/></div><iframe title="Map of Madeira" src="https://www.openstreetmap.org/export/embed.html?bbox=-17.25%2C32.62%2C-16.55%2C32.95&layer=mapnik" loading="lazy"/><a href="https://www.openstreetmap.org/#map=10/32.75/-17.0" target="_blank" rel="noreferrer">Открыть карту полностью <ArrowUpRight size={13}/></a></div></section>}

        {active==='property'&&<section className="module-page"><div className="module-intro"><span className="eyebrow">REAL ESTATE INTELLIGENCE</span><h1>{t.property}</h1><p>{t.propertyText}</p></div><div className="notice-card"><ShieldCheck size={22}/><div><b>Проверка важнее красивого объявления</b><p>До покупки участка или дома проверьте PDM муниципалитета, классификацию земли, доступ к дороге, инфраструктуру, ограничения REN/RAN и возможность лицензирования.</p></div></div><h2 className="subheading">{t.areas}</h2><div className="area-grid">{areas.map(a=><article className="area-card" key={a.name}><MapPin size={18}/><h3>{a.name}</h3><p>{a.note}</p><button onClick={()=>{setQuery(a.name);openSection('explore')}}>Изучить район <ArrowUpRight size={14}/></button></article>)}</div><div className="source-note"><b>Важно:</b> это справочник районов, а не каталог доступных объектов. Проверяйте классификацию земли и допустимость строительства по официальным документам.</div><div className="official-source-list"><h2>Официальные источники для проверки недвижимости</h2>{sources.filter(x=>x.category==='property').map(x=><a key={x.id} href={x.url} target="_blank" rel="noreferrer"><b>{x.name}</b><span>{x.description}</span><small>{x.updateNote}</small></a>)}</div></section>}

        {active==='travel'&&<section className="module-page"><div className="module-intro"><span className="eyebrow">TRAVEL PLANNER</span><h1>{t.travel}</h1><p>{t.travelText}</p></div><div className="travel-grid"><article className="travel-card large"><Mountain/><span>OUTDOOR</span><h2>Горы и levadas</h2><p>Планируйте прогулки с учётом погоды, уровня сложности и официального статуса троп.</p></article><article className="travel-card coast"><Waves/><span>ATLANTIC</span><h2>Океан и побережье</h2><p>Пляжи, природные бассейны и панорамные точки.</p></article><article className="travel-card city"><Hotel/><span>STAY</span><h2>Проживание</h2><p>Подбор размещения и районов для поездки — следующий этап каталога.</p></article></div><div className="source-note">Статус троп, погодные предупреждения и условия посещения необходимо проверять перед поездкой в официальных источниках.</div></section>}

        {active==='invest'&&<section className="module-page"><div className="module-intro"><span className="eyebrow">BUSINESS & INVESTMENT</span><h1>{t.business}</h1><p>{t.businessText}</p></div><div className="notice-card"><BriefcaseBusiness size={22}/><div><b>Возможности для дальнейшего исследования</b><p>Ниже — направления для проверки спроса, а не подтверждённые инвестиционные предложения или обещание доходности.</p></div></div><div className="idea-list">{ideas.map((idea,i)=><article className="idea-card" key={idea.title}><div className="idea-number">0{i+1}</div><div><span className="eyebrow">{idea.kind}</span><h3>{idea.title}</h3><p>{idea.text}</p></div><span className="priority">{idea.priority}</span></article>)}</div><div className="official-source-list"><h2>Официальные источники для исследования</h2>{sources.filter(x=>['property','tourism'].includes(x.category)).map(x=><a key={x.id} href={x.url} target="_blank" rel="noreferrer"><b>{x.name}</b><span>{x.description}</span><small>{x.updateNote}</small></a>)}</div></section>}

        {active==='transport'&&<section className="module-page"><div className="module-intro"><span className="eyebrow">GET AROUND</span><h1>Транспорт на Мадейре</h1><p>Сравнение способов передвижения по острову.</p></div><div className="transport-grid">{[{icon:CarFront,title:'Аренда автомобиля',text:'Гибкость для поездок по острову. Уточняйте условия страховки, парковки и горных дорог.'},{icon:Anchor,title:'Морские трансферы',text:'Морские прогулки и локальные перевозчики — проверяйте расписание у оператора.'},{icon:Plane,title:'Аэропорт и трансфер',text:'Планирование поездки из аэропорта и предварительный заказ трансфера.'}].map(x=><article className="transport-card" key={x.title}><x.icon size={24}/><h3>{x.title}</h3><p>{x.text}</p></article>)}</div><div className="source-note">Бронирование и актуальные тарифы пока не подключены. Не используйте демонстрационные данные как подтверждение доступности услуг.</div></section>}

        {active==='weather'&&<section className="module-page"><div className="module-intro"><span className="eyebrow">ISLAND WEATHER</span><h1>Погода на Мадейре</h1><p>Климат на острове различается по высоте и побережью. Перед походами и поездками сверяйте прогноз и предупреждения.</p></div><div className="weather-grid"><div className="weather-main"><CloudSun size={46}/><span>IPMA · ОФИЦИАЛЬНЫЙ ИСТОЧНИК</span><h2>Прогноз по острову</h2><p>Официальные данные IPMA. Погода в горах может отличаться от побережья.</p><small className="live-stamp">{weatherData?'Получено: '+new Date(weatherData.fetchedAt).toLocaleString():'Загружаем прогноз…'}</small></div><div className="weather-links"><h3>Официальные источники</h3><a href="https://api.ipma.pt/" target="_blank" rel="noreferrer">IPMA API <ArrowUpRight size={14}/></a><a href="https://www.procivmadeira.pt/" target="_blank" rel="noreferrer">Proteção Civil Madeira <ArrowUpRight size={14}/></a></div></div>{weatherError&&<div className="source-note">IPMA временно недоступен: {weatherError}. Проверьте первоисточник.</div>}{weatherData?.warnings?.length>0&&<div className="notice-card weather-warning"><ShieldCheck size={20}/><div><b>Метеопредупреждения для Мадейры</b><p>{weatherData.warnings.map((w,i)=><span key={i}>{w.awarenessTypeName||w.awarenessType||'Предупреждение'} · {w.awarenessLevelName||w.awarenessLevel||'Уровень'} </span>)}</p></div></div>}<div className="forecast-grid">{(weatherData?.locations||[]).filter(x=>x.available).map(location=><article className="forecast-card" key={location.id}><span>{location.name}</span><b>{location.days?.[0]?.maxC??'—'}° <small>/ {location.days?.[0]?.minC??'—'}°</small></b><p>{location.days?.[0]?.date||'—'} · Осадки: {location.days?.[0]?.rainProbability??'—'}%</p><small>IPMA · {location.updatedAt||'обновление не указано'}</small></article>)}</div></section>}

        {active==='concierge'&&<section className="module-page"><div className="module-intro"><span className="eyebrow">MADEIRA AI · CONCIERGE</span><h1>{t.concierge}</h1><p>{t.previewText}</p></div><div className="chat-panel"><div className="chat-top"><div className="ai-avatar"><Sparkles/></div><div><b>MADEIRA AI</b><small>Island assistant · Server API</small></div><span className="preview-pill">API</span></div><div className="chat-messages">{chat.length===0&&<div className="welcome-message"><Sparkles size={25}/><h3>Чем помочь на Мадейре?</h3><p>Спросите о районах, маршрутах, недвижимости или идеях для поездки.</p><div className="suggestions">{['Что посмотреть за 3 дня?','Где искать участок для виллы?','Как подготовиться к походу?'].map(q=><button key={q} onClick={()=>setMessage(q)}>{q}<ArrowUpRight size={13}/></button>)}</div></div>}{chat.map((m,i)=><div className={'chat-bubble '+m.role} key={i}>{m.text}</div>)}</div><form className="chat-form" onSubmit={sendChat}><input value={message} onChange={e=>setMessage(e.target.value)} placeholder={t.askPlaceholder}/><button className="primary" type="submit" disabled={assistantBusy}><Send size={16}/>{assistantBusy?'…':t.send}</button></form><div className="chat-disclaimer">{assistantBusy?'MADEIRA AI формирует ответ…':'AI-ответы доступны через серверный API. Данные IPMA и официальные источники указаны отдельно.'}</div></div></section>}

        <footer className="page-footer"><span>MADEIRA AI · ISLAND INTELLIGENCE</span><span>{t.author}</span></footer>
      </div>
    </main>

    {authOpen&&<div className="modal-backdrop" onClick={()=>setAuthOpen(false)}><div className="auth-modal" onClick={e=>e.stopPropagation()}><button className="modal-close" onClick={()=>setAuthOpen(false)}><X size={18}/></button><div className="brand-mark"><Compass size={22}/></div><span className="eyebrow">MADEIRA AI ACCOUNT</span><h2>{authMode==='signin'?'С возвращением':'Создать аккаунт'}</h2><p>Сохраняйте любимые места и свои планы в облаке.</p><form onSubmit={submitAuth}><label>Email<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required/></label><label>Пароль<input type="password" value={password} onChange={e=>setPassword(e.target.value)} minLength={6} required/></label>{authError&&<div className="auth-error">{authError}</div>}<button className="primary full" disabled={busy}>{busy?'…':authMode==='signin'?'Войти':'Зарегистрироваться'}</button></form><button className="switch-auth" onClick={()=>{setAuthMode(authMode==='signin'?'signup':'signin');setAuthError('')}}>{authMode==='signin'?'Нет аккаунта? Зарегистрироваться':'Уже есть аккаунт? Войти'}</button></div></div>}
  </div>;
}

function localAnswer(q,lang){
  const s=q.toLowerCase();
  if(s.includes('3 дня')||s.includes('three day'))return 'Для первого знакомства распределите поездку по регионам: день 1 — Фуншал и южное побережье; день 2 — горные виды и levadas; день 3 — северо-запад и Porto Moniz. Проверьте прогноз, статус троп и время в пути перед выездом.';
  if(s.includes('участ')||s.includes('земл')||s.includes('villa')||s.includes('property'))return 'Начните с выбора 2–3 муниципалитетов и проверки PDM, категории земли, ограничений REN/RAN, подъездной дороги, воды и электричества. До внесения задатка получите письменную информацию о допустимом строительстве в Câmara Municipal.';
  if(s.includes('поход')||s.includes('троп')||s.includes('hike'))return 'Перед походом проверьте официальный статус маршрута, предупреждения IPMA и Proteção Civil, подходящую обувь, воду и запас времени. Погода на побережье и в горах может сильно различаться.';
  return lang==='en'?'I can help you explore Madeira, plan a trip or prepare property research. This is a preview assistant; connect the AI service for live answers.':'Я помогу исследовать Мадейру, спланировать поездку или подготовить проверку недвижимости. Сейчас это демонстрационный помощник; для актуальных ответов нужно подключить AI API.';
}

export default App;
