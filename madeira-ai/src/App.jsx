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
  const [metaLoading,setMetaLoading]=useState(false);
  const [metaError,setMetaError]=useState('');
  const [metaRegion,setMetaRegion]=useState('all');
  const [businessCategory,setBusinessCategory]=useState('all');
  const [businessParish,setBusinessParish]=useState('all');
  const [businessQuery,setBusinessQuery]=useState('');
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
      supabase.from('island_sources').select('id,name,category,publisher,url,authority,scope,update_note,last_checked_at').eq('is_active',true).order('name')
    ]).then(results=>{
      if(cancelled)return;
      const failed=results.find(result=>result.error);
      if(failed)throw failed.error;
      setMetaMunicipalities(results[0].data||[]);setMetaDirectory(results[1].data||[]);setMetaNeeds(results[2].data||[]);setMetaOpportunities(results[3].data||[]);setMetaSources(results[4].data||[]);
    }).catch(error=>{if(!cancelled)setMetaError(error.message||'Не удалось загрузить общую базу острова.');})
      .finally(()=>{if(!cancelled)setMetaLoading(false);});
    return ()=>{cancelled=true;};
  },[active]);

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
          <div className="meta-section-heading"><div><span className="eyebrow">02 · DIRECTORY</span><h2>{lang==='ru'?'Что уже существует':lang==='pt'?'O que já existe':'What already exists'}</h2></div><span className="meta-count">{metaDirectory.length} {lang==='ru'?'записей':'records'}</span></div>
          <div className="meta-filter-row"><button className={metaRegion==='all'?'active':''} onClick={()=>setMetaRegion('all')}>{lang==='ru'?'Весь архипелаг':lang==='pt'?'Todo o arquipélago':'All islands'}</button>{metaMunicipalities.map(m=><button key={m.id} className={metaRegion===m.id?'active':''} onClick={()=>setMetaRegion(m.id)}>{m.name_pt}</button>)}</div>
          {metaDirectory.filter(x=>metaRegion==='all'||x.municipality_id===metaRegion).length===0?<div className="meta-empty"><Globe2 size={26}/><b>{lang==='ru'?'Каталог готов к наполнению':lang==='pt'?'Catálogo pronto a ser preenchido':'Directory ready for verified records'}</b><p>{lang==='ru'?'Единая структура уже создана. Сейчас в базе нет загруженных карточек организаций — мы будем добавлять их только вместе с источником, датой проверки и статусом достоверности.':lang==='pt'?'A estrutura central já existe. Ainda não há registos de organizações carregados; cada entrada será adicionada com fonte, data de verificação e estado de confiança.':'The central structure is in place. No organization records have been imported yet; each entry will carry its source, verification date and confidence status.'}</p></div>:<div className="meta-directory-grid">{metaDirectory.filter(x=>metaRegion==='all'||x.municipality_id===metaRegion).map(entry=><article key={entry.id} className="meta-directory-card"><span>{entry.category}</span><b>{entry.name}</b><p>{entry.description||entry.address||''}</p><small>{entry.verification_status.replace('_',' ')}{entry.last_verified_at?' · '+new Date(entry.last_verified_at).toLocaleDateString():''}</small>{(entry.source_url||entry.website)&&<a href={entry.source_url||entry.website} target="_blank" rel="noreferrer">{lang==='ru'?'Открыть источник':'Open source'} ↗</a>}</article>)}</div>}
          <div className="meta-two-columns"><section><div className="meta-section-heading"><div><span className="eyebrow">03 · NEEDS MAP</span><h2>{lang==='ru'?'Чего не хватает':lang==='pt'?'O que faz falta':'What is missing'}</h2></div><span className="meta-count">{metaNeeds.length}</span></div>{metaNeeds.length?metaNeeds.filter(x=>metaRegion==='all'||x.municipality_id===metaRegion).map(item=><article className="meta-signal-card" key={item.id}><b>{item.title}</b><p>{item.description}</p><small>{item.category} · {item.validation_status}</small></article>):<div className="meta-empty compact"><p>{lang==='ru'?'Потребности пока не объявляются фактами. Они будут добавляться после проверки статистики, муниципальных документов и свидетельств жителей.':'Needs are not presented as facts without evidence. They will be added after checking statistics, municipal documents and resident feedback.'}</p></div>}</section>
            <section><div className="meta-section-heading"><div><span className="eyebrow">04 · OPPORTUNITY RADAR</span><h2>{lang==='ru'?'Что можно создать':lang==='pt'?'O que pode ser criado':'What could be built'}</h2></div><span className="meta-count">{metaOpportunities.length}</span></div>{metaOpportunities.length?metaOpportunities.filter(x=>metaRegion==='all'||x.municipality_id===metaRegion).map(item=><article className="meta-signal-card opportunity" key={item.id}><b>{item.title}</b><p>{item.description}</p><small>{item.category} · {item.status}</small></article>):<div className="meta-empty compact"><p>{lang==='ru'?'Идеи для бизнеса и инвестиций будут связаны с конкретной потребностью и подтверждающими источниками.':'Business and investment ideas will be linked to a concrete need and supporting evidence.'}</p></div>}</section></div>
          <div className="meta-section-heading"><div><span className="eyebrow">05 · TRUSTED DATA</span><h2>{lang==='ru'?'Источники данных архипелага':lang==='pt'?'Fontes de dados do arquipélago':'Archipelago data sources'}</h2></div><span className="meta-count">{metaSources.length}</span></div>
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

        {active==='transport'&&<section className="module-page"><div className="module-intro"><span className="eyebrow">GET AROUND</span><h1>Транспорт на Мадейре</h1><p>Сравнение способов передвижения по острову.</p></div><div className="transport-grid">{[{icon:CarFront,title:'Аренда автомобиля',text:'Гибкость для поездок по острову. Уточняйте условия страховки, парковки и горных дорог.'},{icon:Anchor,title:'Морские трансферы',text:'Морские прогулки и локальные перевозчики — проверяйте расписание у оператора.'},{icon:Plane,title:'Аэропорт и трансфер',text:'Планирование поездки из аэропорта и предварительный заказ трансфера.'}].map(x=><article className="transport-card" key={x.title}><x.icon size={24}/><h3>{x.title}</h3><p>{x.text}</p></article>)}</div><div className="source-note">Бронирование и актуальные тарифы пока не подключены. Не используйте демонстрационные данные как подтверждение доступности услуг.</div></section>}

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
