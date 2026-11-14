import React, { useEffect, useMemo, useState } from 'react';
import {
  Anchor, ArrowUpRight, Bookmark, BriefcaseBusiness, Building2, CarFront, FolderOpen,
  Check, ChevronDown, Compass, Globe2, Hotel, Languages, Leaf, Map,
  MapPin, Menu, MessageCircle, Navigation, Mountain, Search, Send, ShieldCheck,
  Sparkles, Sun, Waves, X, CloudSun, Plane, CircleUserRound, LogIn, LogOut
} from 'lucide-react';
import { supabase, supabaseConfigured } from './lib/supabase';
import IslandMap from './IslandMap';

const copy = {
  ru: {
    nav:['Обзор','Архипелаг','Исследовать','Недвижимость','Путешествия','Бизнес и инвестиции','Транспорт','Погода','AI-консьерж'],
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
    nav:['Overview','Archipelago','Explore','Real estate','Travel','Business & invest','Transport','Weather','AI concierge'],
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
    nav:['Visão geral','Arquipélago','Explorar','Imobiliário','Viagens','Negócios e investimento','Transportes','Tempo','Assistente IA'],
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


const businesses = [
  {id:"pm-rest-gaivota",name:"Restaurante Gaivota",category:"food",parish:"Porto Moniz",address:"Rua do Lugar, 9270-095 Porto Moniz",phone:"+351291850040",source:"municipal",sourceUrl:"https://www.portomoniz.pt/pt/visitantes/onde-comer/restaurantes",description:"Restaurante listado no diretório oficial municipal."},
  {id:"pm-rest-maravista",name:"Restaurante Mar à Vista",category:"food",parish:"Porto Moniz",address:"Rua das Alfarrobeiras, 9270-095 Porto Moniz",phone:"+351291852949",source:"municipal",sourceUrl:"https://www.portomoniz.pt/pt/visitantes/onde-comer/restaurantes",description:"Restaurante listado no diretório oficial municipal."},
  {id:"pm-rest-butio",name:"Restaurante O Bútio",category:"food",parish:"Porto Moniz",address:"Rua do Forte de São João Baptista, 9270-095 Porto Moniz",phone:"+351291850150",source:"municipal",sourceUrl:"https://www.portomoniz.pt/pt/visitantes/onde-comer/restaurantes",description:"Contacto publicado pela Câmara Municipal."},
  {id:"pm-rest-orca",name:"Restaurante Orca",category:"food",parish:"Porto Moniz",address:"Rotunda da Piscina, 9270-095 Porto Moniz",phone:"+351291850000",source:"municipal",sourceUrl:"https://www.portomoniz.pt/pt/visitantes/onde-comer/restaurantes",description:"Restaurante listado no diretório oficial municipal."},
  {id:"pm-rest-polo-norte",name:"Restaurante Pólo Norte",category:"food",parish:"Porto Moniz",address:"Vila Porto Moniz, 9270-095 Porto Moniz",phone:"+351291853322",source:"municipal",sourceUrl:"https://www.portomoniz.pt/pt/visitantes/onde-comer/restaurantes",description:"Restaurante listado no diretório oficial municipal."},
  {id:"pm-rest-salgueiro",name:"Restaurante Salgueiro",category:"food",parish:"Porto Moniz",address:"Rua Eng. Américo, 9270-095 Porto Moniz",phone:"+351291850080",source:"municipal",sourceUrl:"https://www.portomoniz.pt/pt/visitantes/onde-comer/restaurantes",description:"Restaurante listado no diretório oficial municipal."},
  {id:"pm-rest-cachalote",name:"Restaurante Cachalote",category:"food",parish:"Porto Moniz",address:"Vila Porto Moniz, 9270-095 Porto Moniz",phone:"+351291853180",source:"municipal",sourceUrl:"https://www.portomoniz.pt/pt/visitantes/onde-comer/restaurantes",description:"Restaurante listado no diretório oficial municipal."},
  {id:"pm-rest-perola",name:"Restaurante Pérola do Norte",category:"food",parish:"Porto Moniz",address:"Vila Porto Moniz, 9270-095 Porto Moniz",phone:"+351291853000",source:"municipal",sourceUrl:"https://www.portomoniz.pt/pt/visitantes/onde-comer/restaurantes",description:"Restaurante listado no diretório oficial municipal."},
  {id:"pm-rest-vilabaleia",name:"Restaurante Vila Baleia",category:"food",parish:"Porto Moniz",address:"Vila Porto Moniz, 9270-095 Porto Moniz",phone:"+351291853147",source:"municipal",sourceUrl:"https://www.portomoniz.pt/pt/visitantes/onde-comer/restaurantes",description:"Restaurante listado no diretório oficial municipal."},
  {id:"pm-rest-poca",name:"Pizzaria Poça dos Arcos",category:"food",parish:"Porto Moniz",address:"Vila Porto Moniz, 9270-095 Porto Moniz",phone:"+351291853194",source:"municipal",sourceUrl:"https://www.portomoniz.pt/pt/visitantes/onde-comer/restaurantes",description:"Pizzaria listada no diretório oficial municipal."},
  {id:"pm-rest-olhos",name:"Olhos d’Água",category:"food",parish:"Porto Moniz",address:"Vila Porto Moniz, 9270-095 Porto Moniz",phone:"+351291852778",source:"municipal",sourceUrl:"https://www.portomoniz.pt/pt/visitantes/onde-comer/restaurantes",description:"Estabelecimento listado no diretório oficial municipal."},
  {id:"pm-rest-ilheu",name:"Restaurante Ilhéu Mole",category:"food",parish:"Porto Moniz",address:"Vila Porto Moniz, 9270-095 Porto Moniz",phone:"+351291853321",source:"municipal",sourceUrl:"https://www.portomoniz.pt/pt/visitantes/onde-comer/restaurantes",description:"Restaurante listado no diretório oficial municipal."},
  {id:"pm-rest-armandos",name:"Take Away Armando’s",category:"food",parish:"Porto Moniz",address:"Sítio da Levada Grande, 9270-036 Porto Moniz",phone:"+351291853855",source:"municipal",sourceUrl:"https://www.portomoniz.pt/pt/visitantes/onde-comer/restaurantes",description:"Take-away listado no diretório oficial municipal."},
  {id:"pm-rest-solmar",name:"Restaurante Solmar",category:"food",parish:"Seixal",address:"9270-130 Seixal",phone:"+351291854854",source:"municipal",sourceUrl:"https://www.portomoniz.pt/pt/visitantes/onde-comer/restaurantes",description:"Restaurante listado pelo município para a freguesia do Seixal."},
  {id:"pm-rest-casapasto",name:"Restaurante Casa de Pasto",category:"food",parish:"Seixal",address:"9270-121 Seixal",phone:"+351291854559",source:"municipal",sourceUrl:"https://www.portomoniz.pt/pt/visitantes/onde-comer/restaurantes",description:"Restaurante listado pelo município para a freguesia do Seixal."},
  {id:"pm-rest-pedradomar",name:"Marisqueira Pedra do Mar",category:"food",parish:"Seixal",address:"9270-130 Seixal",phone:"+351967054539",source:"municipal",sourceUrl:"https://www.portomoniz.pt/pt/visitantes/onde-comer/restaurantes",description:"Marisqueira listada pelo município para a freguesia do Seixal."},
  {id:"pm-rest-brisamar",name:"Restaurante Brisa Mar",category:"food",parish:"Seixal",address:"Rua João Fernandes Correia, 9270-130 Seixal",phone:"+351291854476",source:"municipal",sourceUrl:"https://www.portomoniz.pt/pt/visitantes/onde-comer/restaurantes",description:"Restaurante listado pelo município para a freguesia do Seixal."},
  {id:"pm-hotel-aqua",name:"Hotel Aqua Natura Madeira",category:"stay",parish:"Porto Moniz",address:"Rotunda da Piscina n.º 3, 9270-156 Porto Moniz",phone:"+351291640100",source:"online",sourceUrl:"https://www.aquanaturahotels.com/",description:"Hotel junto às piscinas naturais; confirme diretamente serviços e disponibilidade."},
  {id:"pm-hotel-bay",name:"Aqua Natura Bay",category:"stay",parish:"Porto Moniz",address:"Rua do Forte de São João Baptista 7, 9270-095 Porto Moniz",phone:"+351291850150",source:"online",sourceUrl:"https://www.aquanaturahotels.com/",description:"Hotel com vista para o Atlântico; consulte o operador para reservas."},
  {id:"pm-studios-aqua",name:"Studios by Aqua Natura Hotels",category:"stay",parish:"Porto Moniz",address:"Rua do Lugar 1, 9270-156 Porto Moniz",phone:"+351291110380",source:"online",sourceUrl:"https://www.aquanaturahotels.com/",description:"Alojamento em formato de estúdios; confirme diretamente a disponibilidade."},
  {id:"pm-camping",name:"Parque de Campismo do Porto Moniz",category:"stay",parish:"Porto Moniz",address:"Porto Moniz",phone:"+351291853856",source:"municipal",sourceUrl:"https://www.portomoniz.pt/pt/visitantes",description:"Contacto de campismo publicado pelo município; confirme abertura e regras."},
  {id:"pm-taxi1",name:"Táxi Porto Moniz",category:"mobility",parish:"Porto Moniz",address:"Rua dos Capitães, 9270-095 Porto Moniz",phone:"+351961820229",source:"online",sourceUrl:"https://www.google.com/maps/search/?api=1&query=Taxi+Porto+Moniz+Madeira",description:"Serviço local de táxi e motorista; confirme preço e recolha antes da viagem."},
  {id:"pm-taxi2",name:"Viagem Taxi",category:"mobility",parish:"Porto Moniz",address:"Rua do Lugar 34, 9270-095 Porto Moniz",phone:"+351966044361",source:"online",sourceUrl:"https://www.google.com/maps/search/?api=1&query=Viagem+Taxi+Porto+Moniz",description:"Contacto de transporte local encontrado em diretórios online; confirme atividade."},
  {id:"pm-tour-etropical",name:"E-Tropical",category:"activities",parish:"Porto Moniz",address:"Rua do Lugar, 9270-095 Porto Moniz",phone:"+351917777012",source:"online",sourceUrl:"https://www.etropical.pt/",description:"Operador local de experiências e passeios na costa norte; consulte programa e condições."},
  {id:"pm-tour-onda",name:"Onda Solar Tours",category:"activities",parish:"Porto Moniz",address:"Porto de Abrigo, 9270-095 Porto Moniz",phone:"+351918888193",source:"online",sourceUrl:"https://www.google.com/maps/search/?api=1&query=Onda+Solar+Tours+Porto+Moniz",description:"Passeios costeiros de barco; ponto de encontro e saídas devem ser confirmados."},
  {id:"pm-shop-zigzag",name:"Supermercado ZiG-ZAG",category:"retail",parish:"Porto Moniz",address:"Santa, Estrada Regional 101 n.º 118, 9270-093 Porto Moniz",phone:"+351924053569",source:"online",sourceUrl:"https://www.google.com/maps/search/?api=1&query=Supermercado+ZigZag+Porto+Moniz",description:"Pequeno supermercado local; confirme horário diretamente."},
  {id:"pm-shop-north77",name:"Mini Market North 77",category:"retail",parish:"Porto Moniz",address:"ER101 71A, 9270-095 Porto Moniz",phone:"",source:"online",sourceUrl:"https://www.google.com/maps/search/?api=1&query=Mini+Market+North+77+Porto+Moniz",description:"Minimercado local; confirme horário e stock diretamente."},
  {id:"pm-pharmacy",name:"Farmácia Porto Moniz",category:"services",parish:"Porto Moniz",address:"Porto Moniz",phone:"+351291853285",source:"directory",sourceUrl:"https://www.google.com/maps/search/?api=1&query=Farmacia+Porto+Moniz",description:"Farmácia identificada em diretório local; confirme morada e horário de serviço."},
  {id:"pm-carpentry",name:"Catanho & Morgado — Carpintaria e Marcenaria",category:"services",parish:"Porto Moniz",address:"Santa / Parque Empresarial do Porto Moniz",phone:"+351291853302",source:"directory",sourceUrl:"https://www.google.com/maps/search/?api=1&query=Catanho+Morgado+Porto+Moniz",description:"Carpintaria identificada em diretório empresarial; confirme serviços e contacto."},
  {id:"pm-realestate",name:"Imobiliário e terrenos — fontes oficiais",category:"property",parish:"Todo o concelho",address:"Porto Moniz, Seixal, Ribeira da Janela e Achadas da Cruz",phone:"",source:"official",sourceUrl:"https://www.portomoniz.pt/pt/atividade-municipal/economia/urbanismo",description:"Consulte PDM, urbanismo e diretório municipal. Não representa anúncios imobiliários verificados."},
  {id:"pm-business-dir",name:"Diretório municipal de empresas",category:"services",parish:"Todo o concelho",address:"Quatro freguesias",phone:"",source:"official",sourceUrl:"https://www.portomoniz.pt/pt/atividade-municipal/economia/diretorio-de-empresas",description:"Fonte oficial para descobrir e registar empresas locais; valide cada ficha."}
];

const portoMonizLinks = {
  ru: [
    ['Официальный портал муниципалитета','Районы, местные услуги, размещение и полезная информация','https://www.portomoniz.pt/pt/visitantes'],
    ['Природные бассейны и пляжи','Платный комплекс, бесплатные лавовые бассейны и зоны купания','https://www.portomoniz.pt/en/visit/points-interest/beaches'],
    ['Тропы и levadas','Fanal, Ribeira da Janela, Levada do Moinho и другие маршруты','https://www.portomoniz.pt/pt/visitantes/atividades-e-experiencias/levadas-e-veredas'],
    ['Рестораны','Муниципальный список ресторанов и контактов','https://www.portomoniz.pt/pt/visitantes/onde-comer/restaurantes'],
    ['Транспорт и парковки','Как добраться, мобильность, доступность и парковки','https://www.portomoniz.pt/pt/visitantes/mobilidade/como-chegar'],
    ['События и календарь','Местные события, Semana do Mar и культурная программа','https://www.portomoniz.pt/pt/concelho/cultura/agenda-porto-moniz/evento-agenda'],
    ['Каталог местных компаний','Компании, сервисы и местные поставщики','https://www.portomoniz.pt/pt/atividade-municipal/economia/diretorio-de-empresas'],
    ['Visit Madeira — Porto Moniz','Официальный туристический обзор достопримечательностей','https://visitmadeira.com/en/where-to-go/madeira/points-of-interest-in-porto-moniz/']
  ],
  en: [
    ['Municipal visitor portal','Parishes, local services, stays and visitor information','https://www.portomoniz.pt/pt/visitantes'],
    ['Natural pools & beaches','Main paid complex, free lava pools and bathing areas','https://www.portomoniz.pt/en/visit/points-interest/beaches'],
    ['Trails & levadas','Fanal, Ribeira da Janela, Levada do Moinho and local walks','https://www.portomoniz.pt/pt/visitantes/atividades-e-experiencias/levadas-e-veredas'],
    ['Restaurants','Municipal restaurant directory and published contacts','https://www.portomoniz.pt/pt/visitantes/onde-comer/restaurantes'],
    ['Mobility & parking','How to get here, accessibility, transport and parking','https://www.portomoniz.pt/pt/visitantes/mobilidade/como-chegar'],
    ['Events calendar','Local events, Semana do Mar and cultural programme','https://www.portomoniz.pt/pt/concelho/cultura/agenda-porto-moniz/evento-agenda'],
    ['Local business directory','Companies, services and local suppliers','https://www.portomoniz.pt/pt/atividade-municipal/economia/diretorio-de-empresas'],
    ['Visit Madeira — Porto Moniz','Official regional destination and attraction guide','https://visitmadeira.com/en/where-to-go/madeira/points-of-interest-in-porto-moniz/']
  ],
  pt: [
    ['Portal oficial do município','Freguesias, serviços locais, alojamento e informação útil','https://www.portomoniz.pt/pt/visitantes'],
    ['Piscinas naturais e praias','Complexo principal, piscinas gratuitas e zonas balneares','https://www.portomoniz.pt/en/visit/points-interest/beaches'],
    ['Levadas e veredas','Fanal, Ribeira da Janela, Levada do Moinho e percursos locais','https://www.portomoniz.pt/pt/visitantes/atividades-e-experiencias/levadas-e-veredas'],
    ['Restaurantes','Diretório municipal de restaurantes e contactos publicados','https://www.portomoniz.pt/pt/visitantes/onde-comer/restaurantes'],
    ['Mobilidade e estacionamento','Como chegar, acessibilidade, transportes e estacionamento','https://www.portomoniz.pt/pt/visitantes/mobilidade/como-chegar'],
    ['Agenda de eventos','Eventos locais, Semana do Mar e programa cultural','https://www.portomoniz.pt/pt/concelho/cultura/agenda-porto-moniz/evento-agenda'],
    ['Diretório de empresas','Empresas, serviços e fornecedores locais','https://www.portomoniz.pt/pt/atividade-municipal/economia/diretorio-de-empresas'],
    ['Visit Madeira — Porto Moniz','Guia turístico regional oficial','https://visitmadeira.com/en/where-to-go/madeira/points-of-interest-in-porto-moniz/']
  ]
};

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

function readSavedPlaces(){
  try{
    const value=JSON.parse(window.localStorage.getItem('madeira-saved')||'[]');
    return Array.isArray(value)?value.filter(id=>typeof id==='string'):[];
  }catch(_){return [];}
}

function App(){
  const [lang,setLang]=useState('ru');
  const [active,setActive]=useState('overview');
  const [filter,setFilter]=useState('all');
  const [query,setQuery]=useState('');
  const [saved,setSaved]=useState(readSavedPlaces);
  const [user,setUser]=useState(null);
  const [authOpen,setAuthOpen]=useState(false);
  const [authMode,setAuthMode]=useState('signin');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [authError,setAuthError]=useState('');
  const [savedError,setSavedError]=useState('');
  const [busy,setBusy]=useState(false);
  const [assistantBusy,setAssistantBusy]=useState(false);
  const [weatherData,setWeatherData]=useState(null);
  const [weatherError,setWeatherError]=useState('');
  const [locationWeather,setLocationWeather]=useState(null);
  const [locationBusy,setLocationBusy]=useState(false);
  const [locationError,setLocationError]=useState('');
  const [sources,setSources]=useState([]);
  const [businessesData,setBusinessesData]=useState([]);
  const [metaMunicipalities,setMetaMunicipalities]=useState([]);
  const [metaDirectory,setMetaDirectory]=useState([]);
  const [metaNeeds,setMetaNeeds]=useState([]);
  const [metaOpportunities,setMetaOpportunities]=useState([]);
  const [metaSources,setMetaSources]=useState([]);
  const [metaPlanning,setMetaPlanning]=useState([]);
  const [metaLandOpportunities,setMetaLandOpportunities]=useState([]);
  const [metaConstructionIndicators,setMetaConstructionIndicators]=useState([]);
  const [metaLoading,setMetaLoading]=useState(false);
  const [metaError,setMetaError]=useState('');
  const [needRespondentType,setNeedRespondentType]=useState('resident');
  const [needMunicipality,setNeedMunicipality]=useState('');
  const [needCategory,setNeedCategory]=useState('housing');
  const [needTitle,setNeedTitle]=useState('');
  const [needDescription,setNeedDescription]=useState('');
  const [needConsent,setNeedConsent]=useState(false);
  const [needSubmitBusy,setNeedSubmitBusy]=useState(false);
  const [needSubmitMessage,setNeedSubmitMessage]=useState('');
  const [needSubmitError,setNeedSubmitError]=useState('');
  const [analysisBusy,setAnalysisBusy]=useState(false);
  const [analysisResult,setAnalysisResult]=useState('');
  const [analysisSources,setAnalysisSources]=useState([]);
  const [analysisError,setAnalysisError]=useState('');
  const [analysisCounts,setAnalysisCounts]=useState(null);
  const [analysisTimestamp,setAnalysisTimestamp]=useState('');
  const [metaRegion,setMetaRegion]=useState('all');
  const [businessCategory,setBusinessCategory]=useState('all');
  const [businessParish,setBusinessParish]=useState('all');
  const [businessQuery,setBusinessQuery]=useState('');
  const [directoryCategory,setDirectoryCategory]=useState('all');
  const [directorySearch,setDirectorySearch]=useState('');
  const [chat,setChat]=useState([]);
  const [message,setMessage]=useState('');
  const [transitFeed,setTransitFeed]=useState(null);
  const [transitError,setTransitError]=useState('');
  const [transitBusy,setTransitBusy]=useState(false);
  const [transitOriginQuery,setTransitOriginQuery]=useState('');
  const [transitDestinationQuery,setTransitDestinationQuery]=useState('');
  const [transitOriginOptions,setTransitOriginOptions]=useState([]);
  const [transitDestinationOptions,setTransitDestinationOptions]=useState([]);
  const [transitOrigin,setTransitOrigin]=useState(null);
  const [transitDestination,setTransitDestination]=useState(null);
  const [transitRoutes,setTransitRoutes]=useState([]);
  const [transitNearbyStops,setTransitNearbyStops]=useState([]);
  const [transitSelectedStop,setTransitSelectedStop]=useState(null);
  const [transitDepartures,setTransitDepartures]=useState([]);
  const [mobileOpen,setMobileOpen]=useState(false);
  const t=copy[lang];
  const directoryGroups={
    healthcare:['health','healthcare'],
    public_services:['public_services','utilities','emergency'],
    economy:['agriculture','business_support','construction','food','retail','services','property','activities','stay'],
    transport:['transport','mobility']
  };
  const visibleDirectory=useMemo(()=>metaDirectory.filter(entry=>{
    const inRegion=metaRegion==='all'||entry.municipality_id===metaRegion;
    const inCategory=directoryCategory==='all'||(directoryGroups[directoryCategory]||[]).includes(entry.category);
    const haystack=[entry.name,entry.description,entry.address,entry.parish,entry.category].filter(Boolean).join(' ').toLocaleLowerCase();
    return inRegion&&inCategory&&haystack.includes(directorySearch.trim().toLocaleLowerCase());
  }),[metaDirectory,metaRegion,directoryCategory,directorySearch]);

  useEffect(()=>{
    if(!supabase) return;
    supabase.auth.getSession().then(({data})=>setUser(data.session?.user||null));
    const {data:{subscription}}=supabase.auth.onAuthStateChange((_event,session)=>setUser(session?.user||null));
    return ()=>subscription.unsubscribe();
  },[]);

  useEffect(()=>{
    try{window.localStorage.setItem('madeira-saved',JSON.stringify(saved));}catch(_){/* Storage may be disabled; keep the in-memory session usable. */}
  },[saved]);

  useEffect(()=>{
    let cancelled=false;
    const loadLegacy=()=>fetch('/api/porto-moniz').then(r=>r.ok?r.json():Promise.reject()).then(data=>{
      if(!cancelled)setBusinessesData(data.businesses||[]);
    }).catch(()=>{if(!cancelled)setBusinessesData([]);});
    if(!supabase){loadLegacy();return ()=>{cancelled=true;};}
    supabase.from('island_directory_entries')
      .select('id,external_key,name,category,parish,address,phone,description,website,source_id,source_url,verification_status,last_verified_at')
      .eq('municipality_id','porto-moniz').eq('is_active',true).order('name')
      .then(({data,error})=>{
        if(cancelled)return;
        if(error)throw error;
        setBusinessesData((data||[]).map(entry=>({
          id:entry.external_key||entry.id,name:entry.name,category:entry.category,
          parish:entry.parish||'Porto Moniz',address:entry.address||'',phone:entry.phone||'',
          source:entry.verification_status==='source_listed'?'municipal':entry.source_id==='google-maps-search'?'online':entry.source_id?'operator':'directory',
          sourceUrl:entry.source_url||entry.website||'#',description:entry.description||''
        })));
      }).catch(()=>{loadLegacy();});
    return ()=>{cancelled=true;};
  },[]);

  useEffect(()=>{
    fetch('/api/sources').then(r=>r.ok?r.json():Promise.reject()).then(data=>setSources(data.sources||[])).catch(()=>setSources([]));
  },[]);

  useEffect(()=>{
    if(active!=='meta') return;
    if(!supabase){setMetaError('Для общей базы MADEIRA AI подключите Supabase Preview.');return;}
    let cancelled=false;
    setMetaLoading(true);setMetaError('');
    Promise.all([
      supabase.from('island_municipalities').select('id,island,name_pt,name_en,name_ru').order('name_pt'),
      supabase.from('island_directory_entries').select('id,external_key,name,category,municipality_id,parish,description,address,phone,website,source_id,source_url,verification_status,last_verified_at').eq('is_active',true).order('name'),
      supabase.from('island_needs').select('id,title,category,municipality_id,description,validation_status,priority').order('priority',{ascending:false}),
      supabase.from('island_opportunities').select('id,title,category,municipality_id,description,status').order('created_at',{ascending:false}),
      supabase.from('island_sources').select('id,name,category,publisher,url,authority,scope,update_note,last_checked_at').eq('is_active',true).order('name'),
      supabase.from('island_planning_documents').select('id,municipality_id,document_type,title,status,source_url,document_url,summary,checked_at').order('title'),
      supabase.from('island_land_opportunities').select('id,municipality_id,title,opportunity_type,location_label,area_sqm,land_classification,buildability_status,evidence_summary,source_url,verification_status,checked_at').order('title'),
      supabase.from('island_construction_indicators').select('id,municipality_id,metric_key,segment,metric_label,metric_value,unit,reference_year,comparison_period,source_url,notes').order('reference_year',{ascending:false})
    ]).then(results=>{
      if(cancelled)return;
      const failed=results.find(result=>result.error);
      if(failed)throw failed.error;
      setMetaMunicipalities(results[0].data||[]);setMetaDirectory(results[1].data||[]);setMetaNeeds(results[2].data||[]);setMetaOpportunities(results[3].data||[]);setMetaSources(results[4].data||[]);
      setMetaPlanning(results[5].data||[]);setMetaLandOpportunities(results[6].data||[]);setMetaConstructionIndicators(results[7].data||[]);
    }).catch(error=>{if(!cancelled)setMetaError(error.message||'Не удалось загрузить общую базу острова.');})
      .finally(()=>{if(!cancelled)setMetaLoading(false);});
    return ()=>{cancelled=true;};
  },[active]);

  useEffect(()=>{
    if(active!=='transport') return;
    if(!supabase){setTransitFeed(null);setTransitError('Для поиска автобусов требуется подключение базы MADEIRA AI Preview.');return;}
    let cancelled=false;
    setTransitBusy(true);setTransitError('');
    supabase.from('transit_feeds')
      .select('id,publisher_name,feed_version,feed_start_date,feed_end_date,license_status,data_status,downloaded_at')
      .eq('data_status','ready').order('downloaded_at',{ascending:false}).limit(1).maybeSingle()
      .then(({data,error})=>{
        if(cancelled)return;
        if(error)throw error;
        setTransitFeed(data||null);
        if(!data)setTransitError('GTFS-расписание пока не загружено. Официальные планировщик и расписания SIGA доступны ниже.');
      })
      .catch(error=>{if(!cancelled)setTransitError(error.message||'Не удалось загрузить автобусные данные.');})
      .finally(()=>{if(!cancelled)setTransitBusy(false);});
    return ()=>{cancelled=true;};
  },[active]);

  const madeiraLocalTimestamp=()=>{
    const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Lisbon',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).formatToParts(new Date());
    const part=type=>parts.find(x=>x.type===type)?.value||'00';
    return part('year')+'-'+part('month')+'-'+part('day')+' '+part('hour')+':'+part('minute')+':'+part('second');
  };

  const searchTransitStops=async()=>{
    if(!supabase||!transitFeed){setTransitError('Автобусное расписание пока недоступно.');return;}
    if(!transitOriginQuery.trim()||!transitDestinationQuery.trim()){setTransitError('Укажите остановку отправления и назначения.');return;}
    setTransitBusy(true);setTransitError('');setTransitRoutes([]);
    try{
      const [originResult,destinationResult]=await Promise.all([
        supabase.rpc('transit_search_stops',{p_query:transitOriginQuery.trim(),p_limit:12}),
        supabase.rpc('transit_search_stops',{p_query:transitDestinationQuery.trim(),p_limit:12})
      ]);
      if(originResult.error)throw originResult.error;
      if(destinationResult.error)throw destinationResult.error;
      setTransitOriginOptions(originResult.data||[]);
      setTransitDestinationOptions(destinationResult.data||[]);
      setTransitOrigin(null);setTransitDestination(null);
      if(!(originResult.data||[]).length||!(destinationResult.data||[]).length)setTransitError('Не удалось найти одну из остановок. Попробуйте название соседней остановки или населённого пункта.');
    }catch(error){setTransitError(error.message||'Ошибка поиска остановок.');}
    finally{setTransitBusy(false);}
  };

  const searchTransitRoutes=async()=>{
    if(!supabase||!transitOrigin||!transitDestination){setTransitError('Выберите обе остановки из списка.');return;}
    setTransitBusy(true);setTransitError('');setTransitRoutes([]);
    try{
      const {data,error}=await supabase.rpc('transit_search_direct_routes',{
        p_origin_stop_id:transitOrigin.stop_id,
        p_destination_stop_id:transitDestination.stop_id,
        p_after_local:madeiraLocalTimestamp(),
        p_limit:12
      });
      if(error)throw error;
      setTransitRoutes(data||[]);
      if(!(data||[]).length)setTransitError('Прямые рейсы на ближайшее время не найдены. Проверьте дату и официальные уведомления SIGA.');
    }catch(error){setTransitError(error.message||'Не удалось построить маршрут.');}
    finally{setTransitBusy(false);}
  };

  const findNearbyTransitStops=()=>{
    if(!supabase||!transitFeed){setTransitError('Автобусное расписание пока недоступно.');return;}
    if(!navigator.geolocation){setTransitError('Геолокация недоступна в этом браузере.');return;}
    setTransitBusy(true);setTransitError('');
    navigator.geolocation.getCurrentPosition(async position=>{
      try{
        const {data,error}=await supabase.rpc('transit_nearby_stops',{
          p_lat:position.coords.latitude,p_lon:position.coords.longitude,p_radius_km:1.5,p_limit:8
        });
        if(error)throw error;
        setTransitNearbyStops(data||[]);
        setTransitDepartures([]);
        if(!(data||[]).length)setTransitError('В радиусе 1,5 км остановки не найдены.');
      }catch(error){setTransitError(error.message||'Не удалось найти ближайшие остановки.');}
      finally{setTransitBusy(false);}
    },error=>{
      setTransitError(error.code===1?'Разрешите доступ к геолокации в браузере.':'Не удалось определить местоположение.');
      setTransitBusy(false);
    },{enableHighAccuracy:false,timeout:10000,maximumAge:300000});
  };

  const loadTransitDepartures=async stop=>{
    if(!supabase||!stop)return;
    setTransitSelectedStop(stop);setTransitBusy(true);setTransitError('');setTransitDepartures([]);
    try{
      const {data,error}=await supabase.rpc('transit_next_departures',{
        p_stop_id:stop.stop_id,p_after_local:madeiraLocalTimestamp(),p_limit:12
      });
      if(error)throw error;
      setTransitDepartures(data||[]);
      if(!(data||[]).length)setTransitError('Ближайшие отправления на этой остановке не найдены.');
    }catch(error){setTransitError(error.message||'Не удалось загрузить отправления.');}
    finally{setTransitBusy(false);}
  };

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
    const wasSaved=saved.includes(id);
    const next=wasSaved?saved.filter(x=>x!==id):[...saved,id];
    setSavedError('');
    setSaved(next);
    if(supabase&&user){
      try{
        const result=wasSaved
          ? await supabase.from('saved_places').delete().eq('user_id',user.id).eq('place_id',id)
          : await supabase.from('saved_places').upsert({user_id:user.id,place_id:id},{onConflict:'user_id,place_id'});
        if(result.error) throw result.error;
      }catch(error){
        setSaved(saved);
        setSavedError(error.message||'Не удалось сохранить место в облаке.');
      }
    }
  };

  const submitAuth=async(e)=>{
    e.preventDefault();setBusy(true);setAuthError('');
    try{
      if(!supabase) throw new Error('Сначала подключите публичные переменные Supabase для Preview.');
      const result=authMode==='signup'
        ? await supabase.auth.signUp({email,password})
        : await supabase.auth.signInWithPassword({email,password});
      if(result.error) throw result.error;
      if(authMode==='signup'&&!result.data.session){setAuthError('Проверьте почту и подтвердите регистрацию.');return;}
      setAuthOpen(false);setPassword('');
    }catch(error){setAuthError(error.message||'Не удалось выполнить вход. Попробуйте ещё раз.');}
    finally{setBusy(false);}
  };



  const runOpportunityAnalysis=async()=>{
    setAnalysisBusy(true);setAnalysisError('');
    if(!supabase){setAnalysisError('Подключите Supabase Preview, чтобы запустить анализ.');setAnalysisBusy(false);return;}
    try{
      const {data,error}=await supabase.auth.getSession();
      if(error)throw error;
      if(!data.session){setAnalysisError('Войдите в аккаунт MADEIRA AI, чтобы запустить анализ.');setAuthOpen(true);return;}
      const response=await fetch('/api/opportunity-analysis',{
        method:'POST',
        headers:{'Content-Type':'application/json','Authorization':'Bearer '+data.session.access_token},
        body:JSON.stringify({municipalityId:metaRegion})
      });
      const payload=await response.json();
      if(!response.ok)throw new Error(payload.error||'Не удалось выполнить AI-анализ.');
      setAnalysisResult(payload.answer||'');setAnalysisSources(payload.sources||[]);
      setAnalysisCounts(payload.counts||null);setAnalysisTimestamp(payload.analyzedAt||new Date().toISOString());
    }catch(error){setAnalysisError(error.message||'AI-анализ временно недоступен.');}
    finally{setAnalysisBusy(false);}
  };

  const submitNeed=async(e)=>{
    e.preventDefault();setNeedSubmitMessage('');setNeedSubmitError('');
    if(!supabase){setNeedSubmitError('Облачная база сейчас не подключена.');return;}
    if(!user){setNeedSubmitError('Войдите в аккаунт, чтобы отправить сообщение.');setAuthOpen(true);return;}
    if(!needConsent){setNeedSubmitError('Подтвердите согласие на обезличенный анализ.');return;}
    setNeedSubmitBusy(true);
    try{
      const {error}=await supabase.from('island_need_submissions').insert({
        submitted_by:user.id,respondent_type:needRespondentType,municipality_id:needMunicipality||null,
        category:needCategory,title:needTitle.trim(),description:needDescription.trim(),consent_to_aggregate:true
      });
      if(error)throw error;
      setNeedSubmitMessage('Спасибо. Сообщение отправлено на закрытую модерацию; в общую базу попадут только проверенные обезличенные выводы.');
      setNeedTitle('');setNeedDescription('');setNeedConsent(false);
    }catch(error){setNeedSubmitError(error.message||'Не удалось отправить сообщение. Попробуйте позже.');}
    finally{setNeedSubmitBusy(false);}
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
      setChat(old=>[...old,{role:'assistant',text:data.answer,sources:data.sources||[],searchedAt:data.searchedAt||null}]);
    }catch(error){setChat(old=>[...old,{role:'assistant',text:'MADEIRA AI: '+error.message+'\nПроверьте OPENAI_API_KEY в серверных переменных Vercel.'}]);}
    finally{setAssistantBusy(false);}
  };

  const openSection=(id)=>{setActive(id);setMobileOpen(false);};

  const renderHeader=()=> <header className="topbar">
    <button className="mobile-menu" onClick={()=>setMobileOpen(!mobileOpen)} aria-label="Menu"><Menu size={20}/></button>
    <div className="crumb"><span>MADEIRA AI</span><i>/</i>{t.nav[['overview','meta','explore','property','travel','invest','transport','weather','concierge'].indexOf(active)]}</div>
    <div className="top-actions">
      <label className="searchbox"><Search size={16}/><input value={query} onChange={e=>{setQuery(e.target.value);if(active==='overview')setActive('explore');}} placeholder={t.search}/><kbd>⌘ K</kbd></label>
      <select className="language" value={lang} onChange={e=>setLang(e.target.value)} aria-label="Language"><option value="ru">RU</option><option value="en">EN</option><option value="pt">PT</option></select>
      {user?<button className="user-pill" onClick={signOut}><CircleUserRound size={16}/><span>{user.email?.split('@')[0]}</span><LogOut size={14}/></button>:<button className="sign-button" onClick={()=>setAuthOpen(true)}><LogIn size={15}/>{t.signIn}</button>}
    </div>
  </header>;

  const placeCard=(p)=> <article className="place-card" key={p.id}>
    <div className={'place-art art-'+p.kind}><p.icon size={31}/><span>{p.tag}</span></div>
    <div className="place-body"><div className="place-meta"><span><MapPin size={12}/>{p.area}</span><button className={saved.includes(p.id)?'saved active':'saved'} onClick={()=>toggleSaved(p.id)} aria-label="Save place"><Bookmark size={16} fill={saved.includes(p.id)?'currentColor':'none'}/></button></div><h3>{p.name}</h3><p>{p.desc}</p>{savedError&&<small className="inline-error" role="alert">{savedError}</small>}</div>
  </article>;

  return <div className="app-shell">
    <aside className={'sidebar '+(mobileOpen?'open':'')}>
      <div className="brand"><div className="brand-mark"><Compass size={23}/></div><div><b>MADEIRA AI</b><small>ISLAND INTELLIGENCE</small></div><button className="close-menu" onClick={()=>setMobileOpen(false)}><X size={18}/></button></div>
      <div className="side-label">DISCOVER</div>
      <nav>{['overview','meta','explore','property','travel','invest','transport','weather','concierge'].map((id,i)=>{
        const icons=[Map,Globe2,Compass,Building2,Plane,BriefcaseBusiness,CarFront,CloudSun,MessageCircle];const Icon=icons[i];
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
          <div className="dashboard-welcome">
            <div className="dashboard-welcome-copy"><span className="eyebrow"><span/> MADEIRA · ATLANTIC ISLAND</span><h1>MADEIRA AI</h1><p>{t.intro}</p><div className="dashboard-welcome-actions"><button className="primary" onClick={()=>openSection('explore')}>{t.explore}<ArrowUpRight size={16}/></button><button className="ghost" onClick={()=>openSection('concierge')}><Sparkles size={16}/>{t.ask}</button></div></div>
            <div className="dashboard-coast-art"><div className="coast-sun"/><div className="coast-cliff"/><div className="coast-sea"/><span>ATLANTIC · PORTUGAL</span></div>
          </div>
          <div className="location-weather-card">
            <div className="location-weather-heading"><div><span className="eyebrow">LIVE · LOCAL WEATHER</span><h2>{t.locationTitle}</h2></div><div className="location-weather-icon"><CloudSun size={27}/></div></div>
            {locationWeather? <div className="location-weather-data"><div className="location-temperature"><strong>{Math.round(locationWeather.current.temperatureC)}°</strong><span>{weatherDescription(locationWeather.current.weatherCode)}</span><small>{locationWeather.location.name}{locationWeather.location.country?', '+locationWeather.location.country:''}</small></div><div className="location-weather-details"><span>{t.feelsLike} <b>{Math.round(locationWeather.current.feelsLikeC)}°C</b></span><span>{t.humidity} <b>{locationWeather.current.humidity}%</b></span><span>{t.wind} <b>{Math.round(locationWeather.current.windKmh)} km/h</b></span></div></div>:<div className="location-empty-state"><div><strong>{t.locationHint}</strong><small>GPS · Open-Meteo · Live conditions</small></div></div>}
            {locationError&&<p className="location-weather-error" role="status">{locationError}</p>}
            <div className="location-actions"><button className="location-detect-button" onClick={detectLocation} disabled={locationBusy}><Navigation size={15}/>{locationBusy?t.locating:locationWeather?t.refreshLocation:t.locate}</button>{locationWeather&&<small className="location-weather-updated">Open-Meteo · {new Date(locationWeather.fetchedAt).toLocaleTimeString()}</small>}</div>
          </div>
          <div className="dashboard-shortcuts">
            <button onClick={()=>openSection('explore')}><Map size={22}/><span>Карта острова</span></button>
            <button onClick={()=>openSection('travel')}><Compass size={22}/><span>Маршруты</span></button>
            <button onClick={()=>openSection('invest')}><BriefcaseBusiness size={22}/><span>Возможности</span></button>
            <button onClick={()=>openSection('weather')}><CloudSun size={22}/><span>Прогноз</span></button>
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

        {active==='meta'&&<section className="module-page meta-page">
          <div className="module-intro"><span className="eyebrow">MADEIRA AI · ARCHIPELAGO INTELLIGENCE</span><h1>{lang==='ru'?'Архипелаг Мадейры':lang==='pt'?'Arquipélago da Madeira':'Madeira Archipelago'}</h1><p>{lang==='ru'?'Единая цифровая система Мадейры и Порту-Санту: что существует, чего не хватает и где появляются возможности.':lang==='pt'?'Sistema digital integrado da Madeira e do Porto Santo: o que existe, o que falta e onde surgem oportunidades.':'A unified digital system for Madeira and Porto Santo: what exists, what is missing and where opportunities emerge.'}</p></div>
          <div className="meta-stats-grid">
            <article><span>{lang==='ru'?'Муниципалитеты':lang==='pt'?'Municípios':'Municipalities'}</span><b>{metaMunicipalities.length||'—'}</b><small>{lang==='ru'?'Мадейра + Порту-Санту':lang==='pt'?'Madeira + Porto Santo':'Madeira + Porto Santo'}</small></article>
            <article><span>{lang==='ru'?'Источники':lang==='pt'?'Fontes':'Sources'}</span><b>{metaSources.length||'—'}</b><small>{lang==='ru'?'Реестр официальных данных':lang==='pt'?'Registo de dados oficiais':'Official source register'}</small></article>
            <article><span>{lang==='ru'?'Объекты каталога':lang==='pt'?'Locais no catálogo':'Directory entries'}</span><b>{metaDirectory.length}</b><small>{lang==='ru'?'Только записи в общей базе':lang==='pt'?'Registos na base central':'Records in the central database'}</small></article>
            <article><span>{lang==='ru'?'Потребности / идеи':lang==='pt'?'Necessidades / ideias':'Needs / opportunities'}</span><b>{metaNeeds.length+metaOpportunities.length}</b><small>{lang==='ru'?'С проверкой доказательств':lang==='pt'?'Com validação de evidências':'Evidence-led tracking'}</small></article>
          </div>
          <div className="meta-section-heading"><div><span className="eyebrow">01 · TERRITORIAL COVERAGE</span><h2>{lang==='ru'?'11 муниципалитетов архипелага':lang==='pt'?'11 municípios do arquipélago':'11 municipalities of the archipelago'}</h2></div><span className="meta-live-state">{metaLoading?'SYNC…':metaError?'CHECK CONNECTION':'DATABASE'}</span></div>
          {metaError&&<div className="meta-error" role="alert">{metaError}</div>}
          <div className="meta-municipality-grid">{metaMunicipalities.map(m=>{
            const count=metaDirectory.filter(x=>x.municipality_id===m.id).length;
            const needs=metaNeeds.filter(x=>x.municipality_id===m.id).length;
            return <button type="button" key={m.id} className={metaRegion===m.id?'meta-municipality active':'meta-municipality'} onClick={()=>setMetaRegion(metaRegion===m.id?'all':m.id)}><span>{m.island==='porto_santo'?'PORTO SANTO':'MADEIRA'}</span><b>{m['name_'+lang]||m.name_en}</b><small>{count} {lang==='ru'?'объектов':'entries'} · {needs} {lang==='ru'?'потребностей':'needs'}</small></button>;
          })}</div>
          <div className="meta-section-heading"><div><span className="eyebrow">02 · ARCHIPELAGO DIRECTORY</span><h2>{lang==='ru'?'Организации и услуги архипелага':lang==='pt'?'Organizações e serviços do arquipélago':'Archipelago organisations & services'}</h2></div><span className="meta-count">{visibleDirectory.length} / {metaDirectory.length}</span></div>
          <div className="meta-directory-toolbar">
            <label className="meta-directory-search"><Search size={16}/><input value={directorySearch} onChange={e=>setDirectorySearch(e.target.value)} placeholder={lang==='ru'?'Поиск организации, услуги, адреса…':lang==='pt'?'Pesquisar organização, serviço ou morada…':'Search organisation, service or address…'}/></label>
            <label className="meta-directory-region"><MapPin size={15}/><select value={metaRegion} onChange={e=>setMetaRegion(e.target.value)}><option value="all">{lang==='ru'?'Все муниципалитеты':lang==='pt'?'Todos os municípios':'All municipalities'}</option>{metaMunicipalities.map(m=><option key={m.id} value={m.id}>{m['name_'+lang]||m.name_en}</option>)}</select></label>
          </div>
          <div className="meta-filter-row meta-directory-categories">
            {[['all',lang==='ru'?'Все направления':lang==='pt'?'Todas as áreas':'All sectors'],['healthcare',lang==='ru'?'Здравоохранение':lang==='pt'?'Saúde':'Healthcare'],['public_services',lang==='ru'?'Общественные услуги':lang==='pt'?'Serviços públicos':'Public services'],['economy',lang==='ru'?'Экономика и компании':lang==='pt'?'Economia e empresas':'Economy & business'],['transport',lang==='ru'?'Транспорт':lang==='pt'?'Transportes':'Transport']].map(([id,label])=><button type="button" key={id} className={directoryCategory===id?'active':''} onClick={()=>setDirectoryCategory(id)}>{label}</button>)}
          </div>
          <div className="meta-directory-summary"><span>{lang==='ru'?'Найдено организаций и служб':lang==='pt'?'Organizações e serviços encontrados':'Matching organisations & services'}: <b>{visibleDirectory.length}</b></span><span>{lang==='ru'?'Источник и дата проверки указаны в каждой карточке':'Source and check date are shown on every card'}</span></div>
          {visibleDirectory.length===0?<div className="meta-empty"><Globe2 size={26}/><b>{lang==='ru'?'Ничего не найдено':lang==='pt'?'Sem resultados':'No matching records'}</b><p>{lang==='ru'?'Измените муниципалитет, направление или поисковый запрос. Отсутствие записи не означает отсутствие услуги.':'Change the municipality, sector or search phrase. An absent record does not mean the service does not exist.'}</p></div>:<div className="meta-directory-grid">{visibleDirectory.map(entry=>{
            const source=metaSources.find(item=>item.id===entry.source_id);
            const municipality=metaMunicipalities.find(item=>item.id===entry.municipality_id);
            const status=entry.verification_status||'not_checked';
            const categoryLabels={health:lang==='ru'?'Здравоохранение':lang==='pt'?'Saúde':'Healthcare',healthcare:lang==='ru'?'Здравоохранение':lang==='pt'?'Saúde':'Healthcare',public_services:lang==='ru'?'Общественные услуги':lang==='pt'?'Serviços públicos':'Public services',utilities:lang==='ru'?'Коммунальная инфраструктура':lang==='pt'?'Infraestruturas':'Utilities',emergency:lang==='ru'?'Экстренная помощь':lang==='pt'?'Emergência':'Emergency',transport:lang==='ru'?'Транспорт':lang==='pt'?'Transportes':'Transport',mobility:lang==='ru'?'Мобильность':lang==='pt'?'Mobilidade':'Mobility',agriculture:lang==='ru'?'Сельское хозяйство':lang==='pt'?'Agricultura':'Agriculture',business_support:lang==='ru'?'Поддержка бизнеса':lang==='pt'?'Apoio empresarial':'Business support',construction:lang==='ru'?'Строительство':lang==='pt'?'Construção':'Construction',food:lang==='ru'?'Продукты и питание':lang==='pt'?'Alimentação':'Food',retail:lang==='ru'?'Торговля':lang==='pt'?'Comércio':'Retail',services:lang==='ru'?'Услуги':lang==='pt'?'Serviços':'Services',property:lang==='ru'?'Недвижимость':lang==='pt'?'Imobiliário':'Property',activities:lang==='ru'?'Активности':lang==='pt'?'Atividades':'Activities',stay:lang==='ru'?'Размещение':lang==='pt'?'Alojamento':'Accommodation'};
            return <article key={entry.id} className="meta-directory-card meta-directory-entry">
              <div className="meta-entry-top"><span>{categoryLabels[entry.category]||entry.category}</span><small className={'meta-verification '+(status==='verified'?'verified':'')}>{status.replaceAll('_',' ')}</small></div>
              <b>{entry.name}</b>
              <p>{entry.description||''}</p>
              {(entry.address||entry.parish)&&<div className="meta-entry-detail"><MapPin size={13}/><span>{[entry.address,entry.parish].filter(Boolean).join(' · ')}</span></div>}
              <div className="meta-entry-detail"><Globe2 size={13}/><span>{municipality?(municipality['name_'+lang]||municipality.name_en):'Archipelago'}</span></div>
              <div className="meta-entry-actions">{entry.phone&&<a href={'tel:'+entry.phone.replace(/[^+\d]/g,'')}><CarFront size={13}/>{entry.phone}</a>}{entry.website&&<a href={entry.website} target="_blank" rel="noreferrer">{lang==='ru'?'Сайт':'Website'} <ArrowUpRight size={12}/></a>}</div>
              <div className="meta-entry-provenance"><span>{source?.name||entry.source_id||'Source not linked'}</span><span>{lang==='ru'?'Дата записи':'Record date'}: {entry.last_verified_at?new Date(entry.last_verified_at).toLocaleDateString(lang==='ru'?'ru-RU':lang==='pt'?'pt-PT':'en-GB'):(source?.last_checked_at?new Date(source.last_checked_at).toLocaleDateString(lang==='ru'?'ru-RU':lang==='pt'?'pt-PT':'en-GB'):(lang==='ru'?'дата не указана':'date unavailable'))}</span></div>
              {(entry.source_url||source?.url)&&<a className="meta-entry-source" href={entry.source_url||source.url} target="_blank" rel="noreferrer">{lang==='ru'?'Открыть первоисточник':'Open original source'} <ArrowUpRight size={12}/></a>}
            </article>;
          })}</div>}
          {(directoryCategory==='all'||directoryCategory==='transport')&&<section className="meta-schedule-panel">
            <div className="meta-section-heading"><div><span className="eyebrow">LIVE OPERATOR INFORMATION</span><h2>{lang==='ru'?'Расписания и транспортные уведомления':lang==='pt'?'Horários e avisos de transporte':'Timetables & transport alerts'}</h2></div><span className="meta-live-state">{lang==='ru'?'Официальные источники':'OFFICIAL SOURCES'}</span></div>
            <p>{lang==='ru'?'Открывайте актуальные расписания и предупреждения непосредственно у перевозчиков. Встроенный импорт GTFS / данных реального времени пока не подключён, поэтому мы не показываем выдуманные часы отправления.':lang==='pt'?'Consulte horários e avisos atualizados diretamente nos operadores. A importação integrada de GTFS/dados em tempo real ainda não está ligada; não apresentamos partidas estimadas.':'Open current timetables and service alerts directly from operators. A GTFS / real-time data feed is not integrated yet, so no departure times are fabricated.'}</p>
            <div className="meta-schedule-links">
              <a href="https://siga.madeira.gov.pt/horarios" target="_blank" rel="noreferrer"><span>BUS · MADEIRA + PORTO SANTO</span><b>SIGA — {lang==='ru'?'Расписания автобусов':'Bus timetables'}</b><small>{lang==='ru'?'Линии, маршруты, муниципалитеты и номера рейсов':'Lines, routes, municipalities and service numbers'}</small><em>{lang==='ru'?'Открыть расписание':'Open timetable'} <ArrowUpRight size={13}/></em></a>
              <a href="https://siga.madeira.gov.pt/avisos" target="_blank" rel="noreferrer"><span>LIVE SERVICE NOTICES</span><b>SIGA — {lang==='ru'?'Изменения и предупреждения':'Changes & alerts'}</b><small>{lang==='ru'?'Перекрытия, изменения остановок и отмены рейсов':'Road closures, stop changes and service cancellations'}</small><em>{lang==='ru'?'Открыть уведомления':'Open service alerts'} <ArrowUpRight size={13}/></em></a>
              <a href="https://reservasc.portosantoline.pt/pt/horarios/" target="_blank" rel="noreferrer"><span>FERRY · FUNCHAL ↔ PORTO SANTO</span><b>Porto Santo Line — {lang==='ru'?'Паромное расписание':'Ferry timetable'}</b><small>{lang==='ru'?'Отправления, бронирование и изменения рейсов':'Departures, booking and sailing changes'}</small><em>{lang==='ru'?'Проверить рейсы':'Check sailings'} <ArrowUpRight size={13}/></em></a>
              <a href="https://www.ana.pt/en/content-topic/find-flights" target="_blank" rel="noreferrer"><span>AIR · FNC + PXO</span><b>ANA — {lang==='ru'?'Информация о рейсах':'Flight information'}</b><small>{lang==='ru'?'Вылеты и прилёты аэропортов архипелага':'Departures and arrivals for the archipelago airports'}</small><em>{lang==='ru'?'Проверить рейсы':'Check flights'} <ArrowUpRight size={13}/></em></a>
              <a href="https://gtfs.tiim.pt/rede-siga/rede-siga-gtfs.zip" target="_blank" rel="noreferrer"><span>STATIC DATA · GTFS · CANDIDATE</span><b>TiiM / SIGA — GTFS feed</b><small>{lang==='ru'?'Архив расписаний и маршрутов. Источник найден, проверка структуры и автоматический импорт ещё впереди.':'Static timetable and route archive. Feed endpoint discovered; format validation and automated ingestion are still pending.'}</small><em>{lang==='ru'?'Открыть GTFS-файл':'Open GTFS feed'} <ArrowUpRight size={13}/></em></a>
            </div>
          </section>}
          <div className="meta-two-columns"><section><div className="meta-section-heading"><div><span className="eyebrow">03 · NEEDS MAP</span><h2>{lang==='ru'?'Чего не хватает':lang==='pt'?'O que faz falta':'What is missing'}</h2></div><span className="meta-count">{metaNeeds.length}</span></div>{metaNeeds.length?metaNeeds.filter(x=>metaRegion==='all'||x.municipality_id===metaRegion).map(item=><article className="meta-signal-card" key={item.id}><b>{item.title}</b><p>{item.description}</p><small>{item.category} · {item.validation_status}</small></article>):<div className="meta-empty compact"><p>{lang==='ru'?'Потребности пока не объявляются фактами. Они будут добавляться после проверки статистики, муниципальных документов и свидетельств жителей.':'Needs are not presented as facts without evidence. They will be added after checking statistics, municipal documents and resident feedback.'}</p></div>}</section>
            <section><div className="meta-section-heading"><div><span className="eyebrow">04 · OPPORTUNITY RADAR</span><h2>{lang==='ru'?'Что можно создать':lang==='pt'?'O que pode ser criado':'What could be built'}</h2></div><span className="meta-count">{metaOpportunities.length}</span></div>{metaOpportunities.length?metaOpportunities.filter(x=>metaRegion==='all'||x.municipality_id===metaRegion).map(item=><article className="meta-signal-card opportunity" key={item.id}><b>{item.title}</b><p>{item.description}</p><small>{item.category} · {item.status}</small></article>):<div className="meta-empty compact"><p>{lang==='ru'?'Идеи для бизнеса и инвестиций будут связаны с конкретной потребностью и подтверждающими источниками.':'Business and investment ideas will be linked to a concrete need and supporting evidence.'}</p></div>}</section></div>
          <section className="need-submission-panel">
            <div className="meta-section-heading"><div><span className="eyebrow">COMMUNITY SIGNALS · MODERATED</span><h2>{lang==='ru'?'Сообщить о реальной потребности':lang==='pt'?'Partilhar uma necessidade real':'Share a real community need'}</h2></div></div>
            <p>{lang==='ru'?'Расскажите, какой услуги, решения или инфраструктуры не хватает жителям или гостям архипелага. Каждое сообщение проходит закрытую проверку.':lang==='pt'?'Partilhe que serviço, solução ou infraestrutura faz falta aos residentes ou visitantes. Cada contribuição passa por revisão privada.':'Tell us which service, solution or infrastructure residents or visitors need. Every submission is privately reviewed.'}</p>
            {!user&&<div className="need-signin-note"><span>{lang==='ru'?'Для отправки потребуется аккаунт MADEIRA AI.':lang==='pt'?'É necessária uma conta MADEIRA AI para enviar.':'A MADEIRA AI account is required to submit.'}</span><button type="button" onClick={()=>setAuthOpen(true)}>{lang==='ru'?'Войти':'Sign in'} <ArrowUpRight size={14}/></button></div>}
            <form className="need-submission-form" onSubmit={submitNeed}>
              <div className="need-form-grid">
                <label>{lang==='ru'?'Кто вы?':lang==='pt'?'Quem é?':'I am a'}<select value={needRespondentType} onChange={e=>setNeedRespondentType(e.target.value)}><option value="resident">{lang==='ru'?'Житель':'Resident'}</option><option value="visitor">{lang==='ru'?'Турист / гость':'Visitor / tourist'}</option><option value="business">{lang==='ru'?'Представитель бизнеса':'Business'}</option><option value="investor">{lang==='ru'?'Инвестор':'Investor'}</option><option value="other">{lang==='ru'?'Другое':'Other'}</option></select></label>
                <label>{lang==='ru'?'Муниципалитет':lang==='pt'?'Município':'Municipality'}<select value={needMunicipality} onChange={e=>setNeedMunicipality(e.target.value)}><option value="">{lang==='ru'?'Весь архипелаг / не важно':'All archipelago / not specific'}</option>{metaMunicipalities.map(m=><option key={m.id} value={m.id}>{m['name_'+lang]||m.name_en}</option>)}</select></label>
                <label>{lang==='ru'?'Категория':lang==='pt'?'Categoria':'Category'}<select value={needCategory} onChange={e=>setNeedCategory(e.target.value)}><option value="housing">{lang==='ru'?'Жильё и недвижимость':'Housing & property'}</option><option value="transport">{lang==='ru'?'Транспорт':'Transport'}</option><option value="healthcare">{lang==='ru'?'Здоровье':'Healthcare'}</option><option value="education">{lang==='ru'?'Образование':'Education'}</option><option value="tourism">{lang==='ru'?'Туризм и отдых':'Tourism & leisure'}</option><option value="environment">{lang==='ru'?'Экология':'Environment'}</option><option value="public_services">{lang==='ru'?'Муниципальные услуги':'Public services'}</option><option value="business">{lang==='ru'?'Бизнес и работа':'Business & jobs'}</option><option value="other">{lang==='ru'?'Другое':'Other'}</option></select></label>
                <label>{lang==='ru'?'Кратко сформулируйте потребность':lang==='pt'?'Resuma a necessidade':'Summarise the need'}<input value={needTitle} onChange={e=>setNeedTitle(e.target.value)} minLength={5} maxLength={160} required placeholder={lang==='ru'?'Например: вечерний транспорт между…':'For example: evening transport between…'}/></label>
                <label className="wide">{lang==='ru'?'Подробности и контекст':lang==='pt'?'Detalhes e contexto':'Details and context'}<textarea value={needDescription} onChange={e=>setNeedDescription(e.target.value)} minLength={10} maxLength={2000} required rows={4} placeholder={lang==='ru'?'Что именно нужно, кому и как часто?':'What is needed, for whom and how often?'}/></label>
              </div>
              <label className="need-consent"><input type="checkbox" checked={needConsent} onChange={e=>setNeedConsent(e.target.checked)} required/><span>{lang==='ru'?'Я разрешаю использовать это сообщение в обезличенном виде для анализа общих потребностей.':lang==='pt'?'Autorizo a utilização desta mensagem de forma anonimizada para analisar necessidades coletivas.':'I consent to this message being used in anonymised form to analyse shared needs.'}</span></label>
              <button className="primary" type="submit" disabled={needSubmitBusy||!supabase}>{needSubmitBusy?'…':lang==='ru'?'Отправить на проверку':lang==='pt'?'Enviar para revisão':'Submit for review'} <ArrowUpRight size={15}/></button>
              {needSubmitMessage&&<p className="need-success" role="status">{needSubmitMessage}</p>}
              {needSubmitError&&<p className="need-error" role="alert">{needSubmitError}</p>}
            </form>
            <small className="need-privacy-note">{lang==='ru'?'Не указывайте имена, телефоны, email, точные домашние адреса и медицинские или другие чувствительные сведения. Сырые сообщения не публикуются и не передаются AI до модерации.':lang==='pt'?'Não inclua nomes, telefones, emails, moradas exatas ou dados médicos/sensíveis. As mensagens originais não são públicas nem enviadas à IA antes da moderação.':'Do not include names, phone numbers, email addresses, exact home addresses or sensitive health information. Raw submissions are private and are not sent to AI before moderation.'}</small>
          </section>
          <div className="meta-section-heading"><div><span className="eyebrow">05 · PROPERTY & CONSTRUCTION</span><h2>{lang==='ru'?'Земля, планирование и строительство':lang==='pt'?'Terrenos, planeamento e construção':'Land, planning & construction'}</h2></div><span className="meta-count">{metaConstructionIndicators.length} {lang==='ru'?'показателей':'indicators'}</span></div>
          <div className="meta-stats-grid">{metaConstructionIndicators.filter(item=>!item.municipality_id||item.municipality_id===metaRegion).slice(0,8).map(item=><article key={item.id}><span>{item.metric_label}</span><b>{Number(item.metric_value).toLocaleString(lang==='ru'?'ru-RU':lang==='pt'?'pt-PT':'en-GB')} <small>{item.unit.replaceAll('_',' ')}</small></b><small>{item.reference_year} · {item.comparison_period}</small></article>)}</div>
          <div className="meta-two-columns"><section><div className="meta-section-heading"><div><span className="eyebrow">PLANNING REGISTER</span><h2>{lang==='ru'?'Муниципальные планы':lang==='pt'?'Planos municipais':'Municipal plans'}</h2></div><span className="meta-count">{metaPlanning.length}</span></div>{metaPlanning.length?metaPlanning.filter(item=>metaRegion==='all'||item.municipality_id===metaRegion).map(item=><article className="meta-signal-card" key={item.id}><b>{item.title}</b><p>{item.summary}</p><small>{item.document_type} · {item.status}</small><a href={item.document_url||item.source_url} target="_blank" rel="noreferrer">{lang==='ru'?'Открыть документ':'Open document'} ↗</a></article>):<div className="meta-empty compact"><p>{lang==='ru'?'Реестр муниципальных PDM подключён. Документы будут добавляться после проверки статуса, даты действия и официальной публикации.':lang==='pt'?'O registo de PDM municipais está ligado. Os documentos serão adicionados após validação do estado, vigência e publicação oficial.':'The municipal PDM register is connected. Documents will be added after checking status, effective dates and official publication.'}</p><a href="https://prit.madeira.gov.pt/publico/planos" target="_blank" rel="noreferrer">PRIT — PDM ↗</a></div>}</section>
            <section><div className="meta-section-heading"><div><span className="eyebrow">OFFICIAL LAND OPPORTUNITIES</span><h2>{lang==='ru'?'Земельные возможности':lang==='pt'?'Oportunidades de terrenos':'Land opportunities'}</h2></div><span className="meta-count">{metaLandOpportunities.length}</span></div>{metaLandOpportunities.length?metaLandOpportunities.filter(item=>metaRegion==='all'||item.municipality_id===metaRegion).map(item=><article className="meta-signal-card opportunity" key={item.id}><b>{item.title}</b><p>{item.evidence_summary}</p><small>{item.opportunity_type} · {item.buildability_status} · {item.verification_status}</small><a href={item.source_url} target="_blank" rel="noreferrer">{lang==='ru'?'Официальный источник':'Official source'} ↗</a></article>):<div className="meta-empty compact"><p>{lang==='ru'?'Подтверждённых публичных участков пока нет. Мы не будем создавать фиктивные объявления или делать вывод о возможности строительства без проверки конкретного участка.':lang==='pt'?'Ainda não existem terrenos públicos confirmados. Não serão criados anúncios fictícios nem inferida a viabilidade de construção sem análise do terreno.':'There are no confirmed public land opportunities yet. We will not create fictional listings or infer buildability without parcel-specific checks.'}</p><a href="https://portaldoinvestidor.cm-pontadosol.pt/" target="_blank" rel="noreferrer">Portal do Investidor · Banco de Terras ↗</a></div>}</section></div>
          <section className="meta-analysis-panel">
            <div className="meta-analysis-heading"><div><span className="eyebrow">MADEIRA AI · BUSINESS & INVESTMENT RADAR</span><h2>{lang==='ru'?'AI-анализ бизнес- и инвестиционных проектов':lang==='pt'?'Análise IA de projetos empresariais e de investimento':'AI business & investment analysis'}</h2><p>{lang==='ru'?'AI сопоставит официальную статистику, проверенные потребности, каталог и актуальные публичные источники. Непроверенные идеи будут обозначены как гипотезы.':lang==='pt'?'A IA cruza estatísticas oficiais, necessidades validadas, diretório e fontes públicas atuais. Ideias não verificadas serão identificadas como hipóteses.':'AI will compare official statistics, validated needs, the directory and current public sources. Unverified ideas will be labelled as hypotheses.'}</p></div><button className="primary" type="button" onClick={runOpportunityAnalysis} disabled={analysisBusy}>{analysisBusy?(lang==='ru'?'Анализируем…':'Analysing…'):(lang==='ru'?'Запустить анализ':lang==='pt'?'Executar análise':'Run analysis')} <Sparkles size={15}/></button></div>
            <div className="analysis-limit-note">{lang==='ru'?'Требуется вход в аккаунт. Лимит — до 3 анализов в час. Сырые сообщения жителей не передаются AI до модерации.':lang==='pt'?'Requer autenticação. Limite de 3 análises por hora. Mensagens originais não são enviadas à IA antes da moderação.':'Sign-in required. Limit: up to 3 analyses per hour. Raw community submissions are excluded until moderation.'}</div>
            {analysisError&&<div className="meta-error" role="alert">{analysisError}</div>}
            {analysisResult&&<div className="analysis-result"><small>{lang==='ru'?'Результат':lang==='pt'?'Resultado':'Result'} · {analysisTimestamp?new Date(analysisTimestamp).toLocaleString(lang==='ru'?'ru-RU':lang==='pt'?'pt-PT':'en-GB'):''}{analysisCounts?' · '+analysisCounts.directory+' '+(lang==='ru'?'записей каталога':'directory records')+' · '+analysisCounts.indicators+' '+(lang==='ru'?'показателей':'indicators'):''}</small><div className="analysis-answer">{analysisResult}</div>{analysisSources.length>0&&<div className="analysis-source-links"><b>{lang==='ru'?'Источники AI-исследования':'AI research sources'}</b>{analysisSources.map((source,i)=><a key={source.url||i} href={source.url} target="_blank" rel="noreferrer">{source.title} ↗</a>)}</div>}</div>}
          </section>
          <div className="meta-section-heading"><div><span className="eyebrow">06 · TRUSTED DATA</span><h2>{lang==='ru'?'Источники данных архипелага':lang==='pt'?'Fontes de dados do arquipélago':'Archipelago data sources'}</h2></div><span className="meta-count">{metaSources.length}</span></div>
          <div className="meta-source-grid">{metaSources.map(source=><a href={source.url} key={source.id} target="_blank" rel="noreferrer"><span>{source.authority}</span><b>{source.name}</b><small>{source.update_note}</small></a>)}</div>
          <div className="meta-disclaimer">{lang==='ru'?'Статус «не найдено» не означает, что объекта или услуги не существует. Потребности и инвестиционные идеи должны проходить отдельную проверку.':lang==='pt'?'A ausência de um registo não prova que o serviço não exista. Necessidades e ideias de investimento exigem validação própria.':'An absent listing does not prove a service does not exist. Needs and investment ideas require independent validation.'}</div>
          <IslandMap businesses={businessesData} lang={lang}/>
        </section>}

        {active==='explore'&&<section className="module-page"><div className="module-intro"><span className="eyebrow">EXPLORE MADEIRA</span><h1>{t.places}</h1><p>{t.intro}</p></div><div className="filter-row">{[['all',t.all],['nature',t.nature],['city',t.city],['coast',t.coast]].map(([id,label])=><button key={id} onClick={()=>setFilter(id)} className={filter===id?'filter active':'filter'}>{label}</button>)}</div><div className="places-grid">{visiblePlaces.map(placeCard)}</div>
          <button className="region-folder" type="button" onClick={()=>document.getElementById('porto-moniz-guide')?.scrollIntoView({behavior:'smooth',block:'start'})}>
            <span className="region-folder-icon"><FolderOpen size={25}/></span>
            <span className="region-folder-copy"><small>NORTH-WEST · LOCAL INTELLIGENCE</small><b>Porto Moniz</b><em>{lang==='ru'?'Открыть региональный гид и местный каталог':lang==='pt'?'Abrir o guia regional e o diretório local':'Open regional guide & local directory'}</em></span>
            <span className="region-folder-count">{lang==='ru'?'ГИД + КАТАЛОГ':lang==='pt'?'GUIA + DIRETÓRIO':'GUIDE + DIRECTORY'} <ArrowUpRight size={17}/></span>
          </button>
          <section className="regional-guide" id="porto-moniz-guide">
            <div className="regional-guide-heading"><div><span className="eyebrow">NORTH-WEST · LOCAL INTELLIGENCE</span><h2>Porto Moniz</h2><p>{lang==='ru'?'Гид по северо-западу Мадейры: Атлантический океан, природные лавовые бассейны, лес Лауриссильва и жизнь местных общин.':lang==='pt'?'Guia do noroeste da Madeira: Oceano Atlântico, piscinas naturais de origem vulcânica, floresta Laurissilva e vida das comunidades locais.':'A guide to north-west Madeira: the Atlantic Ocean, natural volcanic pools, Laurissilva forest and local community life.'}</p></div><Waves size={26}/></div>
            <div className="regional-guide-highlights">
              <article><b>{lang==='ru'?'Природа и океан':lang==='pt'?'Natureza e oceano':'Nature & ocean'}</b><span>Porto Moniz pools · Cachalote · Seixal · Ribeira da Janela</span></article>
              <article><b>{lang==='ru'?'Лес и маршруты':lang==='pt'?'Floresta e percursos':'Forest & trails'}</b><span>Fanal · Laurissilva · PR 13 · PR 15</span></article>
              <article><b>{lang==='ru'?'Четыре прихода':lang==='pt'?'Quatro freguesias':'Four parishes'}</b><span>Porto Moniz · Seixal · Ribeira da Janela · Achadas da Cruz</span></article>
            </div>
            <div className="regional-guide-links">{portoMonizLinks[lang].map(([title,description,url])=><a key={url} href={url} target="_blank" rel="noreferrer"><b>{title}</b><span>{description}</span><ArrowUpRight size={14}/></a>)}</div>
            <div className="source-note"><b>{lang==='ru'?'Проверка перед поездкой:':lang==='pt'?'Antes de partir:':'Before you go:'}</b> {lang==='ru'?'погода и состояние моря — IPMA; статус троп и бронирование — IFCN. Информация о часах, тарифах и доступности меняется.':lang==='pt'?'consulte o IPMA para o tempo e estado do mar; o IFCN para o estado e reservas dos percursos. Horários e tarifas podem mudar.':'check IPMA for weather and sea conditions; check IFCN for live trail status and reservations. Hours and fees can change.'}</div>
          </section>
          <section className="local-directory" id="porto-moniz-directory">
            <div className="directory-heading"><div><span className="eyebrow">LOCAL BUSINESS & SERVICES</span><h2>{lang==='ru'?'Каталог Porto Moniz':lang==='pt'?'Diretório local Porto Moniz':'Porto Moniz local directory'}</h2><p>{lang==='ru'?'Компании и полезные сервисы четырёх приходов. Проверяйте сведения у поставщика перед обращением.':lang==='pt'?'Empresas e serviços úteis das quatro freguesias. Confirme os dados diretamente com cada fornecedor.':'Businesses and useful services across the four parishes. Confirm details directly with each provider.'}</p></div><div className="directory-count"><b>{businessesData.length}</b><span>{lang==='ru'?'записей':lang==='pt'?'registos':'listings'}</span></div></div>
            <div className="directory-controls"><input value={businessQuery} onChange={e=>setBusinessQuery(e.target.value)} placeholder={lang==='ru'?'Поиск компании, адреса или услуги…':lang==='pt'?'Pesquisar empresa, morada ou serviço…':'Search business, address or service…'}/><select value={businessParish} onChange={e=>setBusinessParish(e.target.value)}><option value="all">{lang==='ru'?'Все приходы':lang==='pt'?'Todas as freguesias':'All parishes'}</option>{['Porto Moniz','Seixal','Ribeira da Janela','Achadas da Cruz','Todo o concelho'].map(p=><option key={p}>{p}</option>)}</select></div>
            <div className="directory-filters">{[['all','Все'],['food','Еда'],['stay','Жильё'],['mobility','Транспорт'],['activities','Экскурсии'],['retail','Магазины'],['services','Услуги'],['property','Недвижимость']].map(([id,label])=><button key={id} className={businessCategory===id?'active':''} onClick={()=>setBusinessCategory(id)}>{lang==='ru'?label:({all:lang==='pt'?'Todos':'All',food:lang==='pt'?'Restaurantes':'Food',stay:lang==='pt'?'Alojamento':'Stays',mobility:lang==='pt'?'Transportes':'Transport',activities:lang==='pt'?'Atividades':'Activities',retail:lang==='pt'?'Comércio':'Shops',services:lang==='pt'?'Serviços':'Services',property:lang==='pt'?'Imobiliário':'Property'}[id])}</button>)}</div>
            <div className="directory-grid">{businessesData.filter(b=>(businessCategory==='all'||b.category===businessCategory)&&(businessParish==='all'||b.parish===businessParish)&&(b.name+' '+b.address+' '+b.parish+' '+b.description).toLowerCase().includes(businessQuery.toLowerCase())).map(b=><article className="directory-card" key={b.id}><div className="directory-card-top"><span>{({food:'FOOD & DRINK',stay:'ACCOMMODATION',mobility:'TRANSPORT',activities:'ACTIVITIES',retail:'RETAIL',services:'LOCAL SERVICES',property:'PROPERTY'})[b.category]}</span><small className={'source-pill '+b.source}>{({municipal:'Муниципальный источник',official:'Официальный',online:'Онлайн-каталог',directory:'Справочник'})[b.source]||b.source}</small></div><h3>{b.name}</h3><p>{b.description}</p><div className="directory-address"><MapPin size={13}/>{b.address}</div><div className="directory-card-footer"><span>{b.parish}</span><div>{b.phone&&<a href={'tel:'+b.phone}> <CarFront size={13}/> {b.phone}</a>}<a href={b.sourceUrl} target="_blank" rel="noreferrer">{lang==='ru'?'Источник':lang==='pt'?'Fonte':'Source'} <ArrowUpRight size={13}/></a></div></div></article>)}</div>
            {businessesData.length===0&&<p className="directory-empty">{lang==='ru'?'Каталог временно недоступен. Откройте официальный муниципальный список.':lang==='pt'?'Diretório temporariamente indisponível. Consulte a lista municipal oficial.':'Directory temporarily unavailable. Open the official municipal listing.'} <a href="https://www.portomoniz.pt/pt/atividade-municipal/economia/diretorio-de-empresas">Porto Moniz</a></p>}
            <div className="directory-footnote">{lang==='ru'?'Статус источника показывает происхождение записи, а не гарантию работы компании. Даты, часы, услуги, контакты и доступность требуют подтверждения.':lang==='pt'?'A etiqueta identifica a origem da informação, não garante que a empresa esteja em funcionamento. Confirme horários, serviços e contactos.':'Source labels identify where a listing came from; they do not guarantee that a business is currently operating. Verify hours, services and contact details.'}</div>
          </section>
          <IslandMap businesses={businessesData} lang={lang}/></section>}

        {active==='property'&&<section className="module-page"><div className="module-intro"><span className="eyebrow">REAL ESTATE INTELLIGENCE</span><h1>{t.property}</h1><p>{t.propertyText}</p></div><div className="notice-card"><ShieldCheck size={22}/><div><b>Проверка важнее красивого объявления</b><p>До покупки участка или дома проверьте PDM муниципалитета, классификацию земли, доступ к дороге, инфраструктуру, ограничения REN/RAN и возможность лицензирования.</p></div></div><h2 className="subheading">{t.areas}</h2><div className="area-grid">{areas.map(a=><article className="area-card" key={a.name}><MapPin size={18}/><h3>{a.name}</h3><p>{a.note}</p><button onClick={()=>{setQuery(a.name);openSection('explore')}}>Изучить район <ArrowUpRight size={14}/></button></article>)}</div><div className="source-note"><b>Важно:</b> это справочник районов, а не каталог доступных объектов. Проверяйте классификацию земли и допустимость строительства по официальным документам.</div><div className="official-source-list"><h2>Официальные источники для проверки недвижимости</h2>{sources.filter(x=>x.category==='property').map(x=><a key={x.id} href={x.url} target="_blank" rel="noreferrer"><b>{x.name}</b><span>{x.description}</span><small>{x.updateNote}</small></a>)}</div></section>}

        {active==='travel'&&<section className="module-page"><div className="module-intro"><span className="eyebrow">TRAVEL PLANNER</span><h1>{t.travel}</h1><p>{t.travelText}</p></div><div className="travel-grid"><article className="travel-card large"><Mountain/><span>OUTDOOR</span><h2>Горы и levadas</h2><p>Планируйте прогулки с учётом погоды, уровня сложности и официального статуса троп.</p></article><article className="travel-card coast"><Waves/><span>ATLANTIC</span><h2>Океан и побережье</h2><p>Пляжи, природные бассейны и панорамные точки.</p></article><article className="travel-card city"><Hotel/><span>STAY</span><h2>Проживание</h2><p>Подбор размещения и районов для поездки — следующий этап каталога.</p></article></div><div className="source-note">Статус троп, погодные предупреждения и условия посещения необходимо проверять перед поездкой в официальных источниках.</div></section>}

        {active==='invest'&&<section className="module-page"><div className="module-intro"><span className="eyebrow">BUSINESS & INVESTMENT</span><h1>{t.business}</h1><p>{t.businessText}</p></div><div className="notice-card"><BriefcaseBusiness size={22}/><div><b>Возможности для дальнейшего исследования</b><p>Ниже — направления для проверки спроса, а не подтверждённые инвестиционные предложения или обещание доходности.</p></div></div><div className="idea-list">{ideas.map((idea,i)=><article className="idea-card" key={idea.title}><div className="idea-number">0{i+1}</div><div><span className="eyebrow">{idea.kind}</span><h3>{idea.title}</h3><p>{idea.text}</p></div><span className="priority">{idea.priority}</span></article>)}</div><div className="official-source-list"><h2>Официальные источники для исследования</h2>{sources.filter(x=>['property','tourism'].includes(x.category)).map(x=><a key={x.id} href={x.url} target="_blank" rel="noreferrer"><b>{x.name}</b><span>{x.description}</span><small>{x.updateNote}</small></a>)}</div></section>}

        {active==='transport'&&<section className="module-page">
          <div className="module-intro"><span className="eyebrow">ARCHIPELAGO MOBILITY</span><h1>{lang==='ru'?'Транспорт на Мадейре и Порту-Санту':lang==='pt'?'Transportes na Madeira e no Porto Santo':'Transport across Madeira & Porto Santo'}</h1><p>{lang==='ru'?'Поиск остановок, прямых автобусных маршрутов и ближайших отправлений на основе опубликованного расписания SIGA.':lang==='pt'?'Pesquise paragens, percursos diretos e próximas partidas com base nos horários publicados pela SIGA.':'Search stops, direct bus routes and next departures using the published SIGA timetable.'}</p></div>
          <section className="meta-schedule-panel transit-planner-panel">
            <div className="meta-section-heading"><div><span className="eyebrow">GTFS · REDE SIGA</span><h2>{lang==='ru'?'Планировщик автобусов':lang==='pt'?'Planeador de autocarros':'Bus journey planner'}</h2></div><span className="meta-live-state">{transitBusy?'ЗАГРУЗКА':transitFeed?'РАСПИСАНИЕ':'ОЖИДАЕТ ДАННЫЕ'}</span></div>
            {transitFeed&&<div className="transit-feed-meta"><span>{transitFeed.publisher_name||'Rede SIGA'}</span><span>Версия {transitFeed.feed_version}</span><span>{transitFeed.feed_start_date} — {transitFeed.feed_end_date}</span>{transitFeed.license_status==='not_provided'&&<span className="transit-provisional">Лицензия в архиве не указана</span>}</div>}
            <div className="transit-search-grid">
              <label><span>{lang==='ru'?'Откуда — остановка':'From — stop'}</span><input value={transitOriginQuery} onChange={e=>setTransitOriginQuery(e.target.value)} placeholder={lang==='ru'?'Например, Funchal / Marina':'e.g. Funchal / Marina'}/></label>
              <label><span>{lang==='ru'?'Куда — остановка':'To — stop'}</span><input value={transitDestinationQuery} onChange={e=>setTransitDestinationQuery(e.target.value)} placeholder={lang==='ru'?'Например, Aeroporto':'e.g. Aeroporto'}/></label>
            </div>
            <div className="transit-actions"><button className="primary" onClick={searchTransitStops} disabled={transitBusy||!transitFeed}>{lang==='ru'?'Найти остановки':'Find stops'} <Search size={15}/></button><button className="ghost" onClick={findNearbyTransitStops} disabled={transitBusy||!transitFeed}><Navigation size={15}/>{lang==='ru'?'Остановки рядом со мной':'Stops near me'}</button></div>
            {(transitOriginOptions.length>0||transitDestinationOptions.length>0)&&<div className="transit-select-grid">
              <label><span>{lang==='ru'?'Выберите отправление':'Select origin'}</span><select value={transitOrigin?.stop_id||''} onChange={e=>setTransitOrigin(transitOriginOptions.find(x=>x.stop_id===e.target.value)||null)}><option value="">—</option>{transitOriginOptions.map(stop=><option key={stop.stop_id} value={stop.stop_id}>{stop.stop_name}</option>)}</select></label>
              <label><span>{lang==='ru'?'Выберите назначение':'Select destination'}</span><select value={transitDestination?.stop_id||''} onChange={e=>setTransitDestination(transitDestinationOptions.find(x=>x.stop_id===e.target.value)||null)}><option value="">—</option>{transitDestinationOptions.map(stop=><option key={stop.stop_id} value={stop.stop_id}>{stop.stop_name}</option>)}</select></label>
            </div>}
            <div className="transit-actions"><button className="primary" onClick={searchTransitRoutes} disabled={transitBusy||!transitOrigin||!transitDestination}>{lang==='ru'?'Найти прямые рейсы':'Search direct routes'} <ArrowUpRight size={15}/></button></div>
            {transitError&&<div className="transit-message" role="status">{transitError}</div>}
            {transitRoutes.length>0&&<div className="transit-results"><h3>{lang==='ru'?'Найденные прямые рейсы':'Direct route results'}</h3>{transitRoutes.map((route,i)=><article className="transit-result" key={route.departure_local+'-'+i}><div className="transit-route-number">{route.route_short_name||'BUS'}</div><div><b>{route.route_long_name||route.agency_name}</b><small>{route.agency_name||'SIGA'} · {route.origin_name} → {route.destination_name}</small></div><strong>{String(route.departure_local).slice(11,16)} <span>→</span> {String(route.arrival_local).slice(11,16)}</strong></article>)}</div>}
          </section>
          <section className="meta-schedule-panel transit-nearby-panel"><div className="meta-section-heading"><div><span className="eyebrow">NEARBY STOPS</span><h2>{lang==='ru'?'Ближайшие остановки и отправления':'Nearby stops & departures'}</h2></div></div>
            {transitNearbyStops.length===0?<p className="source-note">{lang==='ru'?'Разрешите геолокацию, чтобы найти остановки в радиусе 1,5 км.':'Allow location access to find stops within 1.5 km.'}</p>:<div className="transit-nearby-list">{transitNearbyStops.map(stop=><button key={stop.stop_id} className={transitSelectedStop?.stop_id===stop.stop_id?'active':''} onClick={()=>loadTransitDepartures(stop)}><b>{stop.stop_name}</b><small>{stop.distance_km.toFixed(2)} км · {stop.stop_code||stop.stop_id}</small></button>)}</div>}
            {transitSelectedStop&&<div className="transit-results"><h3>{transitSelectedStop.stop_name}</h3>{transitDepartures.length===0&&!transitBusy?<p className="source-note">{lang==='ru'?'Нет ближайших отправлений в загруженном расписании.':'No upcoming departures in the imported timetable.'}</p>:transitDepartures.map((departure,i)=><article className="transit-result" key={departure.departure_local+'-'+i}><div className="transit-route-number">{departure.route_short_name||'BUS'}</div><div><b>{departure.route_long_name||departure.agency_name}</b><small>{departure.agency_name||'SIGA'} {departure.trip_headsign?'· '+departure.trip_headsign:''}</small></div><strong>{String(departure.departure_local).slice(11,16)}</strong></article>)}</div>}
          </section>
          <section className="meta-schedule-panel"><div className="meta-section-heading"><div><span className="eyebrow">OFFICIAL TRANSPORT SOURCES</span><h2>{lang==='ru'?'Официальные расписания и уведомления':'Official timetables & notices'}</h2></div><span className="meta-live-state">SIGA · OPERATOR</span></div><div className="meta-schedule-links">
            <a href="https://siga.madeira.gov.pt/public/" target="_blank" rel="noreferrer"><span>BUS ROUTE PLANNER</span><b>SIGA — {lang==='ru'?'Планировщик поездки':'Trip planner'}</b><small>{lang==='ru'?'Официальный поиск маршрута по дате и времени':'Official route search by date and time'}</small><em>{lang==='ru'?'Построить маршрут':'Plan a route'} <ArrowUpRight size={13}/></em></a>
            <a href="https://siga.madeira.gov.pt/horarios" target="_blank" rel="noreferrer"><span>BUS TIMETABLES</span><b>SIGA — {lang==='ru'?'Расписания автобусов':'Bus timetables'}</b><small>{lang==='ru'?'Линии и расписания трёх перевозчиков':'Routes and timetables for three operators'}</small><em>{lang==='ru'?'Открыть расписание':'Open timetables'} <ArrowUpRight size={13}/></em></a>
            <a href="https://siga.madeira.gov.pt/avisos" target="_blank" rel="noreferrer"><span>SERVICE NOTICES</span><b>SIGA — {lang==='ru'?'Изменения и предупреждения':'Changes & alerts'}</b><small>{lang==='ru'?'Перекрытия, изменения остановок и отмены рейсов':'Road closures, stop changes and cancellations'}</small><em>{lang==='ru'?'Проверить уведомления':'Check notices'} <ArrowUpRight size={13}/></em></a>
            <a href="https://reservasc.portosantoline.pt/pt/horarios/" target="_blank" rel="noreferrer"><span>FERRY · FUNCHAL ↔ PORTO SANTO</span><b>Porto Santo Line — {lang==='ru'?'Паромное расписание':'Ferry timetable'}</b><small>{lang==='ru'?'Отправления и бронирование':'Departures and booking'}</small><em>{lang==='ru'?'Проверить рейсы':'Check sailings'} <ArrowUpRight size={13}/></em></a>
            <a href="https://www.ana.pt/en/content-topic/find-flights" target="_blank" rel="noreferrer"><span>AIR · FNC + PXO</span><b>ANA — {lang==='ru'?'Информация о рейсах':'Flight information'}</b><small>{lang==='ru'?'Вылеты и прилёты аэропортов':'Airport arrivals and departures'}</small><em>{lang==='ru'?'Проверить рейсы':'Check flights'} <ArrowUpRight size={13}/></em></a>
          </div></section>
          <div className="notice-card"><ShieldCheck size={22}/><div><b>{lang==='ru'?'Ограничения данных':'Data limitations'}</b><p>{lang==='ru'?'Используется статическое расписание GTFS, а не live-позиции автобусов. Проверяйте уведомления SIGA перед поездкой. В архиве не найден файл лицензии; импорт помечается как предварительный и остаётся в Preview до подтверждения условий повторного использования.':lang==='pt'?'É utilizado um horário GTFS estático, não posições em tempo real. Consulte os avisos SIGA antes da viagem. O arquivo não inclui licença; os dados permanecem em Preview até confirmação das condições de reutilização.':'This is a static GTFS timetable, not live bus tracking. Check SIGA notices before travel. No licence file was included; the dataset remains a provisional Preview import until reuse terms are confirmed.'}</p><small><a href="https://gtfs.tiim.pt/rede-siga/rede-siga-gtfs.zip" target="_blank" rel="noreferrer">GTFS archive <ArrowUpRight size={12}/></a> · <a href="https://siga.madeira.gov.pt/faq" target="_blank" rel="noreferrer">SIGA official FAQ <ArrowUpRight size={12}/></a></small></div></div>
          <div className="source-note">{lang==='ru'?'Для изменений в день поездки ориентируйтесь на SIGA и официальных перевозчиков.':'For day-of-travel changes, rely on SIGA and its official operators.'}</div>
        </section>}
        {active==='weather'&&<section className="module-page"><div className="module-intro"><span className="eyebrow">ISLAND WEATHER</span><h1>Погода на Мадейре</h1><p>Климат на острове различается по высоте и побережью. Перед походами и поездками сверяйте прогноз и предупреждения.</p></div><div className="weather-grid"><div className="weather-main"><CloudSun size={46}/><span>IPMA · ОФИЦИАЛЬНЫЙ ИСТОЧНИК</span><h2>Прогноз по острову</h2><p>Официальные данные IPMA. Погода в горах может отличаться от побережья.</p><small className="live-stamp">{weatherData?'Получено: '+new Date(weatherData.fetchedAt).toLocaleString():'Загружаем прогноз…'}</small></div><div className="weather-links"><h3>Официальные источники</h3><a href="https://api.ipma.pt/" target="_blank" rel="noreferrer">IPMA API <ArrowUpRight size={14}/></a><a href="https://www.procivmadeira.pt/" target="_blank" rel="noreferrer">Proteção Civil Madeira <ArrowUpRight size={14}/></a></div></div>{weatherError&&<div className="source-note">IPMA временно недоступен: {weatherError}. Проверьте первоисточник.</div>}{weatherData?.warnings?.length>0&&<div className="notice-card weather-warning"><ShieldCheck size={20}/><div><b>Метеопредупреждения для Мадейры</b><p>{weatherData.warnings.map((w,i)=><span key={i}>{w.awarenessTypeName||w.awarenessType||'Предупреждение'} · {w.awarenessLevelName||w.awarenessLevelID||w.awarenessLevel||'Уровень'} </span>)}</p></div></div>}<div className="forecast-grid">{(weatherData?.locations||[]).filter(x=>x.available).map(location=><article className="forecast-card" key={location.id}><span>{location.name}</span><b>{location.days?.[0]?.maxC??'—'}° <small>/ {location.days?.[0]?.minC??'—'}°</small></b><p>{location.days?.[0]?.date||'—'} · Осадки: {location.days?.[0]?.rainProbability??'—'}%</p><small>IPMA · {location.updatedAt||'обновление не указано'}</small></article>)}</div></section>}

        {active==='concierge'&&<section className="module-page"><div className="module-intro"><span className="eyebrow">MADEIRA AI · CONCIERGE</span><h1>{t.concierge}</h1><p>{t.previewText}</p></div><div className="chat-panel"><div className="chat-top"><div className="ai-avatar"><Sparkles/></div><div><b>MADEIRA AI</b><small>Island assistant · Server API</small></div><span className="preview-pill">API</span></div><div className="chat-messages">{chat.length===0&&<div className="welcome-message"><Sparkles size={25}/><h3>Чем помочь на Мадейре?</h3><p>Спросите о районах, маршрутах, недвижимости или идеях для поездки.</p><div className="suggestions">{['Что посмотреть за 3 дня?','Где искать участок для виллы?','Как подготовиться к походу?'].map(q=><button key={q} onClick={()=>setMessage(q)}>{q}<ArrowUpRight size={13}/></button>)}</div></div>}{chat.map((m,i)=><div className={'chat-bubble '+m.role} key={i}><div>{m.text}</div>{m.role==='assistant'&&m.sources?.length>0&&<div className="chat-sources"><small>ИСТОЧНИКИ · {m.searchedAt?new Date(m.searchedAt).toLocaleString(lang==='ru'?'ru-RU':lang==='pt'?'pt-PT':'en-GB'):''}</small>{m.sources.map((source,j)=><a key={source.url||j} href={source.url} target="_blank" rel="noopener noreferrer">{source.title}<ArrowUpRight size={12}/></a>)}</div>}</div>)}</div><form className="chat-form" onSubmit={sendChat}><input value={message} onChange={e=>setMessage(e.target.value)} placeholder={t.askPlaceholder}/><button className="primary" type="submit" disabled={assistantBusy}><Send size={16}/>{assistantBusy?'…':t.send}</button></form><div className="chat-disclaimer">{assistantBusy?'MADEIRA AI формирует ответ…':'AI-ответы доступны через серверный API. Данные IPMA и официальные источники указаны отдельно.'}</div></div></section>}

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
