document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- Aplica os dados de SITE_CONFIG nos elementos da página ---------- */
function applyConfig(){
  document.getElementById('topPhone').textContent = SITE_CONFIG.telefoneExibicao;
  document.getElementById('topPhone').href = 'tel:+' + SITE_CONFIG.whatsapp;
  document.getElementById('topEmail').textContent = SITE_CONFIG.email;
  document.getElementById('topEmail').href = 'mailto:' + SITE_CONFIG.email;
  document.getElementById('topHours').textContent = SITE_CONFIG.horarios[0].dia + ' · ' + SITE_CONFIG.horarios[0].hora;

  document.getElementById('contactPhone').textContent = SITE_CONFIG.telefoneExibicao;
  document.getElementById('contactPhone').href = 'tel:+' + SITE_CONFIG.whatsapp;
  document.getElementById('contactEmail').textContent = SITE_CONFIG.email;
  document.getElementById('contactEmail').href = 'mailto:' + SITE_CONFIG.email;
  document.getElementById('contactAddress').textContent = SITE_CONFIG.endereco;

  document.getElementById('topInstagram').href = SITE_CONFIG.instagramUrl;
  document.getElementById('topInstagramLabel').textContent = SITE_CONFIG.instagram;
  document.getElementById('contactInstagram').href = SITE_CONFIG.instagramUrl;
  document.getElementById('contactInstagram').textContent = SITE_CONFIG.instagram;
  document.getElementById('footerInstagram').href = SITE_CONFIG.instagramUrl;
  document.getElementById('footerInstagramLabel').textContent = SITE_CONFIG.instagram;

  const hoursTable = document.getElementById('hoursTable');
  hoursTable.innerHTML = SITE_CONFIG.horarios.map(h => `<tr><td>${h.dia}</td><td>${h.hora}</td></tr>`).join('');

  document.getElementById('statAnos').textContent = SITE_CONFIG.anosDeMercado;

  // Botão flutuante do WhatsApp
  const floatMsg = encodeURIComponent('Olá! Vim pelo site da MP Veículos e gostaria de mais informações.');
  document.getElementById('whatsappFloat').href = `https://wa.me/${SITE_CONFIG.whatsapp}?text=${floatMsg}`;

  // Mapa incorporado com o endereço da loja
  const mapQuery = encodeURIComponent(SITE_CONFIG.endereco);
  document.getElementById('contactMap').src = `https://www.google.com/maps?q=${mapQuery}&output=embed`;
}
applyConfig();

/* ---------- Ilustrações usadas quando um veículo ainda não tem fotos cadastradas ---------- */
const silhouettes = {
  hatch: `<svg viewBox="0 0 240 100" xmlns="http://www.w3.org/2000/svg"><path d="M20 70 Q22 45 55 40 L75 24 Q92 16 115 16 L150 16 Q168 16 178 30 L196 42 Q220 46 220 65 L220 72 L204 72 Q202 84 190 84 Q178 84 176 72 L82 72 Q80 84 68 84 Q56 84 54 72 L20 72 Z" fill="none" stroke="#5b6068" stroke-width="3"/><circle cx="68" cy="76" r="12" fill="none" stroke="#0e0f11" stroke-width="3"/><circle cx="190" cy="76" r="12" fill="none" stroke="#0e0f11" stroke-width="3"/><line x1="92" y1="24" x2="90" y2="40" stroke="#5b6068" stroke-width="2"/><line x1="150" y1="18" x2="150" y2="40" stroke="#5b6068" stroke-width="2"/></svg>`,
  sedan: `<svg viewBox="0 0 260 100" xmlns="http://www.w3.org/2000/svg"><path d="M14 68 Q16 46 46 42 L68 24 Q84 16 105 16 L150 16 Q168 16 180 26 L200 42 Q236 44 240 62 L242 70 L226 70 Q224 84 212 84 Q200 84 198 70 L64 70 Q62 84 50 84 Q38 84 36 70 L14 70 Z" fill="none" stroke="#5b6068" stroke-width="3"/><circle cx="62" cy="76" r="12" fill="none" stroke="#0e0f11" stroke-width="3"/><circle cx="212" cy="76" r="12" fill="none" stroke="#0e0f11" stroke-width="3"/><line x1="106" y1="18" x2="104" y2="42" stroke="#5b6068" stroke-width="2"/><line x1="160" y1="20" x2="158" y2="42" stroke="#5b6068" stroke-width="2"/></svg>`,
  suv: `<svg viewBox="0 0 250 110" xmlns="http://www.w3.org/2000/svg"><path d="M16 74 Q16 48 50 44 L66 22 Q82 12 108 12 L156 12 Q174 12 186 24 L204 44 Q232 46 232 68 L232 76 L216 76 Q214 90 202 90 Q190 90 188 76 L64 76 Q62 90 50 90 Q38 90 36 76 L16 76 Z" fill="none" stroke="#5b6068" stroke-width="3"/><circle cx="62" cy="82" r="13" fill="none" stroke="#0e0f11" stroke-width="3"/><circle cx="202" cy="82" r="13" fill="none" stroke="#0e0f11" stroke-width="3"/><line x1="108" y1="14" x2="106" y2="44" stroke="#5b6068" stroke-width="2"/><line x1="158" y1="16" x2="156" y2="44" stroke="#5b6068" stroke-width="2"/></svg>`,
  picape: `<svg viewBox="0 0 260 100" xmlns="http://www.w3.org/2000/svg"><path d="M12 66 Q12 44 40 40 L58 22 Q72 14 96 14 L124 14 Q140 14 140 30 L140 42 L172 42 L172 30 L200 30 Q214 30 218 44 L236 52 Q246 54 246 64 L246 68 L228 68 Q226 82 214 82 Q202 82 200 68 L64 68 Q62 82 50 82 Q38 82 36 68 L12 68 Z" fill="none" stroke="#5b6068" stroke-width="3"/><circle cx="62" cy="74" r="12" fill="none" stroke="#0e0f11" stroke-width="3"/><circle cx="214" cy="74" r="12" fill="none" stroke="#0e0f11" stroke-width="3"/><line x1="96" y1="16" x2="94" y2="42" stroke="#5b6068" stroke-width="2"/></svg>`
};
const tipoLabel = {hatch:"Hatch", sedan:"Sedã", suv:"SUV", picape:"Picape"};

function formatPrice(v){
  return v.toLocaleString('pt-BR', {style:'currency', currency:'BRL', minimumFractionDigits:0});
}
function formatKm(v){
  return v.toLocaleString('pt-BR') + " km";
}

/* Retorna o HTML da miniatura: foto real se existir, senão a ilustração */
function mediaThumb(v){
  if(v.fotos && v.fotos.length){
    return `<img src="${v.fotos[0]}" alt="${v.marca} ${v.modelo}" loading="lazy">`;
  }
  return silhouettes[v.tipo];
}

function buildCard(v){
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <div class="card-media">
      <div class="tag">${v.ano} · #MP0${v.id}</div>
      ${mediaThumb(v)}
    </div>
    <div class="card-body">
      <div>
        <div class="card-title">${v.marca} ${v.modelo}</div>
        <div class="card-sub">${tipoLabel[v.tipo]} · ${v.cor}</div>
      </div>
      <div class="specs">
        <div><div class="v">${v.ano}</div><div class="k">Ano</div></div>
        <div><div class="v">${(v.km/1000).toFixed(0)}k</div><div class="k">Km</div></div>
        <div><div class="v">${v.cambio === 'Automático' ? 'Aut.' : 'Man.'}</div><div class="k">Câmbio</div></div>
        <div><div class="v">${v.combustivel}</div><div class="k">Combust.</div></div>
      </div>
      <div class="card-footer">
        <div class="price">${formatPrice(v.preco)}<small>à vista</small></div>
        <div class="card-cta" aria-hidden="true">→</div>
      </div>
    </div>
  `;
  card.addEventListener('click', () => openModal(v));
  return card;
}

function render(){
  const search = document.getElementById('fSearch').value.trim().toLowerCase();
  const tipo = document.getElementById('fTipo').value;
  const cambio = document.getElementById('fCambio').value;
  const ordem = document.getElementById('fOrdem').value;

  let list = VEHICLES.filter(v => {
    const text = (v.marca + " " + v.modelo).toLowerCase();
    const matchSearch = !search || text.includes(search);
    const matchTipo = !tipo || v.tipo === tipo;
    const matchCambio = !cambio || v.cambio === cambio;
    return matchSearch && matchTipo && matchCambio;
  });

  if(ordem === 'menor') list.sort((a,b)=>a.preco-b.preco);
  else if(ordem === 'maior') list.sort((a,b)=>b.preco-a.preco);
  else if(ordem === 'novo') list.sort((a,b)=>b.ano-a.ano);

  const grid = document.getElementById('grid');
  grid.innerHTML = '';
  if(list.length === 0){
    grid.innerHTML = '<div class="empty-msg">Nenhum veículo encontrado com esses filtros. Tente ajustar a busca.</div>';
  } else {
    list.forEach(v => grid.appendChild(buildCard(v)));
  }
  document.getElementById('resultCount').textContent = String(list.length).padStart(2,'0') + ' veículo' + (list.length===1?'':'s') + ' encontrado' + (list.length===1?'':'s');
}

['fSearch','fTipo','fCambio','fOrdem'].forEach(id => {
  document.getElementById(id).addEventListener('input', render);
  document.getElementById(id).addEventListener('change', render);
});
document.getElementById('fReset').addEventListener('click', () => {
  document.getElementById('fSearch').value = '';
  document.getElementById('fTipo').value = '';
  document.getElementById('fCambio').value = '';
  document.getElementById('fOrdem').value = 'relevancia';
  render();
});

document.getElementById('statTotal').textContent = String(VEHICLES.length).padStart(2,'0');

/* ---------- Modal de detalhes com navegação de fotos por botões ---------- */
const overlay = document.getElementById('modalOverlay');
let currentVehicle = null;
let currentPhotoIndex = 0;

// ===== SETAR IMAGEM E ATUALIZAR NAVEGAÇÃO =====
function setModalImage(v, index) {
  currentPhotoIndex = index;
  const media = document.getElementById('modalMedia');
  // Remove imagem ou svg anterior (mantém os botões e contador)
  media.querySelectorAll('img.modal-main-img, svg').forEach(el => el.remove());

  const hasPhotos = v.fotos && v.fotos.length;
  if (hasPhotos) {
    const img = document.createElement('img');
    img.className = 'modal-main-img';
    img.src = v.fotos[index];
    img.alt = `${v.marca} ${v.modelo} - foto ${index+1}`;
    media.prepend(img); // coloca no início para ficar atrás dos elementos absolutos
  } else {
    // Se não tem foto, insere a silhueta
    media.insertAdjacentHTML('afterbegin', silhouettes[v.tipo]);
  }

  // Atualiza contador e visibilidade das setas
  const nav = document.getElementById('modalNav');
  const counter = document.getElementById('modalPhotoCount');
  if (hasPhotos && v.fotos.length > 1) {
    nav.classList.remove('hidden');
    counter.style.display = 'block';
    counter.textContent = `${index+1} / ${v.fotos.length}`;
  } else {
    nav.classList.add('hidden');
    counter.style.display = 'none';
  }
}

function showNextPhoto(){
  if(!currentVehicle || !currentVehicle.fotos || currentVehicle.fotos.length < 2) return;
  const next = (currentPhotoIndex + 1) % currentVehicle.fotos.length;
  setModalImage(currentVehicle, next);
}
function showPrevPhoto(){
  if(!currentVehicle || !currentVehicle.fotos || currentVehicle.fotos.length < 2) return;
  const prev = (currentPhotoIndex - 1 + currentVehicle.fotos.length) % currentVehicle.fotos.length;
  setModalImage(currentVehicle, prev);
}

// ===== MODAL – ABRIR =====
function openModal(v) {
  currentVehicle = v;
  const media = document.getElementById('modalMedia');
  media.innerHTML = `
    <button class="modal-close" id="modalClose" aria-label="Fechar">✕</button>
    <div class="modal-photo-count" id="modalPhotoCount"></div>
    <div class="modal-nav-bottom" id="modalNav">
      <button id="modalPrev" aria-label="Foto anterior">‹</button>
      <button id="modalNext" aria-label="Próxima foto">›</button>
    </div>
  `;
  // Adiciona a primeira foto (ou ilustração) e configura contador/navegação
  setModalImage(v, 0);

  // Eventos dos botões
  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('modalPrev').addEventListener('click', showPrevPhoto);
  document.getElementById('modalNext').addEventListener('click', showNextPhoto);

  // Preenche os detalhes do veículo
  document.getElementById('modalTitle').textContent = `${v.marca} ${v.modelo}`;
  document.getElementById('modalSub').textContent = `${tipoLabel[v.tipo]} · ${v.cor} · Estoque #MP0${v.id}`;
  document.getElementById('modalSpecs').innerHTML = `
    <div><div class="v">${v.ano}</div><div class="k">Ano</div></div>
    <div><div class="v">${formatKm(v.km)}</div><div class="k">Km</div></div>
    <div><div class="v">${v.cambio}</div><div class="k">Câmbio</div></div>
    <div><div class="v">${v.combustivel}</div><div class="k">Combustível</div></div>
  `;
  document.getElementById('modalDesc').textContent = v.desc;
  document.getElementById('modalPrice').innerHTML = formatPrice(v.preco) + '<small>à vista</small>';
  const msg = encodeURIComponent(`Olá! Tenho interesse no ${v.marca} ${v.modelo} ${v.ano} (estoque #MP0${v.id}) anunciado no site.`);
  document.getElementById('modalWhats').href = `https://wa.me/${SITE_CONFIG.whatsapp}?text=${msg}`;
  overlay.classList.add('open');
}

function closeModal(){ overlay.classList.remove('open'); currentVehicle = null; }
overlay.addEventListener('click', (e) => { if(e.target === overlay) closeModal(); });
document.addEventListener('keydown', (e) => {
  if(!overlay.classList.contains('open')) return;
  if(e.key === 'Escape') closeModal();
  if(e.key === 'ArrowRight') showNextPhoto();
  if(e.key === 'ArrowLeft') showPrevPhoto();
});

/* ---------- Formulário de contato -> WhatsApp ---------- */
document.getElementById('sendWhats').addEventListener('click', () => {
  const nome = document.getElementById('cNome').value.trim();
  const tel = document.getElementById('cTelefone').value.trim();
  const interesse = document.getElementById('cInteresse').value.trim();
  const mensagem = document.getElementById('cMensagem').value.trim();
  let text = `Olá! Meu nome é ${nome || '[nome]'}.`;
  if(interesse) text += ` Tenho interesse no veículo: ${interesse}.`;
  if(mensagem) text += ` Mensagem: ${mensagem}`;
  if(tel) text += ` (Telefone para contato: ${tel})`;
  window.open(`https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent(text)}`, '_blank');
});

/* ---------- Menu mobile ---------- */
const nav = document.getElementById('nav');
document.getElementById('menuToggle').addEventListener('click', () => nav.classList.toggle('open'));
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));

// ========== HERO SLIDER AUTOMÁTICO ==========
const heroImages = [
  'assets/js/clientes/cliente1.jpg',
  'assets/js/clientes/cliente2.jpg',
  'assets/js/clientes/cliente3.jpg'
];

let currentSlide = 0;
const track = document.getElementById('heroSliderTrack');
const dotsContainer = document.getElementById('heroSliderDots');

function buildDots() {
  dotsContainer.innerHTML = '';
  heroImages.forEach((_, i) => {
    const dot = document.createElement('span');
    dot.className = `dot ${i === 0 ? 'active' : ''}`;
    dot.dataset.index = i;
    dotsContainer.appendChild(dot);
  });
}

function goToSlide(index) {
  if (index < 0) index = heroImages.length - 1;
  if (index >= heroImages.length) index = 0;
  currentSlide = index;
  track.style.transform = `translateX(-${currentSlide * 100}%)`;
  document.querySelectorAll('.dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === currentSlide);
  });
}

function startHeroSlider() {
  if (heroImages.length === 0) return;
  buildDots();
  // Insere as imagens no track (já estão no HTML, mas garantimos)
  // Apenas inicia o intervalo
  setInterval(() => {
    goToSlide(currentSlide + 1);
  }, 4000);
}

startHeroSlider();

render();