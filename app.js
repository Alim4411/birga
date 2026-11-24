const providers = [
 {id:1,name:"Мадина Алиева",role:"Мастер маникюра",category:"Красота и уход",city:"Назрань",address:"ул. Московская, 12",rating:4.9,reviews:38,price:1200,services:["Маникюр","Покрытие гель-лак","Уход"],symbol:"✦",cover:1,slots:["10:00","11:30","14:30","16:00"],about:"Аккуратный маникюр и бережный уход. Работа по предварительной записи."},
 {id:2,name:"Адам Евлоев",role:"Барбер",category:"Красота и уход",city:"Магас",address:"пр-т Идриса Зязикова, 5",rating:4.8,reviews:24,price:900,services:["Мужская стрижка","Оформление бороды"],symbol:"✂",cover:2,slots:["09:30","12:00","15:00","17:30"],about:"Мужские стрижки и оформление бороды. Подберём удобное время."},
 {id:3,name:"Зарема Оздо��ва",role:"Бровист",category:"Красота и уход",city:"Назрань",address:"ул. Сулейменова, 8",rating:5.0,reviews:19,price:1000,services:["Коррекция бровей","Окрашивание"],symbol:"✧",cover:3,slots:["10:30","13:00","15:30"],about:"Коррекция и окрашивание бровей. Индивидуальный подход."},
 {id:4,name:"Хава Барахоева",role:"Репетитор по математике",category:"Обучение",city:"Магас",address:"Онлайн / Магас",rating:4.9,reviews:31,price:1500,services:["Математика","Подготовка к ОГЭ"],symbol:"π",cover:4,slots:["09:00","12:30","16:00","18:00"],about:"Занятия для школьников. Объяснение тем и подготовка к контрольным."},
 {id:5,name:"Муса Костоев",role:"Репетитор английского",category:"Обучение",city:"Назрань",address:"Онлайн / Назрань",rating:4.7,reviews:17,price:1300,services:["Английский язык","Разговорная практика"],symbol:"A",cover:5,slots:["10:00","13:30","16:30"],about:"Английский для школьников и начинающих. Занятия онлайн или очно."},
 {id:6,name:"Ислам Точиев",role:"Мастер по ремонту телефонов",category:"Бытовые услуги и ремонт",city:"Назрань",address:"ул. Базоркина, 21",rating:4.8,reviews:42,price:700,services:["Диагностика","Замена дисплея","Ремонт"],symbol:"⌁",cover:6,slots:["10:00","12:00","14:00","17:00"],about:"Диагностика и ремонт смартфонов. Стоимость сложных работ уточняется после осмотра."},
 {id:7,name:"Лейла Мержоева",role:"Мастер по ресницам",category:"Красота и уход",city:"Магас",address:"ул. Борова, 3",rating:4.9,reviews:26,price:1800,services:["Ламинирование","Наращивание"],symbol:"❋",cover:7,slots:["11:00","13:30","16:00"],about:"Услуги по уходу за ресницами. Запись на удобное время."},
 {id:8,name:"Тимур Гагиев",role:"Мастер по ремонту техники",category:"Бытовые услуги и ремонт",city:"Карабулак",address:"ул. Осканова, 14",rating:4.7,reviews:15,price:1000,services:["Ремонт бытовой техники","Диагностика"],symbol:"⚙",cover:8,slots:["09:30","12:30","15:30"],about:"Диагностика и ремонт бытовой техники. Выезд обсуждается при подтверждении."},
 {id:9,name:"Амина Цоро��ва",role:"Парикмахер",category:"Красота и уход",city:"Назрань",address:"ул. Чеченская, 7",rating:4.8,reviews:33,price:1500,services:["Стрижка","Укладка","Окрашивание"],symbol:"〰",cover:9,slots:["10:00","12:00","15:00","17:00"],about:"Женские стрижки и укладки. Цены на окрашивание зависят от услуги."},
 {id:10,name:"Башир Хамхоев",role:"Мастер по электрике",category:"Бытовые услуги и ремонт",city:"Магас",address:"Выезд по городу",rating:4.9,reviews:12,price:800,services:["Мелкий ремонт","Электромонтаж"],symbol:"⌁",cover:10,slots:["09:00","11:00","14:00","16:00"],about:"Бытовые электромонтажные работы и мелкий ремонт. Детали согласуются заранее."}
];
// Replace any accidental encoding substitutions in demo names.
providers[2].name="Зарема Оздоевa"; providers[8].name="Амина Цороева";
let bookings = JSON.parse(localStorage.getItem("birgaBookings") || "[]");
let selectedSlot = null, activeProvider = null, cabinetTab = "overview";
const $ = s => document.querySelector(s);
const money = n => new Intl.NumberFormat("ru-RU").format(n)+" ₽";
function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>t.classList.remove("show"),2600)}
function filtered(){
 const q=$("#searchInput").value.trim().toLowerCase(), city=$("#cityFilter").value, cat=$("#categoryFilter").value, max=Number($("#priceFilter").value), sort=$("#sortFilter").value;
 let list=providers.filter(p=>(!q||(p.name+" "+p.role+" "+p.services.join(" ")).toLowerCase().includes(q))&&(city==="Все города"||p.city===city)&&(cat==="Все категории"||p.category===cat)&&p.price<=max);
 if(sort==="rating")list.sort((a,b)=>b.rating-a.rating); if(sort==="price")list.sort((a,b)=>a.price-b.price);
 return list;
}
function render(){
 const list=filtered();$("#resultCount").textContent=list.length+" специалистов";$("#emptyState").classList.toggle("hidden",list.length>0);
 $("#providerGrid").innerHTML=list.map(p=>`<article class="provider-card">
 <div class="provider-cover cover-${p.cover}"><span class="cover-badge">${p.category}</span><button class="cover-fav" aria-label="В избранное" onclick="toast('Добавлено в избранное в демо-режиме')">♡</button><span class="cover-symbol">${p.symbol}</span></div>
 <div class="provider-body"><div class="provider-top"><div><div class="provider-name">${p.name}</div><div class="provider-sub">${p.role}</div></div><span class="provider-rating">★ ${p.rating.toFixed(1)}</span></div>
 <div class="provider-location">⌖ ${p.city} · ${p.address}</div><div class="service-tags">${p.services.slice(0,3).map(s=>`<span>${s}</span>`).join("")}</div>
 <div class="provider-bottom"><div class="provider-price"><small>УСЛУГИ ОТ</small><b>${money(p.price)}</b></div><button class="card-open" onclick="openProfile(${p.id})">Профиль ↗</button></div></div></article>`).join("");
}
function setCategory(cat){$("#categoryFilter").value=cat;document.querySelectorAll(".cat-chip").forEach(b=>b.classList.toggle("active",b.dataset.cat===cat));render()}
function setCity(city){$("#cityFilter").value=city;document.querySelectorAll(".filter-pill").forEach(b=>b.classList.toggle("selected",b.dataset.city===city));render()}
function openModal(html){$("#modalContent").innerHTML=html;$("#modalBackdrop").classList.remove("hidden");document.body.style.overflow="hidden"}
function closeModal(){$("#modalBackdrop").classList.add("hidden");document.body.style.overflow="";selectedSlot=null}
function openProfile(id){
 const p=providers.find(x=>x.id===id);activeProvider=p;
 const today=new Date();const date=today.toLocaleDateString("ru-RU",{day:"numeric",month:"long"});
 openModal(`<span class="modal-kicker">ПРОФИЛЬ СПЕЦИАЛИСТА</span><div class="profile-modal-head"><div class="profile-avatar">${p.symbol}</div><div><h2 id="modalTitle">${p.name}</h2><p>${p.role} · ${p.city}</p><span class="modal-rating">★ ${p.rating.toFixed(1)} · ${p.reviews} отзывов</span></div></div><p>${p.about}</p><div class="modal-section"><h3>Услуги и стоимость</h3>${p.services.map((s,i)=>`<div class="service-row"><span>${s}</span><b>${money(p.price+(i*300))}</b></div>`).join("")}</div><div class="modal-section"><h3>Адрес</h3><p>⌖ ${p.address}, ${p.city}</p></div><div class="modal-section"><h3>Выберите свободное время · ${date}</h3><div class="slot-grid">${p.slots.map(s=>`<button class="slot" data-slot="${s}" onclick="chooseSlot(this)">${s}</button>`).join("")}</div></div><label class="field"><span>Ваше имя</span><input id="clientName" placeholder="Как к вам обращаться"></label><label class="field"><span>Телефон для связи</span><input id="clientPhone" placeholder="+7 ___ ___-__-__" inputmode="tel"></label><button class="btn btn-dark modal-action" onclick="confirmBooking()">Подтвердить запись ↗</button><p>Оплата производится специалисту на месте. Онлайн-оплата может появиться после пилотного запуска.</p>`);
}
function chooseSlot(btn){document.querySelectorAll(".slot").forEach(x=>x.classList.remove("selected"));btn.classList.add("selected");selectedSlot=btn.dataset.slot}
function confirmBooking(){
 const name=$("#clientName").value.trim(),phone=$("#clientPhone").value.trim();
 if(!selectedSlot){toast("Сначала выберите свободное время");return}
 if(!name||!phone){toast("Заполните имя и телефон");return}
 const booking={id:Date.now(),provider:activeProvider.name,providerId:activeProvider.id,client:name,phone,city:activeProvider.city,slot:selectedSlot,date:new Date().toLocaleDateString("ru-RU"),price:activeProvider.price,status:"Подтверждена"};
 bookings.push(booking);localStorage.setItem("birgaBookings",JSON.stringify(bookings));
 openModal(`<div class="success-panel"><div class="success-icon">✓</div><span class="modal-kicker">ЗАПИСЬ ПОДТВЕРЖДЕНА</span><h2 id="modalTitle">Вы записаны!</h2><p>Данные о записи сохранены в этом браузере.</p><div class="booking-summary"><b>${booking.provider}</b><br>${booking.date} · ${booking.slot}<br>${booking.city}<br>Клиент: ${booking.client}<br>Стоимость от: ${money(booking.price)}<br>Оплата: специалисту на месте</div><p>В реальном сервисе напоминание будет отправлено перед визитом. Здесь запись доступна в кабинете демо-специалиста.</p><button class="btn btn-dark modal-action" onclick="closeModal();openCabinet()">Открыть кабинет ↗</button></div>`);
}
function openCabinet(){
 cabinetTab="overview";renderCabinet();
}
function renderCabinet(){
 const myBookings=bookings.filter(b=>b.providerId===1);
 const content=cabinetTab==="overview"?`<span class="modal-kicker">КАБИНЕТ СПЕЦИАЛИСТА · ДЕМО</span><h2 id="modalTitle">Здравствуйте, Мадина</h2><p>Управляйте профилем, расписанием и записями в одном месте.</p><div class="stat-grid"><div class="stat"><small>ЗАПИСИ</small><b>${myBookings.length}</b></div><div class="stat"><small>РЕЙТИНГ</small><b>4.9 ★</b></div><div class="stat"><small>УСЛУГИ</small><b>3</b></div></div><div class="modal-section"><h3>Ближайшие записи</h3>${myBookings.length?myBookings.map(b=>`<div class="booking-item"><span><b>${b.client}</b><small>${b.date} · ${b.slot} · ${b.phone}</small></span><span class="status">${b.status}</span></div>`).join(""):'<p>Пока нет записей. Попробуйте записаться к Мадине через каталог.</p>'}</div>`:
 cabinetTab==="profile"?`<span class="modal-kicker">НАСТРОЙКИ ПРОФИЛЯ</span><h2 id="modalTitle">Мой профиль</h2><label class="field"><span>Имя специалиста</span><input value="Мадина Алиева" id="editName"></label><label class="field"><span>Специализация</span><input value="Мастер маникюра"></label><label class="field"><span>Город</span><select><option>Назрань</option><option>Магас</option></select></label><label class="field"><span>Описание</span><textarea>Аккуратный маникюр и бережный уход. Работа по предварительной записи.</textarea></label><button class="btn btn-dark modal-action" onclick="toast('Изменения профиля сохранены в демо-режиме')">Сохранить изменения</button>`:
 `<span class="modal-kicker">РАСПИСАНИЕ</span><h2 id="modalTitle">Мои свободные слоты</h2><p>Отметьте время, которое доступно для записи. Это демонстрационное расписание.</p><div class="slot-grid">${["09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00"].map(s=>`<button class="slot ${providers[0].slots.includes(s)?"selected":""}" onclick="this.classList.toggle('selected')">${s}</button>`).join("")}</div><button class="btn btn-dark modal-action" onclick="toast('Расписание сохранено в демо-режиме')">Сохранить расписание</button>`;
 openModal(`<div class="cabinet-tabs"><button class="cabinet-tab ${cabinetTab==="overview"?"active":""}" onclick="cabinetTab='overview';renderCabinet()">Обзор</button><button class="cabinet-tab ${cabinetTab==="profile"?"active":""}" onclick="cabinetTab='profile';renderCabinet()">Профиль</button><button class="cabinet-tab ${cabinetTab==="schedule"?"active":""}" onclick="cabinetTab='schedule';renderCabinet()">Расписание</button></div>${content}<p style="margin-top:18px">Для демонстрации используется тестовый профиль. Реальные аккаунты и серверная синхронизация не подключены.</p>`);
}
$("#modalClose").addEventListener("click",closeModal);$("#modalBackdrop").addEventListener("click",e=>{if(e.target.id==="modalBackdrop")closeModal()});
$("#searchButton").addEventListener("click",()=>{render();$("#catalog").scrollIntoView({behavior:"smooth"})});
$("#searchInput").addEventListener("input",render);$("#cityFilter").addEventListener("change",()=>{setCity($("#cityFilter").value)});$("#categoryFilter").addEventListener("change",()=>setCategory($("#categoryFilter").value));$("#priceFilter").addEventListener("change",render);$("#sortFilter").addEventListener("change",render);
document.querySelectorAll(".cat-chip").forEach(b=>b.addEventListener("click",()=>setCategory(b.dataset.cat)));
document.querySelectorAll(".filter-pill").forEach(b=>b.addEventListener("click",()=>setCity(b.dataset.city)));
$("#resetFilters").addEventListener("click",()=>{$("#searchInput").value="";$("#priceFilter").value="999999";$("#sortFilter").value="recommended";setCity("Все города");setCategory("Все категории")});
function goSearch(){$("#searchArea").scrollIntoView({behavior:"smooth"});setTimeout(()=>$("#searchInput").focus(),450)}
$("#heroFind").addEventListener("click",goSearch);$("#topFind").addEventListener("click",goSearch);$("#openCabinet").addEventListener("click",openCabinet);$("#bannerCabinet").addEventListener("click",openCabinet);$("#heroBook").addEventListener("click",()=>openProfile(1));
$("#menuToggle").addEventListener("click",()=>{const nav=$(".nav");nav.style.display=nav.style.display==="flex"?"none":"flex";nav.style.position="absolute";nav.style.top="65px";nav.style.left="0";nav.style.right="0";nav.style.padding="20px";nav.style.background="#fff";nav.style.flexDirection="column"});
render();
