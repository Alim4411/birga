/* BIRGA demo data and client-side booking flow. */
(function(){
const KEY='birga_demo_v1';
const seed={
 providers:[
 {id:'p1',name:'Амина',category:'Красота и уход',city:'Назрань',address:'Центр, Назрань',description:'Маникюр и бережный уход. Работа по предварительной записи.',phone:'+7 900 111-22-33',rating:4.9,reviews:18,services:[{id:'s11',title:'Маникюр',price:1200},{id:'s12',title:'Покрытие гель-лак',price:1700}],slots:['2026-11-25T15:30','2026-11-26T11:00','2026-11-27T14:00'],approved:true},
 {id:'p2',name:'Мурад',category:'Репетиторство и обучение',city:'Магас',address:'Центр, Магас',description:'Индивидуальные занятия по математике для школьников.',phone:'+7 900 222-33-44',rating:4.8,reviews:12,services:[{id:'s21',title:'Математика, 60 минут',price:900},{id:'s22',title:'Подготовка к контрольной',price:1100}],slots:['2026-11-25T16:00','2026-11-26T17:00','2026-11-28T12:00'],approved:true},
 {id:'p3',name:'Ислам',category:'Бытовые услуги и ремонт',city:'Назрань',address:'Центральный район, Назрань',description:'Диагностика и ремонт смартфонов и бытовой электроники.',phone:'+7 900 333-44-55',rating:4.7,reviews:9,services:[{id:'s31',title:'Диагностика телефона',price:500},{id:'s32',title:'Настройка смартфона',price:700}],slots:['2026-11-25T13:00','2026-11-27T10:30'],approved:true},
 {id:'p4',name:'Мадина',category:'Красота и уход',city:'Магас',address:'Магас, жилой район',description:'Оформление бровей и уходовые процедуры.',phone:'+7 900 444-55-66',rating:4.9,reviews:21,services:[{id:'s41',title:'Коррекция бровей',price:700},{id:'s42',title:'Окрашивание бровей',price:900}],slots:['2026-11-25T12:00','2026-11-26T15:00'],approved:true},
 {id:'p5',name:'Зарема',category:'Репетиторство и обучение',city:'Назрань',address:'Онлайн / Назрань',description:'Помощь с английским языком и школьной программой.',phone:'+7 900 555-66-77',rating:4.6,reviews:7,services:[{id:'s51',title:'Английский, 60 минут',price:1000}],slots:['2026-11-26T16:30','2026-11-28T11:00'],approved:true},
 {id:'p6',name:'Руслан',category:'Бытовые услуги и ремонт',city:'Магас',address:'Выезд по Магасу',description:'Мелкий бытовой ремонт и сборка мебели.',phone:'+7 900 666-77-88',rating:4.8,reviews:14,services:[{id:'s61',title:'Сборка мебели',price:1500},{id:'s62',title:'Мелкий ремонт',price:1000}],slots:['2026-11-25T17:00','2026-11-27T12:30'],approved:true}
 ],
 bookings:[],reviews:[]
};
function load(){try{const d=JSON.parse(localStorage.getItem(KEY));if(d&&d.providers)return d;}catch(e){}save(seed);return structuredClone(seed)}
function save(d){localStorage.setItem(KEY,JSON.stringify(d))}
let db=load();
const $=id=>document.getElementById(id);
function toast(msg){const t=$('toast');if(!t)return;t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2600)}
function money(n){return new Intl.NumberFormat('ru-RU').format(n)+' ₽'}
function dateLabel(v){const d=new Date(v);return d.toLocaleDateString('ru-RU',{day:'numeric',month:'short'})+' · '+d.toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit'})}
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function minPrice(p){return Math.min(...p.services.map(s=>s.price))}
function initials(n){return n.split(/\s+/).map(x=>x[0]).slice(0,2).join('').toUpperCase()}
function renderCatalog(){
 const grid=$('providerGrid');if(!grid)return;
 const q=$('searchInput').value.toLowerCase().trim(),cat=$('categoryFilter').value,city=$('cityFilter').value,sort=$('sortFilter').value;
 let arr=db.providers.filter(p=>p.approved&&(!cat||p.category===cat)&&(!city||p.city===city)&&(!q||[p.name,p.category,p.city,p.description,...p.services.map(s=>s.title)].join(' ').toLowerCase().includes(q)));
 if(sort==='price')arr.sort((a,b)=>minPrice(a)-minPrice(b));if(sort==='rating')arr.sort((a,b)=>b.rating-a.rating);
 $('resultCount').textContent=arr.length+' специалистов';
 grid.innerHTML=arr.map((p,i)=>`<article class="provider-card"><div class="provider-top"><div class="provider-avatar ${i%3===1?'orange':i%3===2?'blue':''}">${esc(initials(p.name))}</div><div class="rating">★ ${Number(p.rating).toFixed(1)} <span class="provider-meta">(${p.reviews||0})</span></div></div><h3>${esc(p.name)}</h3><div class="provider-meta">${esc(p.category)} · ${esc(p.city)}</div><p class="provider-desc">${esc(p.description)}</p><div class="provider-tags"><span class="tag">${esc(p.services.length)} услуги</span><span class="tag">${esc(p.address)}</span><span class="tag">${p.slots.filter(s=>new Date(s)>new Date()).length} свободных слота</span></div><div class="provider-bottom"><div class="price">от ${money(minPrice(p))}<small> / услуга</small></div><button class="book-button" data-book="${p.id}">Выбрать время ↗</button></div></article>`).join('');
 $('emptyState').classList.toggle('hidden',arr.length>0);
 grid.querySelectorAll('[data-book]').forEach(b=>b.addEventListener('click',()=>openBooking(b.dataset.book)));
}
function openBooking(id){
 const p=db.providers.find(x=>x.id===id);if(!p)return;
 $('bookingProvider').textContent=p.name+' · '+p.city+' · '+p.category;
 $('bookingService').innerHTML=p.services.map(s=>`<option value="${s.id}">${esc(s.title)} — ${money(s.price)}</option>`).join('');
 const slots=p.slots.filter(s=>new Date(s)>new Date()).sort();
 $('bookingSlot').innerHTML=slots.length?slots.map(s=>`<option value="${s}">${dateLabel(s)}</option>`).join(''):'<option value="">Нет свободных слотов</option>';
 $('bookingForm').dataset.provider=id;$('bookingModal').classList.remove('hidden');
}
function closeBooking(){$('bookingModal').classList.add('hidden')}
function submitBooking(e){
 e.preventDefault();const f=new FormData(e.target),id=e.target.dataset.provider,p=db.providers.find(x=>x.id===id),slot=f.get('slot');
 if(!p||!slot||!p.slots.includes(slot)){toast('Этот слот уже недоступен. Обновите страницу.');return}
 const service=p.services.find(s=>s.id===f.get('service'));
 db.bookings.push({id:'b'+Date.now(),providerId:id,provider:p.name,client:f.get('client'),phone:f.get('phone'),service:service.title,price:service.price,slot,status:'Подтверждена',created:new Date().toISOString()});
 p.slots=p.slots.filter(s=>s!==slot);save(db);closeBooking();e.target.reset();renderCatalog();toast('Запись подтверждена! Визит: '+dateLabel(slot));
}
function bindCatalog(){
 if(!$('providerGrid'))return;
 ['searchInput','categoryFilter','cityFilter','sortFilter'].forEach(id=>$(id).addEventListener(id==='searchInput'?'input':'change',renderCatalog));
 $('categoryPills').addEventListener('click',e=>{const b=e.target.closest('[data-category]');if(!b)return;$('categoryFilter').value=b.dataset.category;$('categoryPills').querySelectorAll('.pill').forEach(x=>x.classList.toggle('active',x===b));renderCatalog()});
 $('resetFilters').addEventListener('click',()=>{$('searchInput').value='';$('categoryFilter').value='';$('cityFilter').value='';$('sortFilter').value='recommended';$('categoryPills').querySelectorAll('.pill').forEach((x,i)=>x.classList.toggle('active',i===0));renderCatalog()});
 $('closeBooking').addEventListener('click',closeBooking);$('bookingModal').addEventListener('click',e=>{if(e.target===$('bookingModal'))closeBooking()});$('bookingForm').addEventListener('submit',submitBooking);
}
window.BIRGA={get db(){return db},save(){save(db)},toast,esc,money,dateLabel,initials,renderCatalog,refresh(){db=load();return db},reload(){db=load()}};
bindCatalog();renderCatalog();
})();