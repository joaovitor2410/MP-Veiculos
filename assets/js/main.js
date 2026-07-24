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
    // capaFoco permite ajustar o enquadramento vertical da foto de capa
    // (útil quando o corte automático de proporção esconde parte do carro)
    const pos = v.capaFoco ? ` style="object-position:center ${v.capaFoco};"` : '';
    return `<img src="${v.fotos[0]}" alt="${v.marca} ${v.modelo}" loading="lazy"${pos}>`;
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
  // Remove imagem, svg ou dica anterior (mantém os botões e contador)
  media.querySelectorAll('img.modal-main-img, svg, .modal-zoom-hint').forEach(el => el.remove());

  const hasPhotos = v.fotos && v.fotos.length;
  if (hasPhotos) {
    const img = document.createElement('img');
    img.className = 'modal-main-img';
    img.src = v.fotos[index];
    img.alt = `${v.marca} ${v.modelo} - foto ${index+1}`;
    img.addEventListener('click', () => openLightbox(index));
    media.prepend(img); // coloca no início para ficar atrás dos elementos absolutos

    // Dica visual de que a foto pode ser ampliada
    const hint = document.createElement('div');
    hint.className = 'modal-zoom-hint';
    hint.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg> Ampliar`;
    media.appendChild(hint);
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
  const checkIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`;
  const highlightsBox = document.getElementById('modalHighlights');
  if (v.destaques && v.destaques.length) {
    highlightsBox.innerHTML = `
      <h4>Destaques deste veículo</h4>
      <div class="highlights-grid">
        ${v.destaques.map(d => `<div class="highlight-chip">${checkIcon}<span>${d}</span></div>`).join('')}
      </div>
    `;
  } else {
    highlightsBox.innerHTML = '';
  }
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

/* ---------- SIMULADOR DE FINANCIAMENTO ---------- */
const TAXA_MENSAL_SIMULACAO = 0.0199; // taxa referencial ilustrativa (1,99% a.m.)

function parseCurrency(str){
  if(!str) return 0;
  const digits = str.replace(/\D/g, '');
  return digits ? parseInt(digits, 10) : 0;
}

function formatWholeBRL(num){
  return 'R$ ' + Math.round(num).toLocaleString('pt-BR');
}

/* Formata o campo enquanto o usuário digita, tratando os dígitos como
   reais (não centavos) e mantendo o cursor sempre no final — isso evita
   o valor "embaralhar" e permite apagar tudo (ou digitar 0) sem travar. */
function maskCurrencyInput(el){
  el.addEventListener('input', () => {
    const digits = el.value.replace(/\D/g, '');
    if(!digits){ el.value = ''; return; }
    const num = parseInt(digits, 10);
    el.value = formatWholeBRL(num);
    el.setSelectionRange(el.value.length, el.value.length);
  });
}

const simVeiculoSelect = document.getElementById('simVeiculo');
const simValorInput = document.getElementById('simValor');
const simEntradaInput = document.getElementById('simEntrada');
const simParcelasSelect = document.getElementById('simParcelas');
const simResultBox = document.getElementById('simResult');

if(simVeiculoSelect){
  VEHICLES.forEach(v => {
    const opt = document.createElement('option');
    opt.value = v.id;
    opt.textContent = `${v.marca} ${v.modelo} — ${formatPrice(v.preco)}`;
    simVeiculoSelect.appendChild(opt);
  });

  simVeiculoSelect.addEventListener('change', () => {
    if(!simVeiculoSelect.value){ return; }
    const v = VEHICLES.find(x => String(x.id) === simVeiculoSelect.value);
    if(v){ simValorInput.value = formatWholeBRL(v.preco); }
  });

  maskCurrencyInput(simValorInput);
  maskCurrencyInput(simEntradaInput);

  document.getElementById('simCalcular').addEventListener('click', () => {
    const precoVeiculo = parseCurrency(simValorInput.value);
    const entrada = parseCurrency(simEntradaInput.value);
    const parcelas = parseInt(simParcelasSelect.value, 10);

    if(!precoVeiculo || precoVeiculo <= 0){
      simResultBox.innerHTML = '<div class="sim-placeholder">Informe o valor do veículo (ou escolha um do estoque) para calcular.</div>';
      return;
    }
    if(entrada >= precoVeiculo){
      simResultBox.innerHTML = '<div class="sim-placeholder">A entrada informada já cobre o valor total do veículo — sem necessidade de financiar! Fale com a gente para fechar à vista.</div>';
      return;
    }

    const financiado = precoVeiculo - entrada;
    const pmt = financiado * TAXA_MENSAL_SIMULACAO / (1 - Math.pow(1 + TAXA_MENSAL_SIMULACAO, -parcelas));
    const totalPrazo = pmt * parcelas;

    simResultBox.innerHTML = `
      <div class="sim-result-card">
        <div class="sim-row"><span>Valor financiado</span><strong>${formatPrice(financiado)}</strong></div>
        <div class="sim-row highlight"><span>Parcela estimada</span><strong>${parcelas}x de ${formatPrice(pmt)}</strong></div>
        <div class="sim-row"><span>Total a prazo</span><strong>${formatPrice(totalPrazo)}</strong></div>
        <a class="btn btn-primary sim-cta" id="simWhats" target="_blank" rel="noopener">Falar com um vendedor sobre esse plano</a>
      </div>
    `;

    const msg = encodeURIComponent(
      `Olá! Simulei um financiamento no site: veículo de ${formatPrice(precoVeiculo)}, entrada de ${formatPrice(entrada)}, em ${parcelas}x de aproximadamente ${formatPrice(pmt)}. Gostaria de saber as condições reais.`
    );
    document.getElementById('simWhats').href = `https://wa.me/${SITE_CONFIG.whatsapp}?text=${msg}`;
  });
}

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

const HERO_INTERVAL = 6500; // tempo (ms) entre cada troca automática de foto
let currentSlide = 0;
let heroTimer = null;
const track = document.getElementById('heroSliderTrack');
const dotsContainer = document.getElementById('heroSliderDots');

/* Cada slide é montado com 2 camadas: um fundo desfocado que preenche
   todo o banner + a foto inteira por cima, sem cortar (funciona bem
   tanto para fotos na vertical quanto na horizontal). */
function buildHeroSlides() {
  track.innerHTML = heroImages.map(src => `
    <div class="hero-slide">
      <img class="hero-slide-bg" src="${src}" alt="" aria-hidden="true">
      <img class="hero-slide-fg" src="${src}" alt="Cliente MP Veículos com seu carro">
    </div>
  `).join('');
}

function buildDots() {
  dotsContainer.innerHTML = '';
  heroImages.forEach((_, i) => {
    const dot = document.createElement('span');
    dot.className = `dot ${i === 0 ? 'active' : ''}`;
    dot.dataset.index = i;
    dot.addEventListener('click', () => {
      goToSlide(i);
      resetHeroTimer();
    });
    dotsContainer.appendChild(dot);
  });
}

function goToSlide(index) {
  if (index < 0) index = heroImages.length - 1;
  if (index >= heroImages.length) index = 0;
  currentSlide = index;
  track.style.transform = `translateX(-${currentSlide * 100}%)`;
  dotsContainer.querySelectorAll('.dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === currentSlide);
  });
}

function resetHeroTimer() {
  if (heroTimer) clearInterval(heroTimer);
  heroTimer = setInterval(() => goToSlide(currentSlide + 1), HERO_INTERVAL);
}

function startHeroSlider() {
  if (heroImages.length === 0) return;
  buildHeroSlides();
  buildDots();
  resetHeroTimer();

  document.getElementById('heroNext').addEventListener('click', () => {
    goToSlide(currentSlide + 1);
    resetHeroTimer();
  });
  document.getElementById('heroPrev').addEventListener('click', () => {
    goToSlide(currentSlide - 1);
    resetHeroTimer();
  });

  // Pausa a troca automática enquanto o mouse está sobre o carrossel
  const sliderEl = document.querySelector('.hero-slider');
  sliderEl.addEventListener('mouseenter', () => { if (heroTimer) clearInterval(heroTimer); });
  sliderEl.addEventListener('mouseleave', resetHeroTimer);
}

startHeroSlider();

/* ---------- LIGHTBOX: ampliar fotos do veículo (zoom + arraste) ---------- */
const lightboxOverlay = document.getElementById('lightboxOverlay');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCount = document.getElementById('lightboxCount');
const lightboxPrevBtn = document.getElementById('lightboxPrev');
const lightboxNextBtn = document.getElementById('lightboxNext');

let lightboxIndex = 0;
let isZoomed = false;
let panX = 0, panY = 0, dragStartX = 0, dragStartY = 0, isDragging = false;
const ZOOM_SCALE = 2.2;

function setLightboxImage() {
  const fotos = currentVehicle.fotos;
  lightboxImg.src = fotos[lightboxIndex];
  lightboxImg.alt = `${currentVehicle.marca} ${currentVehicle.modelo} - foto ${lightboxIndex + 1}`;
  lightboxCount.textContent = `${lightboxIndex + 1} / ${fotos.length}`;
  const showNav = fotos.length > 1;
  lightboxPrevBtn.style.display = showNav ? 'flex' : 'none';
  lightboxNextBtn.style.display = showNav ? 'flex' : 'none';
  resetZoom();
}

function resetZoom() {
  isZoomed = false;
  panX = 0; panY = 0;
  lightboxImg.classList.remove('zoomed');
  lightboxImg.style.transform = 'translate(0,0) scale(1)';
}

function openLightbox(index) {
  if (!currentVehicle || !currentVehicle.fotos || !currentVehicle.fotos.length) return;
  lightboxIndex = index;
  setLightboxImage();
  lightboxOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightboxOverlay.classList.remove('open');
  document.body.style.overflow = '';
  resetZoom();
}

function lightboxNextPhoto() {
  if (!currentVehicle.fotos || currentVehicle.fotos.length < 2) return;
  lightboxIndex = (lightboxIndex + 1) % currentVehicle.fotos.length;
  setLightboxImage();
}
function lightboxPrevPhoto() {
  if (!currentVehicle.fotos || currentVehicle.fotos.length < 2) return;
  lightboxIndex = (lightboxIndex - 1 + currentVehicle.fotos.length) % currentVehicle.fotos.length;
  setLightboxImage();
}

// Clique na foto alterna entre ampliada e normal
lightboxImg.addEventListener('click', () => {
  if (isDragging) return;
  if (!isZoomed) {
    isZoomed = true;
    lightboxImg.classList.add('zoomed');
    lightboxImg.style.transform = `scale(${ZOOM_SCALE})`;
  } else {
    resetZoom();
  }
});

// Arrastar com o mouse para mover a foto ampliada
lightboxImg.addEventListener('mousedown', (e) => {
  if (!isZoomed) return;
  isDragging = true;
  lightboxImg.classList.add('dragging');
  dragStartX = e.clientX - panX;
  dragStartY = e.clientY - panY;
  e.preventDefault();
});
window.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  panX = e.clientX - dragStartX;
  panY = e.clientY - dragStartY;
  lightboxImg.style.transform = `translate(${panX}px, ${panY}px) scale(${ZOOM_SCALE})`;
});
window.addEventListener('mouseup', () => {
  if (isDragging) { isDragging = false; lightboxImg.classList.remove('dragging'); }
});

// Arrastar com o dedo (celular/tablet) para mover a foto ampliada
lightboxImg.addEventListener('touchstart', (e) => {
  if (!isZoomed || e.touches.length !== 1) return;
  isDragging = true;
  dragStartX = e.touches[0].clientX - panX;
  dragStartY = e.touches[0].clientY - panY;
}, { passive: true });
lightboxImg.addEventListener('touchmove', (e) => {
  if (!isDragging || e.touches.length !== 1) return;
  panX = e.touches[0].clientX - dragStartX;
  panY = e.touches[0].clientY - dragStartY;
  lightboxImg.style.transform = `translate(${panX}px, ${panY}px) scale(${ZOOM_SCALE})`;
}, { passive: true });
lightboxImg.addEventListener('touchend', () => { isDragging = false; });

document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
lightboxPrevBtn.addEventListener('click', lightboxPrevPhoto);
lightboxNextBtn.addEventListener('click', lightboxNextPhoto);
lightboxOverlay.addEventListener('click', (e) => { if (e.target === lightboxOverlay) closeLightbox(); });
document.addEventListener('keydown', (e) => {
  if (!lightboxOverlay.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowRight') lightboxNextPhoto();
  if (e.key === 'ArrowLeft') lightboxPrevPhoto();
});

render();