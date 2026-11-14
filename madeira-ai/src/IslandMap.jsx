import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MapPin, Search, Layers, ExternalLink } from 'lucide-react';

const islandPoints = [
  {id:'funchal',name:'Funchal',lat:32.6500,lng:-16.9167,category:'city',description:'Столица Мадейры: старый город, рынок, набережная и музеи.',url:'https://visitmadeira.com/'},
  {id:'camara-lobos',name:'Câmara de Lobos',lat:32.6500,lng:-16.9667,category:'city',description:'Рыбацкий городок и живописная бухта к западу от Фуншала.',url:'https://visitmadeira.com/'},
  {id:'ribeira-brava',name:'Ribeira Brava',lat:32.6740,lng:-17.0620,category:'city',description:'Прибрежный город на южном побережье.',url:'https://visitmadeira.com/'},
  {id:'ponta-sol',name:'Ponta do Sol',lat:32.6794,lng:-17.1045,category:'city',description:'Посёлок на солнечном юго-западном побережье.',url:'https://visitmadeira.com/'},
  {id:'calheta',name:'Calheta',lat:32.7160,lng:-17.1710,category:'city',description:'Юго-запад острова, марина и пляжная зона.',url:'https://visitmadeira.com/'},
  {id:'jardim-mar',name:'Jardim do Mar',lat:32.7371,lng:-17.2063,category:'coast',description:'Небольшой прибрежный посёлок на юго-западе.',url:'https://visitmadeira.com/'},
  {id:'porto-moniz',name:'Porto Moniz',lat:32.8680,lng:-17.1664,category:'coast',description:'Природные лавовые бассейны и северо-западное побережье.',url:'https://www.portomoniz.pt/pt/visitantes'},
  {id:'seixal',name:'Seixal',lat:32.8190,lng:-17.1020,category:'coast',description:'Чёрный песчаный пляж, природные бассейны и северное побережье.',url:'https://visitmadeira.com/'},
  {id:'sao-vicente',name:'São Vicente',lat:32.7960,lng:-17.0430,category:'city',description:'Городок на северном побережье у зелёной долины.',url:'https://visitmadeira.com/'},
  {id:'santana',name:'Santana',lat:32.8000,lng:-16.8667,category:'city',description:'Традиционные дома с соломенными крышами и горные маршруты.',url:'https://visitmadeira.com/'},
  {id:'machico',name:'Machico',lat:32.7167,lng:-16.7667,category:'city',description:'Исторический город и бухта на востоке острова.',url:'https://visitmadeira.com/'},
  {id:'santa-cruz',name:'Santa Cruz',lat:32.6880,lng:-16.7930,category:'city',description:'Прибрежный город рядом с аэропортом.',url:'https://visitmadeira.com/'},
  {id:'canical',name:'Caniçal',lat:32.7380,lng:-16.7380,category:'city',description:'Восточное побережье и музей китов.',url:'https://visitmadeira.com/'},
  {id:'cabo-girao',name:'Cabo Girão Skywalk',lat:32.6572,lng:-17.0048,category:'viewpoint',description:'Знаменитая стеклянная смотровая площадка над южным побережьем.',url:'https://visitmadeira.com/'},
  {id:'garajau',name:'Cristo Rei / Garajau',lat:32.6383,lng:-16.8507,category:'viewpoint',description:'Смотровая площадка и охраняемая морская зона Garajau.',url:'https://visitmadeira.com/'},
  {id:'pico-arieiro',name:'Pico do Areeiro',lat:32.7357,lng:-16.9287,category:'nature',description:'Высокогорная точка и начало популярного маршрута PR1. Проверяйте статус тропы перед выходом.',url:'https://ifcn.madeira.gov.pt/'},
  {id:'pico-ruivo',name:'Pico Ruivo',lat:32.7590,lng:-16.9430,category:'nature',description:'Одна из высочайших вершин Мадейры. Доступ зависит от состояния маршрутов и погоды.',url:'https://ifcn.madeira.gov.pt/'},
  {id:'fanal',name:'Fanal',lat:32.8094,lng:-17.1407,category:'nature',description:'Лавровый лес и туманные пейзажи плато Paul da Serra.',url:'https://ifcn.madeira.gov.pt/'},
  {id:'rabacal',name:'Rabaçal · 25 Fontes',lat:32.7616,lng:-17.1344,category:'nature',description:'Популярная зона левáд и водопадов. Уточняйте доступность троп.',url:'https://ifcn.madeira.gov.pt/'},
  {id:'ribeiro-frio',name:'Ribeiro Frio · Balcões',lat:32.7390,lng:-16.8872,category:'nature',description:'Лесная зона и короткий маршрут к смотровой площадке Balcões.',url:'https://ifcn.madeira.gov.pt/'},
  {id:'caldeirao-verde',name:'Queimadas · Caldeirão Verde',lat:32.7836,lng:-16.9060,category:'nature',description:'Начальная зона маршрута Levada do Caldeirão Verde.',url:'https://ifcn.madeira.gov.pt/'},
  {id:'ponta-sao-lourenco',name:'Ponta de São Lourenço',lat:32.7493,lng:-16.7067,category:'nature',description:'Восточный полуостров с открытыми видами на Атлантику; перед походом проверяйте условия.',url:'https://ifcn.madeira.gov.pt/'},
  {id:'ponta-rosto',name:'Miradouro da Ponta do Rosto',lat:32.7431,lng:-16.7014,category:'viewpoint',description:'Панорамная точка на восточной оконечности острова.',url:'https://geodiversidade.madeira.gov.pt/index.php/en/geosites/mapa'},
  {id:'veu-noiva',name:'Miradouro do Véu da Noiva',lat:32.8161,lng:-17.0953,category:'viewpoint',description:'Смотровая площадка на северном побережье с видом на водопад.',url:'https://geodiversidade.madeira.gov.pt/index.php/en/geosites/mapa'},
  {id:'encumeada',name:'Encumeada',lat:32.7543,lng:-17.0195,category:'viewpoint',description:'Горный перевал с видами на северную и южную части острова.',url:'https://visitmadeira.com/'},
  {id:'airport',name:'Aeroporto da Madeira',lat:32.6979,lng:-16.7745,category:'transport',description:'Международный аэропорт Мадейры.',url:'https://www.aeroportomadeira.pt/'},
  {id:'porto-moniz-pools',name:'Piscinas Naturais do Porto Moniz',lat:32.8680,lng:-17.1664,category:'coast',description:'Природные морские бассейны в лавовых породах.',url:'https://www.portomoniz.pt/pt/visitantes'},
  {id:'porto-santo-vila-baleira',name:'Vila Baleira · Porto Santo',lat:33.0580,lng:-16.3370,category:'city',description:'Главный населённый центр острова Порту-Санту.',url:'https://visitmadeira.com/en/where-to-go/porto-santo/'},
  {id:'porto-santo-airport',name:'Aeroporto do Porto Santo',lat:33.0730,lng:-16.3500,category:'transport',description:'Аэропорт острова Порту-Санту.',url:'https://www.ana.pt/en/opo/home'},
  {id:'porto-santo-beach',name:'Praia do Porto Santo',lat:33.0530,lng:-16.3100,category:'coast',description:'Главный песчаный пляж острова Порту-Санту.',url:'https://visitmadeira.com/en/where-to-go/porto-santo/'},
  {id:'porto-santo-pico-castelo',name:'Pico do Castelo · Porto Santo',lat:33.0750,lng:-16.3210,category:'nature',description:'Возвышенность с панорамными видами на остров.',url:'https://visitmadeira.com/en/where-to-go/porto-santo/'}
];

const categoryLabels = {
  ru:{all:'Все метки',city:'Города',nature:'Природа и тропы',viewpoint:'Смотровые',coast:'Побережье',transport:'Транспорт',local:'Каталог Porto Moniz'},
  en:{all:'All pins',city:'Towns',nature:'Nature & trails',viewpoint:'Viewpoints',coast:'Coast',transport:'Transport',local:'Porto Moniz directory'},
  pt:{all:'Todos os pontos',city:'Localidades',nature:'Natureza e trilhos',viewpoint:'Miradouros',coast:'Costa',transport:'Transportes',local:'Diretório Porto Moniz'}
};

const escapeHtml = (value='') => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

function loadLeaflet(){
  if(window.L) return Promise.resolve(window.L);
  if(window.__madeiraLeafletPromise) return window.__madeiraLeafletPromise;
  window.__madeiraLeafletPromise = new Promise((resolve,reject)=>{
    if(!document.querySelector('link[data-madeira-leaflet]')){
      const link=document.createElement('link');link.rel='stylesheet';link.href='https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';link.dataset.madeiraLeaflet='1';document.head.appendChild(link);
    }
    const script=document.createElement('script');script.src='https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';script.async=true;
    script.onload=()=>{if(window.L)resolve(window.L);else{window.__madeiraLeafletPromise=null;reject(new Error('Leaflet unavailable'));}};
    script.onerror=()=>{window.__madeiraLeafletPromise=null;reject(new Error('Map library could not be loaded'));};
    document.head.appendChild(script);
  });
  return window.__madeiraLeafletPromise;
}

export default function IslandMap({businesses=[],lang='ru'}){
  const mapNode=useRef(null);
  const mapRef=useRef(null);
  const layerRef=useRef(null);
  const [category,setCategory]=useState('all');
  const [query,setQuery]=useState('');
  const [mapError,setMapError]=useState('');
  const [mapReady,setMapReady]=useState(false);
  const labels=categoryLabels[lang]||categoryLabels.ru;
  const localGroups=useMemo(()=>{
    const groups=[
      {name:'Porto Moniz',lat:32.8680,lng:-17.1664,parish:'Porto Moniz'},
      {name:'Seixal',lat:32.8190,lng:-17.1020,parish:'Seixal'},
      {name:'Ribeira da Janela',lat:32.8510,lng:-17.1550,parish:'Ribeira da Janela'},
      {name:'Achadas da Cruz',lat:32.8426,lng:-17.2109,parish:'Achadas da Cruz'}
    ];
    return groups.map(g=>({...g,items:businesses.filter(b=>b.parish===g.parish)})).filter(g=>g.items.length);
  },[businesses]);
  const markers=useMemo(()=>{
    const q=query.trim().toLowerCase();
    const points=category==='local'?[]:islandPoints.filter(p=>(category==='all'||p.category===category)&&(!q||(p.name+' '+p.description).toLowerCase().includes(q)));
    const locals=(category==='all'||category==='local')?localGroups.filter(g=>!q||(g.name+' '+g.items.map(x=>x.name).join(' ')).toLowerCase().includes(q)):[];
    return {points,locals};
  },[category,query,localGroups]);

  useEffect(()=>{
    let disposed=false;
    loadLeaflet().then(L=>{
      if(disposed||!mapNode.current||mapRef.current)return;
      const map=L.map(mapNode.current,{scrollWheelZoom:false,preferCanvas:true}).fitBounds([[32.60,-17.30],[33.12,-16.22]],{padding:[18,18],maxZoom:9});
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(map);
      layerRef.current=L.layerGroup().addTo(map);
      mapRef.current=map;
      setMapReady(true);
      requestAnimationFrame(()=>map.invalidateSize());
    }).catch(()=>{if(!disposed)setMapError(lang==='ru'?'Не удалось загрузить карту. Проверьте подключение к интернету.':'The map could not be loaded. Check your internet connection.');});
    return ()=>{disposed=true;if(mapRef.current){mapRef.current.remove();mapRef.current=null;layerRef.current=null;setMapReady(false);}};
  },[]);

  useEffect(()=>{
    const map=mapRef.current,L=window.L,layer=layerRef.current;
    if(!map||!L||!layer)return;
    layer.clearLayers();
    const palette={city:'#d6bd89',nature:'#78b99b',viewpoint:'#e7a66e',coast:'#67b8c4',transport:'#a6a8d6',local:'#f0d78e'};
    const addPin=(lat,lng,kind,html)=>{
      const icon=L.divIcon({className:'madeira-map-pin-wrap',html:'<span class="madeira-map-pin" style="--pin-color:'+palette[kind]+'"></span>',iconSize:[22,22],iconAnchor:[11,11]});
      L.marker([lat,lng],{icon}).bindPopup(html,{maxWidth:290}).addTo(layer);
    };
    markers.points.forEach(p=>{
      const html='<div class="madeira-popup"><b>'+escapeHtml(p.name)+'</b><p>'+escapeHtml(p.description)+'</p><a href="'+escapeHtml(p.url)+'" target="_blank" rel="noreferrer">'+(lang==='ru'?'Источник':lang==='pt'?'Fonte':'Source')+' ↗</a></div>';
      addPin(p.lat,p.lng,p.category,html);
    });
    markers.locals.forEach(g=>{
      const list=g.items.slice(0,10).map(x=>'<li>'+escapeHtml(x.name)+'</li>').join('');
      const html='<div class="madeira-popup"><b>'+escapeHtml(g.name)+' · '+g.items.length+'</b><p>'+(lang==='ru'?'Приблизительная зона прихода, не точка входа в конкретное заведение.':lang==='pt'?'Zona aproximada da freguesia, não a localização exata de cada estabelecimento.':'Approximate parish area, not the exact entrance of each business.')+'</p><ul>'+list+'</ul>'+(g.items.length>10?'<small>+'+(g.items.length-10)+' '+(lang==='ru'?'записей':'more')+'</small>':'')+'</div>';
      addPin(g.lat,g.lng,'local',html);
    });
  },[markers,lang,mapReady]);

  return <section className="island-map-shell">
    <div className="island-map-top">
      <div><span className="eyebrow">MADEIRA · ATLANTIC MAP</span><h2>{lang==='ru'?'Интерактивная карта острова':lang==='pt'?'Mapa interativo da ilha':'Interactive island map'}</h2><p>{lang==='ru'?'Города, природные места, смотровые площадки и локальный каталог.':lang==='pt'?'Localidades, natureza, miradouros e diretório local.':'Towns, nature, viewpoints and the local directory.'}</p></div>
      <div className="island-map-total"><b>{markers.points.length+markers.locals.length}</b><span>{lang==='ru'?'групп меток':'map groups'}</span></div>
    </div>
    <div className="island-map-tools">
      <div className="island-map-search"><Search size={15}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder={lang==='ru'?'Найти место или компанию…':lang==='pt'?'Pesquisar local ou empresa…':'Find a place or business…'}/></div>
      <div className="island-map-filters">{['all','city','nature','viewpoint','coast','transport','local'].map(k=><button key={k} className={category===k?'active':''} onClick={()=>setCategory(k)}>{labels[k]}</button>)}</div>
    </div>
    {mapError&&<div className="island-map-error">{mapError}</div>}
    <div className="island-map-canvas" ref={mapNode} role="application" aria-label="Interactive map of Madeira"></div>
    <div className="island-map-legend"><span><i style={{'--legend-color':'#d6bd89'}}/> {labels.city}</span><span><i style={{'--legend-color':'#78b99b'}}/> {labels.nature}</span><span><i style={{'--legend-color':'#e7a66e'}}/> {labels.viewpoint}</span><span><i style={{'--legend-color':'#67b8c4'}}/> {labels.coast}</span><span><i style={{'--legend-color':'#f0d78e'}}/> {labels.local}</span></div>
    <div className="island-map-foot"><span>{lang==='ru'?'Карта и базовые слои: OpenStreetMap. Точки интереса — справочные; часы, доступность и статус троп уточняйте у официальных источников.':lang==='pt'?'Mapa base: OpenStreetMap. Os pontos são informativos; confirme horários, acessos e estado dos trilhos nas fontes oficiais.':'Base map: OpenStreetMap. Pins are informational; verify opening times, access and trail status with official sources.'}</span><a href="https://www.openstreetmap.org/#map=10/32.75/-17.0" target="_blank" rel="noreferrer">{lang==='ru'?'Открыть в OSM':'Open in OSM'} <ExternalLink size={12}/></a></div>
  </section>;
}
